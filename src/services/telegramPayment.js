import shared from '../Shared';

// Test payment provider token cho Stripe (TEST)
const TEST_PAYMENT_PROVIDER = '';
const BASE_URL = `https://api.telegram.org/bot${shared.bot_token}/test/createInvoiceLink`;
const MOCK_PAYMENT = false; // Toggle này để bật/tắt mock payment

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
    // Lưu số Starlets ban đầu
    const initialStarlets = shared.getStarlets();
    console.log('Initial Starlets:', initialStarlets);

    // Gọi API buyStarlets
    const response = await fetch(`${shared.server_url}/api/app/buyStarlets?token=${shared.loginData.token}&optionId=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API response:', data);

    if (data.code === 0) {
      // Lưu payment info vào localStorage để check sau
      localStorage.setItem('payment_pending', JSON.stringify({
        amount: product.amount,
        stars: product.stars,
        timestamp: Date.now()
      }));

      return new Promise((resolve) => {
        // Listen for invoice closed event
        window.Telegram.WebApp.onEvent('invoiceClosed', (status) => {
          console.log('Invoice closed with status:', status);
          
          // Check if payment was successful
          if (status === 'paid') {
            localStorage.setItem('payment_success', 'true');
            resolve({ 
              status: "paid",
              amount: product.amount,
              initialStarlets
            });
          } else {
            resolve({ status: "cancelled" });
          }
        });

        // Open invoice URL trong Telegram WebApp
        window.Telegram.WebApp.openInvoice(data.data, (status) => {
          console.log('Invoice callback status:', status);
        });
      });
    } else {
      throw new Error(data.msg || 'Failed to get payment URL');
    }
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
}; 