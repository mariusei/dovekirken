import { v4 as uuidv4 } from 'uuid';
import { redis } from '$lib/db'

import type { Result, GenericResult, User, FaunaDoc } from '$lib/types'

export async function verifyUser(email: string): Promise<Boolean> {
    console.log("in verifyUser", email, email==="test@test.com")
    if (email === "test@test.com") return true
    
    return false
}


// hset: USER:uuid ID:uuid EMAIL e-mail@email.com NAME val POSITION val ...
// set: emails

export async function addUserToRegistry(email: string) {
    const out: Result = {}

    const key = "uid:" + email

    const callCheckIsRegistered = await redis(
        "get", key
    )

    if (callCheckIsRegistered.res) {
        out.res = {
            uid: callCheckIsRegistered.res,
            email: email }
        return out
    }

    // didn't find it,
    // generates user ID
    const uid = uuidv4()

    const addUID = await redis(
        "set", key, uid
    )

    if (addUID.err) {
        out.err = "Failed associating UID to email: " + addUID.err
        return out
    }

    out.res = {email: email, uid: uid}

    return out

}


export async function makeNewUser(user: User) {
    interface NewUserRes {
        status: string
        userId: string
    }
    const out: GenericResult<string, NewUserRes> = {}

    // Check if user e-mail already exists
    const registerUser = await addUserToRegistry(user.email)
    if (registerUser.err) {
        out.err = registerUser.err
        return out
    }
    const userId = registerUser.res.uid

    //
    await redis(
        "hset", "user:" + userId,
        "id", userId,
        "email", user.email,
        "name", user.name ? user.name : "undefined",
        "position", user.position ? user.position : "undefined",
        "location", user.location ? user.location : "undefined",
        "accessToLocations", user.accessToLocations ? JSON.stringify(user.accessToLocations) : JSON.stringify([]),
        "accessToFunctions", user.accessToFunctions ? JSON.stringify(user.accessToFunctions) : JSON.stringify([]),
    )
    .then(async (response) => {
        if (response.err) {
            throw new Error("Couldn't make new user in DB: " + String(response.err))
        }
        return response.res.status
    })
    .then(async (status) => {
            // everything went ok
            out.res = {status: status, userId: userId}
    })
    .catch((err) => {
        out.err = "Error when adding user to Redis DB: " + String(err)
        return out
    })

    return out

}

interface MyRes {
    userReference: string
}

interface Res2 {
    err?: string
    res?: MyRes
}

export async function findUserInDb(email: string): Promise<Res2> {
    // Searching DB

    // initialize new standard user:
    const out: Res2 = {} 

    const callNewUser = await makeNewUser({
        email: "test@test.com",
        name: "Test Testesen Jr",
        position: "Sekretær",
        location: "Nye Hovedkontoret",
    })

    if (callNewUser.err) {
        if (!callNewUser.err.includes("already")) {
            out.err = callNewUser.err
            return out
        }
    }

    if (!callNewUser.res) {
        out.err = "Didn't find user?"
        return out
    }

    out.res = {userReference: callNewUser.res.userId}

    return out

}

export async function getUser(userReference: any) {

    const out: GenericResult<string, User> = {}

    const key = `user:${userReference}`

    const redisCall: GenericResult<string, User> = await redis(
        "hgetall", key
    )

    if (redisCall.err) {
        out.err = "Error finding user: " + redisCall.err
        return out
    }

    if (!redisCall.res) {
        out.err = "Error - user not found"
        return out
    }

    out.res = redisCall.res

    return out

}


export function generateToken(): string {
    return uuidv4();
}

interface TokenToDB {
    email: string, 
    token: string, 
    collection: string,
    emoji?: string | null,
    userReference?: any | null
}
export async function addTokenToDB({
    email,
    token,
    collection,
    emoji=null,
    userReference=null
    }: TokenToDB ): Promise<Result> {

    let out: Result = {}

    let data = []

    if (!emoji) {
       data =  [
                "email", email,
                "token", token,
                "userReference", userReference
            ]
    } else {
       data =  [
                "email", email,
                "token", token,
                "emoji", emoji
            ]
    }

    // adding this hash set
    const key = `token:${collection}:${token}`

    const callAddToHset = await redis(
        "hset", key, ...data
    )

    if (callAddToHset.err) {
        out.err = "Problem adding token to DB: " + callAddToHset.err
        return out
    }

    let expiralTimeInSeconds = 10
    if (collection === "email") expiralTimeInSeconds = 60*15 // 15 minutes
    if (collection === "session") expiralTimeInSeconds = 60*60 // 1 hour

    const addExpiral = await redis(
        "expire", key, String(expiralTimeInSeconds)
    )

    if (addExpiral.err) {
        out.err = "Problem adding expiry time to token: " + addExpiral.err
        return out
    }
    
    out.res = {key: key}

    return out

}

export async function verifyToken(token: string, collection: string = 'email') {
    const out: Result = {}

    const key = `token:${collection}:${token}`

    const checkTokenHashes = await redis(
        "hgetall", key
    )

    if (checkTokenHashes.err) {
        out.err = "Error verifying token: " + checkTokenHashes.err
        return out
    }

    if (!checkTokenHashes.res) {
        out.err = "Error - token not found"
        return out
    }

    out.res = checkTokenHashes.res


    return out
}

export async function deleteToken(token?: string, collection: string = "email") {

    interface RedisDeleteInterface {
        nDeleted: number
    }
    const out: GenericResult<string, RedisDeleteInterface> = {}

    if (!token) {
        out.err = `No ${collection} token specified!`
        return out
    }

    //const collection = "email"
    const key = `token:${collection}:${token}`

    const redisCall = await redis(
        "del", key
    )

    if (redisCall.err) {
        out.err = "Error deleting token: " + redisCall.err
        return out
    }

    if (!redisCall.res) {
        out.err = "Error - token not found"
        return out
    }

    out.res = {
        nDeleted: redisCall.res
    }

    return out
}