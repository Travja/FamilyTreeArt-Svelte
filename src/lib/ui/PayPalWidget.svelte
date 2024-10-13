<script lang='ts'>
  import { onMount } from 'svelte';
  import type {
    CreateOrderRequestBody,
    OrderResponseBody,
    PayPalButtonsComponentOptions,
    PayPalNamespace,
    PurchaseUnit
  } from '@paypal/paypal-js';
  import { loadScript } from '@paypal/paypal-js';
  import { get } from 'svelte/store';
  import { calculateTotal, itemTotal, multiSelectEntries, selections, shipping, totalCost } from '../interpreter';
  import { coupon, couponValue } from '../coupon-manager';
  import { config } from '../conf/config';
  import { api } from '../api';
  import { goto } from '$app/navigation';
  import FancyInput from '$lib/ui/FancyInput.svelte';
  import type { components } from '@paypal/paypal-js/types/apis/openapi/checkout_orders_v2';
  import type { BaseData } from '../../types/data';

  let paypal: PayPalNamespace;
  const style = { // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
    color: 'gold',
    shape: 'rect',
    layout: 'vertical'
  };

  onMount(() => {
    if ($totalCost > 0) {
      loadScript({ 'clientId': 'AS7YWa9oRXe4_aenz3gqNkmmL-rucRLE2CMO5YSSVpzRwdr7nHpp5UOe_KQ5zDTwAzhrH8Li8XfzJybH' })
        .then(pp => {
          paypal = pp;
          setupPayPal();
        });
    }
  });

  const generateItem = (data: BaseData): components['schemas']['item'] => {
    let item: components['schemas']['item'] = {
      name: '',
      quantity: '0',
      unit_amount: {
        currency_code: 'USD',
        value: '0'
      },
      description: '',
      category: 'DIGITAL_GOODS'
    };

    item.name = data.summaryText
      || data.key
      || data.displayText
      || JSON.stringify(data);

    item.quantity = '1';
    item.unit_amount.value = calculateTotal(data).toFixed(2);
    item.description = data.description || '';

    return item;
  };

  const getPayload = () => {
    let shippingCost = get(shipping).toFixed(2);
    const discount = get(couponValue).toFixed(2);
    let purchaseUnit: PurchaseUnit = {
      description: 'Family Tree',
      amount: {
        currency_code: 'USD',
        value: get(totalCost).toFixed(2),
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: get(itemTotal).toFixed(2)
          },
          shipping: {
            currency_code: 'USD',
            value: shippingCost
          }
        }
      },
      items: []
    };

    let coup = get(coupon);
    let discObj = {
      currency_code: 'USD',
      value: discount
    };

    if (coup) {
      purchaseUnit.custom_id = `Coupon used: ${coup.code} ($${discObj.value})`;
      if (coup.target == 'shipping') purchaseUnit.amount.breakdown.shipping_discount = discObj;
      else purchaseUnit.amount.breakdown.discount = discObj;
    }

    Object.entries(get(selections)).forEach(([key, data]) => {
      if (typeof (data) != 'object' || (!data.cost && !data.values)) return;
      if (key == 'shipping') return;
      purchaseUnit.items.push(generateItem(data));
    });

    Object.entries(get(multiSelectEntries)).forEach(([key, multData]) => {
      const currentData = config.getMultiSelectData(key);

      multData.forEach(data => {
        const qty = data[currentData.quantifier];
        const unitPrice = currentData.getUnitPrice(data);

        purchaseUnit.items.push({
          name: currentData.formatPaypal(data),
          quantity: qty.toString(),
          unit_amount: {
            currency_code: 'USD',
            value: unitPrice.toFixed(2)
          },
          category: 'DIGITAL_GOODS'
        });
      });
    });

    // pass in any options from the v2 orders create call:
    // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
    const payload: CreateOrderRequestBody = {
      intent: 'CAPTURE',
      purchase_units: [purchaseUnit]
    };

    return payload;
  };

  let setup = false;
  const setupPayPal = () => {
    if (setup) return;
    setup = true;
    // noinspection JSUnusedGlobalSymbols
    const paypalButtonsComponent = paypal.Buttons(<PayPalButtonsComponentOptions>{
      // set up the transaction
      createOrder: async (data, actions) => {
        const createOrderPayload = getPayload();
        const cartId = await actions.order.create(createOrderPayload);

        const ret = await api.saveCart(cartId);
        const saved: boolean = ret[0];
        const code: number = ret[1];
        if (!saved) {
          return Promise.resolve(undefined);
        }

        return Promise.resolve(cartId);
      },

      // finalize the transaction
      onApprove: async (data, actions) => {
        const captureOrderHandler = (details: OrderResponseBody) => {
          // noinspection JSDeprecatedSymbols
          const payer = details.payment_source?.paypal || details.payer;
          const payerName = payer.name.given_name
            + (!!payer.name.surname ? ' '
              + payer.name.surname : '');
          const email = payer.email_address;
          console.log('Transaction completed');

          goto(`/success?user=${encodeURIComponent(payerName)}&email=${encodeURIComponent(email)}`);
        };

        let details = await actions.order.capture();
        return captureOrderHandler(details);
      },

      // handle unrecoverable errors
      onError: (err) => {
        console.error('An error prevented the buyer from checking out with PayPal', err);
        goto('/error');
      },
      style
    });

    paypalButtonsComponent
      .render('#checkout')
      .catch((err) => {
        console.error('PayPal Buttons failed to render', err);
      });
  };

  $: if ($totalCost > 0) {
    if (paypal)
      setTimeout(setupPayPal, 500);
  } else {
    setup = false;
  }

  let payerName: string;
  let payerEmail: string;
  let payerAddress: string;
  let payerAddressTwo: string;
  let payerCity: string;
  let payerState: string;
  let payerZip: string;
  let payerCountryCode: string;

  let processing = false;
  let dots = '';
  let error = '';
  const submitCustom = (): void => {
    let shippingInfo = {
      payerName,
      payerEmail,
      payerAddress,
      payerAddressTwo,
      payerCity,
      payerState,
      payerZip,
      payerCountryCode
    };
    processing = true;
    const interval = setInterval(() => {
      if (dots.length > 4)
        dots = '';
      dots += '.';
    }, 500, 500);
    api.saveCart(undefined, shippingInfo)
      .then(ret => {
        processing = false;
        const isSuccessful: boolean = ret[0];
        const code: number = ret[1];
        clearInterval(interval);

        if (isSuccessful) goto(`/success?user=${payerName}&email=${payerEmail}`);
        else if (code == 404) error = 'Bad code used. Please try a different one.';
        else goto(`/error`);
      });
  };
