import type { PageServerLoad, Actions } from "./$types";
import type { Result } from '$lib/types'

import { generateToken, addTokenToDB, verifyToken, deleteToken } from '$lib/auth';
import { findUserInDb } from "$lib/auth";
import { getRandomEmojisAndReplaceOne } from "$lib/randEmojis";


export const load: PageServerLoad = async ({ cookies, url }) => {

    const out: Result = {}

    // User follows login URL
    const auth: String | null = url.searchParams.get("auth")

    // User is logged in
    const isLoggedIn = cookies.get("session")

    if (!auth && !isLoggedIn) {
        out.err = "No valid e-mail token was found, please try again"
        return out
    }

    if (isLoggedIn) {
        out.res = {loggedIn: "Du er logget inn"}
        return out
    }

    // Auth e-mail token was found and user is not signed in
    // lets verify the user info

    //console.log("proceeding to verufy token")

    // Verify whether user email token exists
    const isValidToken = await verifyToken(String(auth))

    if (isValidToken.err) {
        out.err = isValidToken.err
        return out
    }

    const emoji = isValidToken.res.emoji
    const email = isValidToken.res.email

    // Return possible emojis for user to choose from
    const emojis = getRandomEmojisAndReplaceOne(3, emoji)

    out.res = { 
        login : {
            token: String(auth),
            emojis: emojis
        }
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
        if (isValidToken.err) return {err: isValidToken.err}
        if (!isValidToken.res) return {err: "invalid token"}

        const correctEmoji = isValidToken.res.emoji

        // Delete the token from the e-mail
        const deletedToken = await deleteToken(String(emailToken))

        if (deletedToken.err) return {err: deletedToken.err}
        if (!deletedToken.res) return {err: "token didn't exist"}

        // verify user seleceted emoji
        //console.log(isValidToken.res, isValidToken.res.emoji, emojiChosen)
        if (!(correctEmoji == emojiChosen)) return {err: "invalid emoji"}

        // Retrieve user e-mail
        const email = isValidToken.res.email

        // Retriever user ID
        const userInDb = await findUserInDb(email)

        if (userInDb.err) return {err: userInDb.err}
        if (!userInDb.res) return {err: "user does not exist?"}

        const userRef = userInDb.res.userReference


        // Create new browser token
        const newToken = generateToken()
        const addedSessionToken = await addTokenToDB({
            email: email,
            token: newToken,
            collection: "session",
            userReference: userRef
        })

        // Create a new session cookie
        cookies.set("session", newToken, {path: "/"})

        // return session token to store

        return {
            status: "Authenticated",
        }

    }
}

