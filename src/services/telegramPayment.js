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
    
    // Lưu trạng thái Premium ban đầu (nếu là premium purchase)
    const isPremiumPurchase = product.optionId === 4001 || product.optionId === 4002;
    let initialIsPremium = false;
    let initialEndTime = 0;
    
    // Gọi API để lấy trạng thái Premium chính xác
    if (isPremiumPurchase) {
      try {
        const premiumResponse = await fetch(`${shared.server_url}/api/app/getPremiumStatus?token=${shared.loginData.token}`);
        const premiumData = await premiumResponse.json();
        if (premiumData.code === 0) {
          initialIsPremium = premiumData.data === true;
          // Lấy endTime từ userProfile sau khi đã refresh
          await shared.getProfileWithRetry();
          initialEndTime = shared.userProfile?.endTime || 0;
        }
      } catch (error) {
        console.error('Failed to get initial premium status:', error);
        // Fallback to userProfile data
        initialIsPremium = shared.userProfile?.isPremium || false;
        initialEndTime = shared.userProfile?.endTime || 0;
      }
    }
    
    console.log('Initial Starlets:', initialStarlets);
    console.log('Initial Tickets:', initialTickets);
    console.log('Initial Premium status:', { isPremium: initialIsPremium, endTime: initialEndTime });

    // Gọi API buyStarlets với optionId từ product
    const response = await fetch(`${shared.server_url}/api/app/buyStarlets?token=${shared.loginData.token}&optionId=${product.optionId || 1}&note=${shared.host_environment}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API response:', data);

    // Check for parameter error on premium purchases
    if (data.code === 100001 && isPremiumPurchase) {
      console.log('Parameter error detected for premium purchase');
      const error = new Error(data.msg || 'Parameter Error');
      error.code = data.code;
      throw error;
    }

    // Check for VIP already exists error
    if (data.code === 214003) {
      console.log('VIP already exists error detected');
      const error = new Error(data.msg || 'You are already a VIP');
      error.code = data.code;
      throw error;
    }

    if (data.code === 0) {
      return new Promise((resolve) => {
        let isPaymentHandled = false;

        const cleanup = () => {
          window.Telegram.WebApp.MainButton.hide();
          isPaymentHandled = true;
        };

        const checkPayment = async (attemptNumber = 1) => {
          if (isPaymentHandled) return;

          console.log(`Payment check attempt ${attemptNumber}/5`);

          try {
            await shared.getProfileWithRetry();
            const currentStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
            const currentTickets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0;
            
            console.log('Checking payment - Current Starlets:', currentStarlets, 'Initial:', initialStarlets);
            console.log('Checking payment - Current Tickets:', currentTickets, 'Initial:', initialTickets);

            if (currentStarlets > initialStarlets && currentTickets >= initialTickets) {
              // For regular starlets purchases, check token changes (original logic)
              console.log('Starlets purchase check result: SUCCESS');
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
            } else if (isPremiumPurchase) {
              // For premium purchases, check if isPremium became true
              // Gọi API để lấy trạng thái Premium chính xác sau khi thanh toán
              let currentIsPremium = false;
              let currentEndTime = 0;
              
              try {
                const premiumResponse = await fetch(`${shared.server_url}/api/app/getPremiumStatus?token=${shared.loginData.token}`);
                const premiumData = await premiumResponse.json();
                if (premiumData.code === 0) {
                  currentIsPremium = premiumData.data === true;
                  // Lấy endTime từ userProfile sau khi đã refresh
                  await shared.getProfileWithRetry();
                  currentEndTime = shared.userProfile?.endTime || 0;
                }
              } catch (error) {
                console.error('Failed to get current premium status:', error);
                // Fallback to userProfile data
                currentIsPremium = shared.userProfile?.isPremium || false;
                currentEndTime = shared.userProfile?.endTime || 0;
              }
              
              console.log('Checking payment - Current Premium:', { isPremium: currentIsPremium, endTime: currentEndTime });
              console.log('Checking payment - Initial Premium:', { isPremium: initialIsPremium, endTime: initialEndTime });

              // For new purchase: only check isPremium (no previous Premium)
              // For renew: check both isPremium and endTime (ensure proper renewal)
              const isRenew = initialIsPremium === true;
              
              let premiumSuccess;
              if (isRenew) {
                // Renew case: check if endTime was updated properly
                // Tính toán thời gian từ thời điểm hiện tại (khi check payment)
                const now = Date.now();
                const expectedDuration = product.optionId === 4001 ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000;
                const expectedEndTime = now + expectedDuration;
                const timeDiff = Math.abs(currentEndTime - expectedEndTime);
                premiumSuccess = currentIsPremium === true && timeDiff < 24 * 60 * 60 * 1000;
                console.log('Premium RENEW check - checking if endTime updated properly');
                console.log('Expected endTime:', new Date(expectedEndTime));
                console.log('Actual endTime:', new Date(currentEndTime));
                console.log('Time difference (hours):', timeDiff / (60 * 60 * 1000));
              } else {
                // New purchase case: only check isPremium
                premiumSuccess = currentIsPremium === true;
                console.log('Premium NEW PURCHASE check - only checking isPremium');
              }
              
              console.log('Premium purchase check result:', premiumSuccess, {
                currentIsPremium: currentIsPremium,
                currentEndTime: currentEndTime,
                initialIsPremium: initialIsPremium,
                isRenew: isRenew,
                optionId: product.optionId
              });
              
              if (premiumSuccess) {
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
                // Payment not yet processed, will retry if attempts remaining
                console.log(`Premium payment not yet processed (attempt ${attemptNumber}/5)`);
                if (attemptNumber < 5) {
                  // Retry after 4 seconds
                  setTimeout(() => checkPayment(attemptNumber + 1), 4000);
                } else {
                  // Max attempts reached, cancel payment
                  console.log('Max payment check attempts reached, marking as cancelled');
                  cleanup();
                  resolve({ status: "cancelled" });
                }
              }
            } else {
              // Payment failed or cancelled
              console.log(`Regular payment not yet processed (attempt ${attemptNumber}/5)`);
              if (attemptNumber < 5) {
                // Retry after 4 seconds
                setTimeout(() => checkPayment(attemptNumber + 1), 4000);
              } else {
                // Max attempts reached, cancel payment
                console.log('Max payment check attempts reached, marking as cancelled');
                cleanup();
                resolve({ status: "cancelled" });
              }
            }
          } catch (error) {
            console.error(`Error checking payment (attempt ${attemptNumber}/5):`, error);
            if (attemptNumber < 5) {
              // Retry after 4 seconds on error
              setTimeout(() => checkPayment(attemptNumber + 1), 4000);
            } else {
              // Max attempts reached, cancel payment
              console.log('Max payment check attempts reached due to errors, marking as cancelled');
              cleanup();
              resolve({ status: "cancelled" });
            }
          }
        };

        // Setup payment UI
        window.Telegram.WebApp.MainButton.setText('Processing payment...');
        window.Telegram.WebApp.MainButton.show();

        // Open invoice URL and check payment after a delay
        window.Telegram.WebApp.openInvoice(data.data);
        setTimeout(() => checkPayment(1), 4000);

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
      const error = new Error(data.msg || 'Failed to get payment URL');
      error.code = data.code;
      throw error;
    }
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
}; 