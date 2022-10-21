
import faunadb from "faunadb";

const q = faunadb.query;
import { FAUNADB_SECRET, FAUNADB_ENDPOINT } from '$env/static/private';

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

const client = dbClient()

export { client, q }