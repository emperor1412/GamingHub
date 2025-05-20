import shared from '../Shared';
import liff from '@line/liff';

const LINE_PAY_CHANNEL_ID = '2007433542'; // LINE Pay Channel ID
const LINE_PAY_CHANNEL_SECRET = process.env.REACT_APP_LINE_PAY_CHANNEL_SECRET; // LINE Pay Channel Secret from environment variable
const LINE_PAY_API_URL = 'https://api-pay.line.me/v2/payments';

export const linePayment = {
  async createPayment(product) {
    try {
      // Gọi backend để tạo payment request
      const response = await fetch(`${shared.server_url}/api/app/createLinePayPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${shared.loginData?.token}`
        },
        body: JSON.stringify({
          productName: `${product.amount} Starlets`,
          amount: product.stars,
          currency: 'TWD',
          orderId: `order_${Date.now()}`,
          confirmUrl: `${window.location.origin}/payment/confirm`,
          cancelUrl: `${window.location.origin}/payment/cancel`
        })
      });

      const jsonResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonResponse.message || 'Failed to create payment');
      }
      
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${shared.loginData?.token}`
        },
        body: JSON.stringify({
          transactionId: transactionId
        })
      });

      const jsonResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(jsonResponse.message || 'Failed to confirm payment');
      }
      
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