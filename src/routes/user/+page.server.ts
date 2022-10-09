import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
    console.log(cookies)
    return {hei: "test"}
}