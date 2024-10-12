export interface CouponData {
  valid: boolean;
  data?: Coupon;
}

export interface Coupon {
  code: string;
  expiry: Date;
  value: number;
  coupon: boolean;
  target: string;
  manuallyCreated: boolean;
}
