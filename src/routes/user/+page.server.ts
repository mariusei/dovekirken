import type { PageServerLoad, Actions } from './$types';
import { invalid } from '@sveltejs/kit';

import { APP_HOSTNAME } from '$env/static/private';
import { sendMail } from '$lib/emailer';

import { client, q } from '$lib/db'
import type { Result, FaunaDoc } from '$lib/types';

import {verifyUser, addTokenToDB, generateToken} from '$lib/auth'
import {verifyToken, deleteEmailToken} from '$lib/auth'
import { getRandomEmojis } from '$lib/randEmojis';

/// 1 SEND EMAIL

async function sendMagicLink(email: string, emoji: string): Promise<Result> {

    console.log("In sendMagicLink")

    let out: Result = {}

    const isValidUser = await verifyUser(email);

    if (!isValidUser) {
        out.err = "invalid user"
        return out
    }

    // Generate unique token that is associated with e-mail magic link
    const token = generateToken()

    // Add valid expiring token to DB associated with user
    const addTokenRes = await addTokenToDB({
        email,
        token,
        collection: "userEmailTokens",
        emoji: emoji,
    })

    if (addTokenRes.err) {
        console.error("ERROR!!", addTokenRes.err)
        out.err = addTokenRes.err
        return out
    }

    // Send e-mail to user setting this token as a cookie

    let emailMsgRes = await sendMail({
        fromEmail: "mariusbe@gmail.com",
        fromName: "Marius DK Test Server",
        toName: "Marius",
        toEmail: "mariusbe@gmail.com",
        subject: "DK Innlogging",
        msgText: "Din innlogginslink",
        msgHtml: `
        <h1>Innlogging</h1> 
        <p>Logg inn med linken i e-posten her og velg smileyen du valgte</p>
        <p><a href='${APP_HOSTNAME}/user/login?auth=${token}'>Link</a></p>
        `,
        customID: "MagicLinkDK"
    })

    if (emailMsgRes.err) {
        out.err = emailMsgRes.err
        return out
    }

    out.res = emailMsgRes.res.Messages[0].Status

    return out


}


//// 2 VERIFY E-MAIL TOKEN

////

async function getUser() {
    
    let out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try { 
        let res: FaunaDoc = await client.query(
            q.Let(
            {
                doc: q.Get(q.Ref(q.Collection('users'), '345094312082538704')),
            },
            {
                document: q.Var('doc')
            }
            )
        )
        out.res = res.document.data
    }
    catch (err) {
        console.error(
            'Error: [%s] %s: %s',
            err.name,
            err.message,
            err.errors()[0].description,
        );
        out.err = `Error: [${err.name}] ${err.message}: ${err.errors()[0].description}`
    }

    //console.log("sending out:", out)
    return out

}

export const load: PageServerLoad = ({ locals, cookies }) => {

    // Server hook ensures that user data is available throughout

    return {
        user: locals.user,
        emojis: getRandomEmojis(3)
    }

}

export const actions: Actions = {
    // Checks email

    //check: async ({ request, cookies }) => {
    check: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email')
        const emoji = data.get('emoji')

        if (!email) return { err: "E-mail can't be empty" }
        if (!emoji) return { err: "Emoji can't be empty" }

        if (email) {
            const out = await sendMagicLink(
                String(email),
                String(emoji))

            if (out.err) {
                //return invalid(500, {err : out.err})
                return {err: "Send magic link error: " + String(out.err)}
            }

            return {status: out.res, err: out.err}

        }

        console.log("request:", request)

        return {status: "test status", err: "test error"}
    },

}