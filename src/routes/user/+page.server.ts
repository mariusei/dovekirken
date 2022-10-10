import type { PageServerLoad, Actions } from './$types';
//import faunadb, { query as q } from "faunadb";
import faunadb from "faunadb";
const q = faunadb.query;
import { FAUNADB_SECRET, FAUNADB_ENDPOINT } from '$env/static/private';

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
    console.log(cookies);
    return getUser();
}