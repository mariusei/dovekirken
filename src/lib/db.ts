
//import faunadb from "faunadb";
//
//const q = faunadb.query;
//import { FAUNADB_SECRET, FAUNADB_ENDPOINT } from '$env/static/private';
import { REDIS_TOKEN, REDIS_ENDPOINT, REDIS_PORT } from '$env/static/private';

import type { Result } from "$lib/types"

//function dbClient(): faunadb.Client | undefined {
//    if (FAUNADB_SECRET !== undefined && FAUNADB_ENDPOINT !== undefined) {
//
//        const secret = FAUNADB_SECRET;
//        const endpoint = FAUNADB_ENDPOINT;
//
//        type Scheme = "http" | "https"
//        //var mg, domain, port: number, scheme: Scheme
//        var mg = endpoint.match(/^(https?):\/\/([^:]+)(:(\d+))?/)
//        if (!mg) {
//            mg = ["", "https", "db.fauna.com", "", "443"]
//        }
//
//        const scheme: Scheme = <Scheme>mg[1]
//        const domain: string = mg[2]
//        const port: number = Number(mg[4])
//        
//        return new faunadb.Client({
//            secret: secret,
//            domain: domain,
//            port: port,
//            scheme: scheme,
//        })
//
//    } else {
//        
//        return undefined
//    }
//}
//
//const client = dbClient()

async function redis(...args: string[]) {

    const out: Result = {}

    const redisListArgs = JSON.stringify(args) 

    //console.log("IN REDIS", redisListArgs)

    try {
        const res = await fetch(`https://${REDIS_ENDPOINT}/`, {
            body: redisListArgs,
            headers: {
                Authorization: `Bearer ${REDIS_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        })

        if (!res.ok) {
            out.err =
                `Redis DB call failed w status: ${res.status} - ${res.statusText}`
            return out
        }

        const data = await res.json()

        out.err = data.error
        // convert to object
        if (Array.isArray(data.result)) {
            if (data.result.length == 0) {
                out.res = null
                return out
            }
            if (data.result.length % 2 == 0) {
                const keys = data.result.filter((_, ix) => ix%2==0)
                const values = data.result.filter((_, ix) => ix%2==1)

                let obj = {}

                keys.forEach((el, ix) => {
                    obj[el] = values[ix]
                })

                out.res = obj
                return out
            }
        }

        out.res = data.result // see API docs
        return out

    } catch(err) {
        out.err = String(err)
        console.error(err)
        return out
    }


}

//export { client, q, redis }
export { redis }