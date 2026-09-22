// Vercel Serverless Function: Secure Gemini AI Proxy Gateway
// Endpoint: /api/gemini

import { applyCors, checkRateLimit } from './_security.js';

export default async function handler(req, res) {
  // Set CORS & Strict Origin Validation
  applyCors(req, res, ['GET', 'OPTIONS', 'POST']);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Rate Limiting: Max 15 AI requests per minute per IP to prevent quota abuse & DoS
  const rateLimit = checkRateLimit(req, 'gemini-ai', 15, 60 * 1000);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    return res.status(429).json({
      error: 'AI request limit reached. Please wait a few moments before trying again.',
      retryAfter: rateLimit.retryAfter
    });
  }

  try {
    const { action, prompt, payload } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('[Gemini Backend] Missing GEMINI_API_KEY in environment.');
      return res.status(500).json({ error: 'AI processing service is not configured on the server.' });
    }

    let finalPrompt = '';
    let contents = [];

    if (action === 'parse_resume') {
      let pdfBase64 = payload?.pdfData ? String(payload.pdfData) : '';
      if (pdfBase64.includes(',')) {
        pdfBase64 = pdfBase64.split(',')[1];
      }
      const isPdf = Boolean(payload?.isPdf && pdfBase64);
      const rawText = String(payload?.rawText || '').substring(0, 40000);

      if (!isPdf && !rawText.trim()) {
        return res.status(400).json({ error: 'Missing or empty resume text to parse.' });
      }

      finalPrompt = `You are a world-class ATS resume parser. Extract the resume information into this exact JSON structure:
{
  "personal": {
    "name": "Full Name",
    "title": "Professional Title / Headline",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "City, State, Country",
    "website": "Personal Website / Portfolio Link",
    "linkedin": "LinkedIn Profile URL",
    "github": "GitHub Profile URL",
    "customSocial": ""
  },
  "sectionTitles": {
    "summary": "Exact section title or 'Professional Summary'",
    "skills": "Exact section title or 'Technical Skills'",
    "experience": "Exact section title or 'Work Experience'",
    "projects": "Exact section title or 'Key Projects'",
    "education": "Exact section title or 'Education'",
    "certifications": "Exact section title or 'Certifications'"
  },
  "summary": "Professional summary or objective",
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "dates": "Start - End Date (e.g. Jan 2026 - Present)",
      "location": "Location",
      "descriptions": [
        "Key accomplishment bullet 1",
        "Key accomplishment bullet 2"
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "technologies": "Tech stack used",
      "description": "Project overview, architecture, and metrics",
      "link": "https://..."
    }
  ],
  "education": [
    {
      "degree": "Degree / Program Name",
      "institution": "University / College / School",
      "location": "City, State",
      "dates": "Graduation Date or Year",
      "gpa": "GPA / Grade / Percentage"
    }
  ],
  "certifications": [
    {
      "name": "Certificate / Badge Name",
      "issuer": "Issuing Organization (e.g. Google, TechGig)",
      "date": "Issue Date or Year",
      "desc": "Credential link or description"
    }
  ]
}

Instructions:
1. CANDIDATE NAME: The candidate's name is the person's real human name at the very top of the resume (e.g. "JAGADEESWARA RAO PEDDADA"). Under NO circumstances should "DATA SCIENCE STATEMENT", "SUMMARY", or any section heading be used as the candidate name!
2. SECTION TITLES: The candidate may use custom headings for their sections. Capture their exact custom section heading in the "sectionTitles" object:
   - "summary": If they titled their summary "DATA SCIENCE STATEMENT" or "PROFESSIONAL SUMMARY" or "ABOUT ME", put that exact title here!
   - "skills": If they titled their skills "MACHINE LEARNING & QUANTITATIVE DIRECTORY" or "TECHNICAL SKILLS", put that exact title here!
   - "projects": If they titled their projects "DATA MODELING & ANALYTICAL PROJECTS" or "KEY PROJECTS", put that exact title here!
   - "education": If they titled their education "ACADEMIC RECORD" or "EDUCATION", put that exact title here!
   - "certifications": If they titled certifications "VERIFIED ANALYTICS CREDENTIALS" or "CERTIFICATIONS", put that exact title here!
3. SECTIONS EXTRACTION:
   - "summary": Extract the full text under the summary heading (e.g. under "DATA SCIENCE STATEMENT").
   - "skills": Extract all skills, badges, frameworks, and technologies into an array of strings. Clean any OCR artifacts or trailing characters like "~~".
   - "projects": Extract all projects with their title, tech stack, bullet descriptions, and repo/demo links.
   - "education": Extract all degrees, universities/schools, locations, graduation dates/years, and grades/CGPA.
   - "certifications": Extract all certifications, issuers, dates, and credential links.
   - "experience": If the resume lists work experience, extract it. If the candidate is a student or fresher with no employment experience, set "experience": [].
4. Return ONLY valid JSON in the exact schema above with no markdown code blocks or commentary.`;

      if (isPdf) {
        contents = [
          {
            parts: [
              { text: finalPrompt },
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: pdfBase64
                }
              }
            ]
          }
        ];
      } else {
        contents = [
          {
            parts: [{ text: `${finalPrompt}\n\nRaw Resume Text:\n${rawText}` }]
          }
        ];
      }
    } else if (action === 'tailor_keywords') {
      const summary = String(payload?.summary || '').substring(0, 5000);
      const skills = String(payload?.skills || '').substring(0, 5000);
      const jobDescription = String(payload?.jobDescription || '').substring(0, 20000);
      finalPrompt = `You are an expert ATS resume writer. Tailor the candidate's Summary and Skills to match the Job Description keywords precisely while maintaining honesty.

Current Summary:
${summary}

Current Skills:
${skills}

Target Job Description:
${jobDescription}

Respond ONLY with valid JSON in this exact format with no extra text or markdown:
{
  "summary": "new optimized summary...",
  "skills": "Skill 1, Skill 2, Skill 3..."
}`;
      contents = [{ parts: [{ text: finalPrompt }] }];
    } else if (prompt) {
      finalPrompt = String(prompt).substring(0, 40000);
      contents = [{ parts: [{ text: finalPrompt }] }];
    }

    if (!contents.length) {
      return res.status(400).json({ error: 'Missing prompt or valid action.' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.2,
          topP: 0.95
        }
      })
    });

    const geminiData = await geminiResponse.json();

    if (geminiData.error) {
      return res.status(geminiResponse.status || 500).json({ error: geminiData.error.message || 'Gemini API Error' });
    }

    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(cleanJson);
      return res.status(200).json({ success: true, data: parsed, raw: rawText });
    } catch {
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          const innerParsed = JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));
          return res.status(200).json({ success: true, data: innerParsed, raw: rawText });
        } catch {}
      }
      return res.status(200).json({ success: true, text: rawText });
    }

  } catch (err) {
    console.error('Serverless Gemini Proxy Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
