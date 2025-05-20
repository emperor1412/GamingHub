const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const LINE_PAY_CHANNEL_ID = '2007433542';
const LINE_PAY_CHANNEL_SECRET = process.env.LINE_PAY_CHANNEL_SECRET;
const LINE_PAY_API_URL = 'https://api-pay.line.me/v2/payments';

// Helper function to generate signature
const generateSignature = (channelSecret, body) => {
  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');
  return signature;
};

// Create payment
app.post('/api/app/createLinePayPayment', async (req, res) => {
  try {
    const { productName, amount, currency, orderId, confirmUrl, cancelUrl } = req.body;

    const requestBody = {
      productName,
      amount,
      currency,
      orderId,
      confirmUrl,
      cancelUrl,
      confirmUrlType: 'CLIENT'
    };

    const signature = generateSignature(LINE_PAY_CHANNEL_SECRET, JSON.stringify(requestBody));

    const response = await axios.post(`${LINE_PAY_API_URL}/request`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': LINE_PAY_CHANNEL_ID,
        'X-LINE-ChannelSecret': LINE_PAY_CHANNEL_SECRET
      }
    });

    res.json({
      success: true,
      code: 0,
      data: response.data
    });
  } catch (error) {
    console.error('LINE Pay API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      code: 1,
      message: error.response?.data?.returnMessage || 'Failed to create payment'
    });
  }
});

// Confirm payment
app.post('/api/app/confirmLinePayPayment', async (req, res) => {
  try {
    const { transactionId } = req.body;

    const response = await axios.post(`${LINE_PAY_API_URL}/${transactionId}/confirm`, {
      amount: 1, // Amount should match the original payment
      currency: 'TWD'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': LINE_PAY_CHANNEL_ID,
        'X-LINE-ChannelSecret': LINE_PAY_CHANNEL_SECRET
      }
    });

    res.json({
      success: true,
      code: 0,
      data: response.data
    });
  } catch (error) {
    console.error('LINE Pay Confirmation Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      code: 1,
      message: error.response?.data?.returnMessage || 'Failed to confirm payment'
    });
  }
});

// Payment callback endpoints
app.get('/payment/confirm', (req, res) => {
  const { transactionId, orderId } = req.query;
  console.log('Payment confirmed:', { transactionId, orderId });
  res.redirect('/payment/success');
});

app.get('/payment/cancel', (req, res) => {
  const { transactionId, orderId } = req.query;
  console.log('Payment cancelled:', { transactionId, orderId });
  res.redirect('/payment/cancelled');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 