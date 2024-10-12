import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { Coupon } from '../types/coupon';

export const coupon: Writable<Coupon> = writable();
export const couponValue: Writable<number> = writable(0);

export const applyCoupon = (coup: Coupon) => coupon.set(coup);
