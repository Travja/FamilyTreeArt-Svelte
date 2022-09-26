import type { Coupon, CouponData } from '$lib/conf/TreeArtConfig';
import { json } from '@sveltejs/kit';
import { mongoService, validateCode } from '$lib/mongo';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url, params }): Promise<Response> => {
  let code = params.code;
  let coupon: CouponData = await testCode(code);

  return json(coupon);
};

const testCode = (code: string): Promise<CouponData> => {
  return mongoService.findCertById(code).then((cert: Coupon) => {
    let result = { valid: false, data: undefined };
    if (!cert || (cert.expiry && cert.expiry < new Date())) return result;
    let valid = cert.isCoupon || cert.manual ? true : validateCode(code);

    if (valid) {
      delete cert.manual;
      result.valid = true;
      result.data = cert;
    }

    return result;
  }).catch(err => {
    console.error('Could not fetch code', err);
    return { valid: false };
  });
};