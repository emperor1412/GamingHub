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
    // Lưu số Starlets và Tickets ban đầu
    const initialStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
    const initialTickets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0;
    console.log('Initial Starlets:', initialStarlets);
    console.log('Initial Tickets:', initialTickets);

    // Gọi API buyStarlets với optionId từ product
    const response = await fetch(`${shared.server_url}/api/app/buyStarlets?token=${shared.loginData.token}&optionId=${product.optionId || 1}&note=${shared.host_environment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API response:', data);

    if (data.code === 0) {
      return new Promise((resolve) => {
        let isPaymentHandled = false;

        const cleanup = () => {
          window.Telegram.WebApp.MainButton.hide();
          isPaymentHandled = true;
        };

        const checkPayment = async () => {
          if (isPaymentHandled) return;

          try {
            await shared.getProfileWithRetry();
            const currentStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
            const currentTickets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0;
            console.log('Checking payment - Current Starlets:', currentStarlets, 'Initial:', initialStarlets);
            console.log('Checking payment - Current Tickets:', currentTickets, 'Initial:', initialTickets);

            if (currentStarlets > initialStarlets && currentTickets > initialTickets) {
              cleanup();
              localStorage.setItem('payment_success', JSON.stringify({
                amount: product.amount,
                initialStarlets,
                tickets: currentTickets - initialTickets,
                timestamp: Date.now()
              }));
              resolve({
                status: "paid",
                amount: product.amount,
                initialStarlets,
                tickets: currentTickets - initialTickets
              });
            } else {
              cleanup();
              resolve({ status: "cancelled" });
            }
          } catch (error) {
            console.error('Error checking payment:', error);
            cleanup();
            resolve({ status: "cancelled" });
          }
        };

        // Setup payment UI
        window.Telegram.WebApp.MainButton.setText('Processing payment...');
        window.Telegram.WebApp.MainButton.show();

        // Open invoice URL and check payment after a delay
        window.Telegram.WebApp.openInvoice(data.data);
        setTimeout(checkPayment, 4000);

        // Set a timeout for the entire payment process
        setTimeout(() => {
          if (!isPaymentHandled) {
            cleanup();
            resolve({ status: "cancelled" });
          }
        }, 20000); // 20 seconds timeout
      });
    } else if (data.code === 102002 || data.code === 102001) {
      // Token expired, attempt to refresh
      console.log('Token expired, attempting to refresh...');
      const result = await shared.login(shared.initData);
      if (result.success) {
        // Retry the purchase after login
        return handleStarletsPurchase(product);
      } else {
        throw new Error('Failed to refresh token');
      }
    } else {
      throw new Error(data.msg || 'Failed to get payment URL');
    }
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
}; 