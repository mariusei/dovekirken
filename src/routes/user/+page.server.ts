import type { PageServerLoad, Actions } from './$types';
import { invalid } from '@sveltejs/kit';

import { APP_HOSTNAME } from '$env/static/private';
import { sendMail } from '$lib/emailer';

import { client, q, redis } from '$lib/db'
import type { Result, GenericResult, User, FaunaDoc } from '$lib/types';

import {verifyUser, addTokenToDB, generateToken} from '$lib/auth'
import {verifyToken, deleteToken} from '$lib/auth'
import { getRandomEmojis } from '$lib/randEmojis';

/// 1 SEND EMAIL

async function sendMagicLink(email: string, emoji: string): Promise<Result> {

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
        collection: "email",
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
        msgText: "Din innlogginslink er ${APP_HOSTNAME}/user/login?auth=${token}",
        msgHtml: `
        <h1>Innlogging</h1> 
        <p>Logg inn med linken i e-posten her og velg smileyen du valgte</p>
        <p><a href='${APP_HOSTNAME}/user/login?auth=${token}'>Link</a></p>
        <br />
        <p>Eller kopier og lim inn denne adressen i nettleseren din:</p>
        <p>${APP_HOSTNAME}/user/login?auth=${token}</p>
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

export const load: PageServerLoad = async ({ locals, cookies }) => {

    // Server hook ensures that user data is available throughout
    interface UserPageType {
        user: User,
        emojis?: string[],
    }

    const out: GenericResult<string, UserPageType> = {}
    const myRes: UserPageType = {
        user: locals.user,
        emojis: getRandomEmojis(3)
    }

    out.res = myRes

    return out


}

interface TypeAction {
    currentSessionToken?: string
    status?: string
}
export const actions: Actions = {
    // Checks email

    //check: async ({ request, cookies }) => {
    check: async ({ request }) => {
        const out: GenericResult<string, TypeAction> = {}

        const data = await request.formData();
        if (!data) return { err: "Du må følge linken i e-posten"}

        const email = data.get('email')
        const emoji = data.get('emoji')

        if (!email) return { err: "E-mail can't be empty" }
        if (!emoji) return { err: "Emoji can't be empty" }

        const magicLinkRes = await sendMagicLink(
            String(email),
            String(emoji))

        if (magicLinkRes.err) {
            //return invalid(500, {err : out.err})
            out.err = "Send magic link error: " + String(out.err)
            return out
        }

        if (magicLinkRes.res === 'success') {
            out.res = {status: "Trykk på linken i e-posten som ble sendt til deg."}
        }

        return out

    },

    logout: async ({ cookies }) => {

        const out: GenericResult<string,TypeAction> = {}

        const delResult = await deleteToken(cookies.get("session"), "session")

        if (delResult.err) {
            out.err = "Failed deleting session token: " + delResult.err
            return out
        }

        cookies.delete('session')

        out.res = {currentSessionToken: cookies.get("session")}

        return out

    }

}


