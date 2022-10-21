import { v4 as uuidv4 } from 'uuid';
import { client, q } from '$lib/db'

import type { Result, User, FaunaDoc } from '$lib/types'

export async function verifyUser(email: string): Promise<Boolean> {
    console.log("in verifyUser", email, email==="test@test.com")
    if (email === "test@test.com") return true
    
    return false
}

export async function findUserInDb(email: string): Promise<Result> {
    // Searching DB

    const out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try {
        const ret: FaunaDoc = await client.query(
            q.Get(q.Match("userEmails", email))
        )

        // Returns a document with reference in ref
        out.res = ret

    } catch (err) {
        const emsg = 
            `Error: ` +
            `[${err.name}] ${err.message}: ${err.errors()[0].description}`
        console.error(emsg)
        out.err = emsg
    }

    return out

}

export async function getUser(userReference: any): Promise<Result> {

    const out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try {
        const ret: FaunaDoc = await client.query(
            q.Get(userReference)
        )

        // Returns a document with the user data
        out.res = ret

    } catch (err) {
        const emsg = 
            `Error: ` +
            `[${err.name}] ${err.message}: ${err.errors()[0].description}`
        console.error(emsg)
        out.err = emsg
    }

    return out

}

//export async function getUserInformation(sessionId: string): Promise<User> {
//    // Verifies and uses session ID to retrieve user permissions
//    const user = await verifyToken(String(sessionId), )
//
//}

export function generateToken(): string {
    //return crypto.randomUUID();
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

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    let data: Object = {}

    if (!emoji) {
       data =  {
                "email": email,
                "token": token,
                "userReference": userReference
            }
    } else {
       data =  {
                "email": email,
                "token": token,
                "emoji": emoji
            }
    }

    try {
        const ret = await client.query(
            q.Create(
                q.Collection(collection),
                {
                    data: data
                }
            )
        )

        out.res = ret

    } catch (err) {
        const emsg = 
            `Error: ` +
            `[${err.name}] ${err.message}: ${err.errors()[0].description}`
        console.error(emsg)
        out.err = emsg
    }

    return out

}

export async function verifyToken(token: string, dbIndex: string = 'ixEmailTokens') {
    const out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try {
        const ret: FaunaDoc = await client.query(
            q.Get(q.Match(dbIndex, token))
        )

        out.res = ret

    } catch (err) {
        const emsg = 
            `Error: ` +
            `[${err.name}] ${err.message}: ${err.errors()[0].description}`
        console.error(emsg)
        out.err = emsg
    }

    return out
}

export async function deleteEmailToken(token: string) {
    const out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try {
        const ret = await client.query(
            q.Map(
                q.Paginate(q.Match("ixEmailTokens", token)), 
                q.Delete)
        )

        out.res = ret

    } catch (err) {
        const emsg = 
            `Error: ` +
            `[${err.name}] ${err.message}: ${err.errors()[0].description}`
        console.error(emsg)
        out.err = emsg
    }

    return out
}