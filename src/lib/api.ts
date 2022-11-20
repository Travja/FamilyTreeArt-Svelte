import type { CartInfo } from './conf/TreeArtConfig';
import { itemTotal, multiSelectEntries, selections } from './interpreter';
import { get } from 'svelte/store';
import { coupon, couponValue } from './coupon-manager';

class Api {
  private apiUrl = import.meta.env.VITE_API_URL || '';

  checkCoupon = (code: string): Promise<any> => {
    return fetch(`${this.apiUrl}/coupon/${code.toLowerCase()}`);
  };

  saveCart = async (paypalCartId: string, custom?: any): Promise<[boolean, number]> => {
    let cartInfo: CartInfo = {
      paypalCartId,
      selections: get(selections),
      multiselect: get(multiSelectEntries),
      coupon: get(coupon),
      cost: get(itemTotal),
      custom
    };
    if (cartInfo.coupon) {
      cartInfo.coupon.value = get(couponValue);
    }

    let url = `${this.apiUrl}/cart${cartInfo.custom ? '/internal' : ''}`;

    return new Promise<[boolean, number]>(resolve => {
      fetch(url, {
        method: 'post',
        body: JSON.stringify(cartInfo),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status != 201 && res.status != 200) {
          resolve([false, res.status]);
        }
        resolve([true, res.status]);
      }).catch(e => {
        console.error(e);
        resolve([false, -1]);
      });
    });
  };
}

export const api = new Api();