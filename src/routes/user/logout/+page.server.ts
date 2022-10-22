
import type { PageServerLoad } from "./$types";
import type { Result } from "$lib/types"

export const load: PageServerLoad = async ({cookies, url}) => {

    const out: Result = {}

    cookies.delete("session")

    out.res = "deleted cookie"

    return out


}