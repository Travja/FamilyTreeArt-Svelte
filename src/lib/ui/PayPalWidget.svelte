<script lang="ts">
  import { onMount } from 'svelte';
  import type {
    CreateOrderRequestBody,
    OrderResponseBody,
    PayPalButtonsComponentOptions,
    PayPalNamespace,
    PurchaseItem,
    PurchaseUnit
  } from '@paypal/paypal-js';
  import { loadScript } from '@paypal/paypal-js';
  import { get } from 'svelte/store';
  import { calculateTotal, itemTotal, multiSelectEntries, selections, shipping, totalCost } from '../interpreter';
  import { coupon, couponValue } from '../coupon-manager';
  import type { BaseData } from '../conf/TreeArtConfig';
  import { config } from '../conf/config';
  import { api } from '../api';
  import { goto } from '$app/navigation';

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

  const generateItem = (data: BaseData): PurchaseItem => {
    let item: PurchaseItem = {
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
    let payload: CreateOrderRequestBody = {
      purchase_units: [purchaseUnit]
    };

    return payload;
  };

  const setupPayPal = () => {
    // noinspection JSUnusedGlobalSymbols
    const paypalButtonsComponent = paypal.Buttons(<PayPalButtonsComponentOptions>{
      // set up the transaction
      createOrder: async (data, actions) => {
        const createOrderPayload = getPayload();
        const cartId = await actions.order.create(createOrderPayload);

        let saved = await api.saveCart(cartId);
        if (!saved) {
          return Promise.resolve(undefined);
        }

        return Promise.resolve(cartId);
      },

      // finalize the transaction
      onApprove: (data, actions) => {
        const captureOrderHandler = (details: OrderResponseBody) => {
          const payerName = details.payer.name.given_name
            + (!!details.payer.name.surname ? ' '
              + details.payer.name.surname : '');
          const email = details.payer.email_address;
          console.log('Transaction completed');

          goto(`/success?user=${payerName}&email=${email}`);
        };

        return actions.order.capture().then(captureOrderHandler);
      },

      // handle unrecoverable errors
      onError: (err) => {
        console.error('An error prevented the buyer from checking out with PayPal');
        goto('/error');
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