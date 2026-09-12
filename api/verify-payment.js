// Vercel Serverless Function: Razorpay Signature Verification Endpoint
// Endpoint: POST /api/verify-payment

import crypto from 'crypto';
import { applyCors, checkRateLimit } from './_security.js';

export default async function handler(req, res) {
  // CORS Configuration & Origin Validation
  applyCors(req, res, ['GET', 'OPTIONS', 'POST']);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Rate Limiting: Max 20 verification attempts per minute per IP
  const rateLimit = checkRateLimit(req, 'verify-payment', 20, 60 * 1000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    return res.status(429).json({
      success: false,
      verified: false,
      error: 'Too many verification requests. Please try again in a few moments.',
      retryAfter: rateLimit.retryAfter
    });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error('[Razorpay Backend] Missing RAZORPAY_KEY_SECRET in environment.');
    return res.status(500).json({
      success: false,
      verified: false,
      error: 'Payment verification service is not configured. Please contact support.'
    });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing required parameters: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.'
      });
    }

    // Generate Expected Signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(razorpay_signature, 'utf8');

    const isAuthentic = 
      expectedBuffer.length === receivedBuffer.length && 
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (isAuthentic) {
      console.log(`[Razorpay Backend] Payment verified successfully: Order ${razorpay_order_id}, Payment ${razorpay_payment_id}`);
      return res.status(200).json({
        success: true,
        verified: true,
        message: 'Payment signature verified successfully.',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    } else {
      console.warn(`[Razorpay Backend] Signature mismatch for Order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid payment signature. Verification failed.'
      });
    }
  } catch (error) {
    console.error('[Razorpay Backend] Error during signature verification:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error.message || 'Server error during payment verification.'
    });
  }
}
