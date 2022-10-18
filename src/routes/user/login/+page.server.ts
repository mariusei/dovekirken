
export const actions: Actions = {
    followLink: async ({ request, cookies }) => {
        const data = await request.formData()
        const emailToken = data.get('emailToken')

        if (!emailToken) return { err: "Token field cant be empty" }

        const isValidToken = await verifyEmailToken(String(emailToken))

        if (isValidToken.err) return {err: isValidToken.err}
        if (!isValidToken.res) return {err: "invalid token"}

        // Retrieve user e-mail
        const email = isValidToken.res.data.email

        // Delete the token from the e-mail
        
        const deletedToken = await deleteEmailToken(String(emailToken))

        if (deletedToken.err) return {err: deletedToken.err}
        if (!deletedToken.res) return {err: "token didn't exist"}

        // Create new browser token

        const newToken = generateToken()
        const addedSessionToken = await addTokenToDB(
            email,
            newToken,
            "userTokens"
        )

        // Create a new session token
        cookies.set("token", newToken)
        cookies.set("email", email)

        // return session token to store

        return {
            status: "Authenticated",
            //user: {
            //    email: email,
            //    token: newToken
            //}
        }


        console.log("received email token for processing: ", emailToken)
    }
}