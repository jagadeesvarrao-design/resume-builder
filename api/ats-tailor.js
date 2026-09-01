/**
 * ZenSuite ATS Tailor API - Premium Serverless Endpoint
 * POST /api/ats-tailor
 * 
 * HOW IT WORKS:
 * 1. Receives resume content + job description from authenticated premium user
 * 2. Verifies the user has an active ZenSuite subscription in Firestore
 * 3. Calls Google Gemini API to generate tailored bullet rewrites & missing keyword analysis
 * 4. Returns the full premium ATS report
 * 
 * SECURITY: Only runs the expensive LLM call AFTER verifying payment in Firestore.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (uses GOOGLE_APPLICATION_CREDENTIALS or default Vercel env)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    if (serviceAccount.project_id) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      admin.initializeApp();
    }
  } catch (e) {
    admin.initializeApp();
  }
}

const db = admin.firestore();

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.zenresume.online');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Extract and verify Firebase Auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authentication token. Please sign in.' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authErr) {
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    const uid = decodedToken.uid;

    // 2. Check active subscription in Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(403).json({ error: 'No subscription found. Please purchase a ZenPass.' });
    }

    const userData = userDoc.data();
    const sub = userData.subscription;

    if (!sub || sub.status !== 'active') {
      return res.status(403).json({ error: 'Your subscription is not active. Please purchase a ZenPass.' });
    }

    // Check expiration
    const expiresAt = sub.expiresAt;
    if (expiresAt) {
      const expDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
      if (expDate <= new Date()) {
        // Mark as expired
        await db.collection('users').doc(uid).update({ 'subscription.status': 'expired' });
        return res.status(403).json({ error: 'Your subscription has expired. Please renew your ZenPass.' });
      }
    }

    // 3. Parse request body
    const { resumeContent, jobDescription } = req.body || {};

    if (!resumeContent || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeContent and jobDescription are required.' });
    }

    if (jobDescription.length < 50) {
      return res.status(400).json({ error: 'Job description is too short. Please paste the complete JD.' });
    }

    // 4. Call Gemini API for AI-powered tailoring
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured. Contact support.' });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) resume consultant.

TASK: Analyze the candidate's resume against the target job description and provide:
1. A list of ALL missing keywords/skills from the JD that are NOT in the resume
2. For each missing keyword, a confidence score (high/medium/low) of how critical it is
3. Rewrite 3-5 of the candidate's existing bullet points to naturally incorporate the missing keywords while maintaining the Google XYZ format (Accomplished [X] as measured by [Y], by doing [Z])
4. An overall ATS compatibility percentage

RESUME:
${resumeContent.substring(0, 4000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

Respond ONLY in valid JSON with this exact structure:
{
  "overallScore": 75,
  "missingKeywords": [
    {"keyword": "Docker", "priority": "high", "category": "DevOps"},
    {"keyword": "Kubernetes", "priority": "high", "category": "DevOps"}
  ],
  "rewrittenBullets": [
    {
      "original": "Built backend services",
      "rewritten": "Architected containerized backend microservices using Docker and Kubernetes, reducing deployment time by 40% across 3 production environments",
      "keywordsAdded": ["Docker", "Kubernetes", "microservices"]
    }
  ],
  "recommendations": ["Add a DevOps/Infrastructure section", "Include specific cloud certifications"]
}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      return res.status(502).json({ error: 'AI analysis temporarily unavailable. Please try again.' });
    }

    const geminiData = await geminiResponse.json();
    const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return res.status(502).json({ error: 'AI returned empty response. Please try again.' });
    }

    let aiReport;
    try {
      aiReport = JSON.parse(aiText);
    } catch (parseErr) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = aiText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        aiReport = JSON.parse(jsonMatch[1]);
      } else {
        return res.status(502).json({ error: 'AI response format error. Please try again.' });
      }
    }

    // 5. Log usage for analytics
    await db.collection('usage_logs').add({
      uid,
      type: 'ats_tailor',
      tier: sub.tier || 'unknown',
      score: aiReport.overallScore || 0,
      missingCount: (aiReport.missingKeywords || []).length,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // 6. Return premium report
    return res.status(200).json({
      success: true,
      report: aiReport
    });

  } catch (error) {
    console.error('ATS Tailor API Error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};
