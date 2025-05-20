import shared from '../Shared';

const LINE_PAY_CHANNEL_ID = ''; // LINE Pay Channel ID
const LINE_PAY_CHANNEL_SECRET = ''; // LINE Pay Channel Secret
const LINE_PAY_API_URL = 'https://api-pay.line.me/v2/payments';

export const linePayment = {
  async createPayment(product) {
    try {
      // Gọi backend để tạo payment request
      const response = await fetch(`${shared.server_url}/api/app/createLinePayPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productName: `${product.amount} Starlets`,
          amount: product.stars,
          currency: 'TWD',
          orderId: `order_${Date.now()}`,
          confirmUrl: `${shared.server_url}/payment/confirm`,
          cancelUrl: `${shared.server_url}/payment/cancel`
        })
      });

      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('LINE Pay API Error:', error);
      throw error;
    }
  },

  async confirmPayment(transactionId) {
    try {
      // Gọi backend để xác nhận payment
      const response = await fetch(`${shared.server_url}/api/app/confirmLinePayPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId: transactionId
        })
      });

      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error('LINE Pay Confirmation Error:', error);
      throw error;
    }
  }
};

export const handleLinePayment = async (product) => {
  try {
    // Lưu số Starlets và Tickets ban đầu
    const initialStarlets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0;
    const initialTickets = shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0;

    // Tạo payment request
    const paymentResponse = await linePayment.createPayment(product);
    
    if (paymentResponse.returnCode === '0000') {
      // Chuyển hướng người dùng đến trang thanh toán LINE Pay
      window.location.href = paymentResponse.info.paymentUrl.web;
      
      // Lưu thông tin payment để xử lý sau khi thanh toán
      localStorage.setItem('line_payment_info', JSON.stringify({
        transactionId: paymentResponse.info.transactionId,
        product: product,
        initialStarlets,
        initialTickets,
        timestamp: Date.now()
      }));
    } else {
      throw new Error(paymentResponse.returnMessage || 'Failed to create payment');
    }
  } catch (error) {
    console.error('LINE Payment error:', error);
    throw error;
  }
}; 