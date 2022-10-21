import type { Handle } from '@sveltejs/kit';

import { getUser, verifyToken } from '$lib/auth'
 
export const handle: Handle = async ({ event, resolve }) => {
  // we have the response, will await it once appropriate
  //const response = resolve(event)

  // verify that token is valid
  const token = event.cookies.get('session')

  if (!token) return await resolve(event)

  const userRefData = await verifyToken(token, 'ixTokens' )
  
  if (userRefData.err) return await resolve(event)

  // retrieve user info
  const userRef = userRefData.res.data.userReference

  // retrieve user rights
  const user = await getUser(userRef)

  if (user.err) return await resolve(event)

  event.locals.user = user.res.data

  return await resolve(event) //response

  //const response = await resolve(event);
  //response.headers.set('x-custom-header', 'potato');
 
  //return response;
}