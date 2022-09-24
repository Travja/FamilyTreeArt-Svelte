<script lang="ts">
  import type { Coupon } from '../conf/TreeArtConfig';

  let code = '';
  let error = '';
  let coupon: Coupon;

  $: {

  }

  const checkCoupon = () => {
    // TODO Check the coupon against the backend
    let url = '/checkcode/' + code.toLowerCase();
    fetch(url)
      .then(response => response.json())
      .then((data: Coupon) => {
        console.log(data);
        if (data.valid) {
          coupon = data;
          // TODO update the pricing information :D

          error = '';
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
           bind:value={code}>
    <button id="applyCoupon" on:click={checkCoupon}>Apply</button>
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