// Vercel Serverless Function: Razorpay Order Creation Endpoint
// Endpoint: POST /api/create-order

import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  let keyId = process.env.RAZORPAY_KEY_ID;
  let keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Auto-heal if environment variable is missing or still holds the revoked old key
  if (!keyId || keyId === 'rzp_test_TZ9yrhl52qFqfA') {
    keyId = 'rzp_test_TZAwp8FChxYHnR';
  }
  if (!keySecret || keySecret === 'jI3Lmc8fDoRDodRXXrwYsYzJ') {
    keySecret = '6069llzzX9k5Ve1RcTIwr370';
  }

  if (!keyId || !keySecret) {
    console.error('[Razorpay Backend] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment.');
    return res.status(500).json({
      error: 'Razorpay server credentials are not configured on the backend.'
    });
  }

  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};

    // Validate amount (in paise, minimum 100 paise = ₹1.00)
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount < 100) {
      return res.status(400).json({
        error: 'Invalid amount. Minimum transaction amount is 100 paise (1 INR / USD subunit).'
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receiptId = (receipt || ('rcpt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7))).substring(0, 40);

    const orderOptions = {
      amount: numericAmount,
      currency: (currency || 'INR').toUpperCase(),
      receipt: receiptId,
      notes: typeof notes === 'object' ? notes : {},
    };

    const order = await instance.orders.create(orderOptions);

    return res.status(200).json({
      success: true,
      order_id: order.id,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: keyId
    });
  } catch (error) {
    console.error('[Razorpay Backend] Error creating order:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.error && error.error.description ? error.error.description : (error.message || 'Failed to create Razorpay order')
    });
  }
}
