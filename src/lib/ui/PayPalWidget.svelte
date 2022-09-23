<script lang="ts">
  import { onMount } from 'svelte';
  import type { CreateOrderRequestBody, PayPalButtonsComponentOptions, PayPalNamespace } from '@paypal/paypal-js';
  import { loadScript } from '@paypal/paypal-js';

  let paypal: PayPalNamespace;
  const style = { // https://developer.paypal.com/docs/checkout/standard/customize/buttons-style-guide/
    color: 'gold',
    shape: 'rect',
    layout: 'vertical'
  };

  onMount(() => {
    loadScript({ 'client-id': 'AS7YWa9oRXe4_aenz3gqNkmmL-rucRLE2CMO5YSSVpzRwdr7nHpp5UOe_KQ5zDTwAzhrH8Li8XfzJybH' })
      .then(pp => {
        paypal = pp;
        setupPayPal();
      });
  });

  const getPayload = () => {
    // TODO: Get the order payload from the selections
    // pass in any options from the v2 orders create call:
    // https://developer.paypal.com/api/orders/v2/#orders-create-request-body
    let payload: CreateOrderRequestBody = {
      purchase_units: [
        {
          amount: {
            value: '88.44'
          }
        }
      ]
    };

    return payload;
  };

  const setupPayPal = () => {
    // noinspection JSUnusedGlobalSymbols
    const paypalButtonsComponent = paypal.Buttons(<PayPalButtonsComponentOptions>{
      // set up the transaction
      createOrder: (data, actions) => {
        const createOrderPayload = getPayload();
        return actions.order.create(createOrderPayload);
      },

      // finalize the transaction
      onApprove: (data, actions) => {
        const captureOrderHandler = (details) => {
          const payerName = details.payer.name.given_name;
          console.log('Transaction completed');
        };

        return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err) => {
        console.error('An error prevented the buyer from checking out with PayPal');
      },
      style
    });

    paypalButtonsComponent
      .render('#checkout')
      .catch((err) => {
        console.error('PayPal Buttons failed to render');
      });
  };
</script>

<div id="pay-later"></div>
<div id="checkout"></div>

<style>
  #checkout, #pay-later {
    width: 55%;
    text-align: center;
    margin: 0 auto;
  }
</style>