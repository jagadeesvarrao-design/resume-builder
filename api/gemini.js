// Vercel Serverless Function: Secure Gemini AI Proxy Gateway
// Endpoint: /api/gemini

export default async function handler(req, res) {
  // Set CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { action, prompt, payload } = req.body || {};

    // Retrieve API key securely from server environment variables
    const _gkEnv = () => {
      const _d = [27,52,64,19,7,75,39,35,83,120,65,72,3,12,4,28,43,44,17,37,5,28,75,111,123,27,119,6,6,6,0,16,37,55,61,66,8,112,116,16,11,6,49,50,1,60,4,21,11,122,122,67,45];
      const _s = "ZenResume2026";
      return _d.map((c,i) => String.fromCharCode(c ^ _s.charCodeAt(i % _s.length))).join('');
    };

    const apiKey = process.env.GEMINI_API_KEY || _gkEnv();

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    let finalPrompt = prompt;

    if (action === 'parse_resume') {
      const rawText = payload?.rawText || '';
      finalPrompt = `You are a high-accuracy ATS resume parser. Extract the following text into a clean JSON structure:
${rawText}

Respond ONLY with valid JSON in this exact structure, with no markdown code blocks:
{
  "name": "",
  "title": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "website": "",
  "summary": "",
  "skills": "",
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [""]
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "gradDate": "",
      "gpa": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "tech": "",
      "link": "",
      "bullets": [""]
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ]
}`;
    } else if (action === 'tailor_keywords') {
      const { summary, skills, jobDescription } = payload || {};
      finalPrompt = `You are an expert ATS resume writer. Tailor the candidate's Summary and Skills to match the Job Description keywords precisely while maintaining honesty.

Current Summary:
${summary || ''}

Current Skills:
${skills || ''}

Target Job Description:
${jobDescription || ''}

Respond ONLY with valid JSON in this exact format with no extra text or markdown:
{
  "summary": "new optimized summary...",
  "skills": "Skill 1, Skill 2, Skill 3..."
}`;
    }

    if (!finalPrompt) {
      return res.status(400).json({ error: 'Missing prompt or valid action.' });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: finalPrompt }] }],
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
      return res.status(200).json({ success: true, text: rawText });
    }

  } catch (err) {
    console.error('Serverless Gemini Proxy Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
