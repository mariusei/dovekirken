
export interface Result {
    res?: any,
    err?: string, 
}

export interface GenericResult<K,V> {
    err?: K
    res?: V
}


export interface User {
    name?: string,
    email: string,
    location?: string,
    position?: string,
    accessToLocations?: Array<string> | string,
    accessToFunctions?: Array<string> | string,
}

export type FaunaDoc = {
    document: { ref: any, ts: number, data: object }
}
