// Vercel Serverless Function: Razorpay Webhook Handler
// Endpoint: POST /api/razorpay-webhook

import crypto from 'crypto';

export default async function handler(req, res) {
  // Webhooks are called server-to-server from Razorpay
  res.setHeader('Access-Control-Allow-Origin', 'https://api.razorpay.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (!webhookSecret) {
    console.error('[Razorpay Webhook] Missing webhook secret configuration in environment.');
    return res.status(500).json({ error: 'Webhook secret is not configured on the server.' });
  }

  if (!signature) {
    return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(signature, 'utf8');

    const isValid = expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      console.warn('[Razorpay Webhook] Invalid webhook signature.');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Razorpay Webhook] Verified Event: ${event}`);

    switch (event) {
      case 'payment.captured':
      case 'order.paid':
        console.log('[Razorpay Webhook] Payment Captured:', payload?.payment?.entity?.id);
        break;

      case 'payment.failed':
        console.warn('[Razorpay Webhook] Payment Failed:', payload?.payment?.entity?.id, payload?.payment?.entity?.error_description);
        break;

      case 'payment.refunded':
      case 'refund.processed':
        console.log('[Razorpay Webhook] Refund Processed:', payload?.payment?.entity?.id, payload?.refund?.entity?.amount);
        break;

      default:
        console.log(`[Razorpay Webhook] Unhandled event type: ${event}`);
    }

    return res.status(200).json({ status: 'ok', received: true, event });
  } catch (error) {
    console.error('[Razorpay Webhook] Processing error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