</script>

{#if $totalCost > 0}
  <div>
    <div id='pay-later'></div>
    <div id='checkout'></div>
  </div>
{:else}
  <hr />
  <h3 class='center'>Please enter your Shipping Information</h3>
  <form id='customForm' on:submit|preventDefault={submitCustom}>
    <FancyInput id='payer-name' required={true} bind:value={payerName}>Name</FancyInput>
    <FancyInput id='payer-email'
                pattern={'[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'}
                title='Please enter a valid email'
                bind:value={payerEmail}
                required={true}>
      Email
    </FancyInput>
    <FancyInput id='payer-address' required={true} bind:value={payerAddress}>Street Address</FancyInput>
    <FancyInput id='payer-address-two' bind:value={payerAddressTwo}>Apt No. (Optional)</FancyInput>
    <FancyInput id='payer-city' required={true} bind:value={payerCity}>City</FancyInput>
    <FancyInput id='payer-state' required={true} bind:value={payerState}>State</FancyInput>
    <FancyInput id='payer-zip' required={true} bind:value={payerZip}>Zip</FancyInput>
    <FancyInput id='payer-country-code' required={true} bind:value={payerCountryCode}>Country Code</FancyInput>

    {#if error}
      <div class='error'>{error}</div>
    {/if}
    <button id='complete-order' disabled='{processing}'>
      {processing ? 'Processing' + dots : 'Complete Order'}
    </button>
  </form>
{/if}

<style>
    #checkout, #pay-later {
        width: 55%;
        text-align: center;
        margin: 0 auto;
    }

    #customForm {
        margin: 0 auto;
        width: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>