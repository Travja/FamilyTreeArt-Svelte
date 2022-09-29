<script lang="ts">
  import type { Coupon, CouponData } from '../conf/TreeArtConfig';
  import { applyCoupon } from '../coupon-manager';
  import { api } from '../api';

  let code = '';
  let error = '';
  let coupon: Coupon;

  const checkCoupon = (e) => {
    if (e.key && e.key != 'Enter') return;
    // TODO Check the coupon against the backend
    api.checkCoupon(code.toLowerCase())
      .then(response => response.json())
      .then((data: CouponData) => {
        if (data.valid) {
          coupon = data.data;

          error = '';
          applyCoupon(coupon);
          code = '';
        } else {
          error = 'Invalid code';
        }
      }).catch(() => {
      error = 'The request failed';
    });
  };
</script>


<div id="couponWrapper">
  <div id="couponErr">{error}</div>
  <div id="inputGroup">
    <input id="couponBox" placeholder="Enter Coupon/Certificate Code"
           on:keypress={checkCoupon}
           bind:value={code}>
    <button id="applyCoupon"
            on:click={checkCoupon}>
      Apply
    </button>
  </div>
</div>

<style>
  #couponWrapper, #inputGroup {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #couponWrapper {
    flex-direction: column;
  }

  #couponErr {
    color: #ff0000;
    font-weight: bold;
  }

  #couponBox {
    width: 14em;
    margin-right: 1rem;
  }

  #applyCoupon {
    float: none;
    padding: 5px;
    font-size: 1em;
  }
</style>