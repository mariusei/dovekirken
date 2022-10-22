import type { PageServerLoad, Actions } from "./$types";
import type { Result } from '$lib/types'

import { generateToken, addTokenToDB, verifyToken, deleteEmailToken } from '$lib/auth';
import { findUserInDb } from "$lib/auth";
import { getRandomEmojisAndReplaceOne } from "$lib/randEmojis";


export const load: PageServerLoad = async ({ cookies, url }) => {

    const out: Result = {}

    // User follows login URL
    const auth: String | null = url.searchParams.get("auth")

    if (!auth) {
        out.err = "Auth not defined"
        return out
    }

    console.log("proceeding to verufy token")

    // Verify whether user email token exists
    const isValidToken = await verifyToken(String(auth))

    if (isValidToken.err) {
        out.err = isValidToken.err
        return out
    }

    console.log("have email and emoji?", isValidToken)

    const emoji = isValidToken.res.data.emoji
    const email = isValidToken.res.data.email

    // Return possible emojis for user to choose from
    const emojis = getRandomEmojisAndReplaceOne(3, emoji)

    out.res = {
        token: String(auth),
        emojis: emojis
    }

    return out
}

export const actions: Actions = {
    // Form actions
    // checks if user chooses correct emoji
    // and then stores the user data to the store

    check: async ({ cookies, request }) => {
        const form = await request.formData()

        const emojiChosen = form.get('emoji')
        const emailToken = form.get("token")

        if (!emailToken) return { err: "Token field cant be empty" }
        const isValidToken = await verifyToken(String(emailToken))

        const correctEmoji = isValidToken.res.data.emoji

        if (isValidToken.err) return {err: isValidToken.err}
        if (!isValidToken.res) return {err: "invalid token"}

        // Delete the token from the e-mail
        const deletedToken = await deleteEmailToken(String(emailToken))

        if (deletedToken.err) return {err: deletedToken.err}
        if (!deletedToken.res) return {err: "token didn't exist"}

        // verify user seleceted emoji
        console.log(isValidToken.res, isValidToken.res.emoji, emojiChosen)
        if (!(correctEmoji == emojiChosen)) return {err: "invalid emoji"}

        // Retrieve user e-mail
        const email = isValidToken.res.data.email

        // Retriever user ID
        const userInDb = await findUserInDb(email)

        if (userInDb.err) return {err: userInDb.err}
        if (!userInDb.res) return {err: "user does not exist?"}

        const userRef = userInDb.res.ref


        // Create new browser token
        const newToken = generateToken()
        const addedSessionToken = await addTokenToDB({
            email: email,
            token: newToken,
            collection: "userTokens",
            userReference: userRef
        })

        // Create a new session cookie
        cookies.set("session", newToken)

        // return session token to store

        return {
            status: "Authenticated",
        }

    }
}

