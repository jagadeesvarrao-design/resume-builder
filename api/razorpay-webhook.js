// Vercel Serverless Function: Razorpay Webhook Handler
// Endpoint: POST /api/razorpay-webhook

import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!webhookSecret || webhookSecret === 'jI3Lmc8fDoRDodRXXrwYsYzJ') {
    webhookSecret = '6069llzzX9k5Ve1RcTIwr370';
  }
  const signature = req.headers['x-razorpay-signature'];

  if (!webhookSecret || !signature) {
    return res.status(400).json({ error: 'Missing webhook secret or x-razorpay-signature header' });
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
