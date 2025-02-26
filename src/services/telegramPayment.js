import shared from '../Shared';

// Test payment provider token cho Stripe (TEST)
const TEST_PAYMENT_PROVIDER = '';
const BASE_URL = `https://api.telegram.org/bot${shared.bot_token}/test/createInvoiceLink`;
const MOCK_PAYMENT = true; // Toggle này để bật/tắt mock payment

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
          amount: product.stars
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
  },

  async answerPreCheckoutQuery(preCheckoutQueryId, ok = true, errorMessage = null) {
    try {
      const data = {
        pre_checkout_query_id: preCheckoutQueryId,
        ok: ok,
        error_message: errorMessage
      };

      console.log('Answering pre-checkout query:', data);
      const response = await fetch(`${BASE_URL}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const jsonResponse = await response.json();
      console.log('Pre-checkout response:', jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error('Pre-checkout Error:', error);
      throw error;
    }
  }
};

export const handleStarletsPurchase = async (product) => {
  try {
    if (MOCK_PAYMENT) {
      console.log('Using mock payment for:', product);
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Mock payment successful!");
          resolve({
            status: "paid",
            amount: product.stars,
            currency: "XTR",
            payload: "starlets_" + product.amount
          });
        }, 1000);
      });
    }

    const response = await telegramPayment.createInvoiceLink(product);
    console.log('Payment response:', response);
    
    if (response.ok && response.result) {
      console.log('Generated invoice link:', response.result);
      
      return new Promise((resolve) => {
        window.Telegram.WebApp.openInvoice(response.result, (status) => {
          console.log("Payment status:", status);
          if (status === "paid") {
            console.log("Payment successful!");
            resolve({ 
              status: "paid",
              amount: product.stars,
              currency: "XTR",
              payload: "starlets_" + product.amount
            });
          } else if (status === "failed") {
            console.error("Payment failed");
            resolve({ status: "failed" });
          } else if (status === "pending") {
            console.log("Payment pending...");
            resolve({ status: "pending" });
          } else if (status === "cancelled") {
            console.log("Payment cancelled by user");
            resolve({ status: "cancelled" });
          }
        });
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