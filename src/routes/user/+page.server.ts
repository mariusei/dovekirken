import type { PageServerLoad, Actions } from './$types';

//import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
//import faunadb, { query as q } from "faunadb";
import faunadb from "faunadb";

const q = faunadb.query;
import { FAUNADB_SECRET, FAUNADB_ENDPOINT } from '$env/static/private';
import { invalid } from '@sveltejs/kit';

type MyErr = string

interface Result {
    res?: any,
    err?: string
}

type FaunaDoc = {
    document: { ref: any, ts: number, data: object }
}


function dbClient(): faunadb.Client | undefined {
    if (FAUNADB_SECRET !== undefined && FAUNADB_ENDPOINT !== undefined) {

        const secret = FAUNADB_SECRET;
        const endpoint = FAUNADB_ENDPOINT;

        type Scheme = "http" | "https"
        //var mg, domain, port: number, scheme: Scheme
        var mg = endpoint.match(/^(https?):\/\/([^:]+)(:(\d+))?/)
        if (!mg) {
            mg = ["", "https", "db.fauna.com", "", "443"]
        }

        const scheme: Scheme = <Scheme>mg[1]
        const domain: string = mg[2]
        const port: number = Number(mg[4])
        
        return new faunadb.Client({
            secret: secret,
            domain: domain,
            port: port,
            scheme: scheme,
        })

    } else {
        
        return undefined
    }
}

const client = dbClient();

/////


/*  Checks DB to see if user is among the 
    authorized ones
*/
async function verifyUser(email: String): Promise<Boolean> {
    console.log("in verifyUser", email, email==="test@test.com")
    if (email === "test@test.com") return true
    
    return false
}

function generateToken(): String {
    //return crypto.randomUUID();
    return uuidv4();
}

async function addTokenToDB(email: String, token: String): Promise<Result> {

    let out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try {
        const ret = await client.query(
            q.Create(
                q.Collection("userEmailTokens"),
                {
                    data: {
                        "email": email,
                        "token": token
                    }
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

/**
 * Sends magic link to authorized users
 * @param email 
 * @returns magic link 
 */
async function sendMagicLink(email: String): Promise<Result> {

    console.log("In sendMagicLink")

    let out: Result = {}

    const isValidUser = await verifyUser(email);

    if (!isValidUser) {
        out.err = "invalid user"
        return out
    }

    // Add valid expiring token to DB associated with user
    const addTokenRes = await addTokenToDB(
        email,
        generateToken()
    )

    if (addTokenRes.err) {
        console.error("ERROR!!", addTokenRes.err)
        out.err = addTokenRes.err
        return out
    }

    // Send e-mail to user setting this token as a cookie
    out.res = "Email sent"

    return out


}


////

async function verifyEmailToken(token: String) {
    const out: Result = {}

    if (!client) {
        out.err = "No DB connection";
        return out
    }

    try {
        const ret = await client.query(
            q.IsNonEmpty(q.Match("ixEmailTokens", token))
        )

        console.log("verify email token response:", ret)
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

export const load: PageServerLoad = ({ cookies }) => {
    return getUser();
}

export const actions: Actions = {
    // Checks email

    check: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email')

        if (!email) return { err: "E-mail can't be empty" }

        if (email) {
            const out = await sendMagicLink(String(email))

            if (out.err) {
                return invalid(500, {err : out.err})
            }

            return {status: out.res, err: out.err}

        }
    },

    followLink: async ({ request, cookies }) => {
        const data = await request.formData()
        const emailToken = data.get('emailToken')

        if (!emailToken) return { err: "Token field cant be empty" }

        const isValidToken = await verifyEmailToken(String(emailToken))

        if (isValidToken.err) return {err: isValidToken.err}
        if (!isValidToken.res) return {err: "invalid token"}
        if (isValidToken.res) {
            // Delete  it

            // Create a new session token
            cookies.set("auth", emailToken)

            // return session token to store

            return {
                status: "valid token"
            }
        }


        console.log("received email token for processing: ", emailToken)
    }

}