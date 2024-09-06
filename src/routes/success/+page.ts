import { redirect } from '@sveltejs/kit';

export let prerender = false;

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  let searchParams = url.searchParams;

  if (searchParams.get('user')) {
    return {
      user: searchParams.get('user'),
      email: searchParams.get('email')
    };
  }

  throw redirect(302, '/');
}