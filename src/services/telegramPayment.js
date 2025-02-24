import { miniApp } from '@telegram-apps/sdk';
import shared from '../Shared';

// Test payment provider token cho Stripe (TEST)
const TEST_PAYMENT_PROVIDER = '';
const BASE_URL = `https://api.telegram.org/bot${shared.bot_token}/test/createInvoiceLink`;

export const telegramPayment = {
  async createInvoiceLink(product) {
    try {
      const data = {
        title: product.amount + " Starlets",
        description: "Purchase " + product.amount + " Starlets and 10 Tickets",
        payload: "starlets_" + product.amount,
        provider_token: "", // Để trống cho Stars payment
        currency: "XTR", // XTR là currency code cho Stars
        prices: [{
          label: product.amount + " Starlets",
          amount: product.stars * 100
        }],
        start_parameter: "starlets_purchase"
      };
      
      console.log('Creating invoice with data:', data);
      console.log('API URL:', BASE_URL);
      
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const jsonResponse = await response.json();
      console.log('Invoice response:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export const handleStarletsPurchase = async (product) => {
  try {
    const response = await telegramPayment.createInvoiceLink(product);
    console.log('Payment response:', response);
    
    if (response.ok && response.result) {
      console.log('Generated invoice link:', response.result);
      
      // Gọi trực tiếp openInvoice với callback
      return window.Telegram.WebApp.openInvoice(response.result, (status) => {
        if (status === "paid") {
          console.log("Payment successful!");
          return true;
        }
      });
    } else {
      console.error('Failed response:', response);
      throw new Error(`Failed to create invoice link: ${JSON.stringify(response)}`);
    }
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
}; 