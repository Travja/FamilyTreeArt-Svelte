import type { Coupon } from '$lib/conf/TreeArtConfig';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = ({ url, params }): Response => {
  let code = params.code;

  console.log(code);
  let coupon: Coupon = {
    valid: false
  };

  return json(coupon);
};