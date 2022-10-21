
export interface Result {
    res?: any,
    err?: string, 
}

export interface User {
    name?: string,
    email: string,
    location?: string,
    position?: string,
    accessToLocations?: Array<string>,
    accessToFunctions?: Array<string>,
}

export type FaunaDoc = {
    document: { ref: any, ts: number, data: object }
}
