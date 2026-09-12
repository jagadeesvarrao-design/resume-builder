// Centralized Backend Security Utility for ZenResume API
// Provides CORS origin filtering, IP rate limiting, and input validation.

// Allowed Production & Localhost Development Origins
const ALLOWED_ORIGINS = new Set([
  'https://www.zenresume.online',
  'https://zenresume.online',
  'https://resume-builder-swart-sigma-93.vercel.app',
  'http://localhost:3000',
  'http://localhost:3030',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3030',
  'http://127.0.0.1:5500'
]);

/**
 * Configure strict CORS headers based on request origin
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP Response
 * @param {string[]} allowedMethods - HTTP methods allowed for this endpoint
 * @returns {boolean} - Returns true if origin is permitted
 */
export function applyCors(req, res, allowedMethods = ['POST', 'OPTIONS']) {
  const origin = req.headers.origin;
  const isAllowed = origin && ALLOWED_ORIGINS.has(origin);

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    // Same-origin or non-browser server-to-server request
    res.setHeader('Access-Control-Allow-Origin', 'https://www.zenresume.online');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    // Untrusted external origin
    res.setHeader('Access-Control-Allow-Origin', 'https://www.zenresume.online');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  }

  res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  res.setHeader('Vary', 'Origin');

  return Boolean(isAllowed || !origin);
}

// In-memory sliding-window IP rate limiter
const rateLimitMap = new Map();

// Periodic cleanup of stale rate-limit buckets every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleBuckets() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Extract client IP from incoming request headers
 * @param {object} req - HTTP Request
 * @returns {string} - Client IP address
 */
export function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown-ip';
}

/**
 * Check if the request exceeds rate limits
 * @param {object} req - HTTP Request
 * @param {string} endpointTag - Identifier for the endpoint (e.g. 'gemini', 'contact')
 * @param {number} maxRequests - Max permitted requests in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 */
export function checkRateLimit(req, endpointTag, maxRequests = 30, windowMs = 60 * 1000) {
  cleanupStaleBuckets();

  const ip = getClientIp(req);
  const key = `${endpointTag}:${ip}`;
  const now = Date.now();

  let record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitMap.set(key, record);
    return { allowed: true, remaining: maxRequests - 1, retryAfter: 0 };
  }

  record.count += 1;

  if (record.count > maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: maxRequests - record.count, retryAfter: 0 };
}

/**
 * Sanitize string inputs to prevent HTML injection and excessive lengths
 * @param {any} input - Raw input
 * @param {number} maxLength - Maximum allowable string length
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim().substring(0, maxLength);
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strict RFC 5322 compliant email validator
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string' || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}
