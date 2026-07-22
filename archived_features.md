# 📦 ZenResume - Archived Features (Future Roadmap)

This document stores all major features, updates, and improvements planned for ZenResume.
These features are archived here and will be rolled out progressively when the website reaches
its desired growth milestones (traffic, AdSense approval, user base).

---

## 1. 📝 AI Cover Letter Generation (Using Gemini 2.5)
**Status:** Archived — Added: 22 July 2026

### Feature Overview
An AI-powered Cover Letter Generator that leverages the existing Gemini AI integration.
It reads the user's currently loaded resume data in the ZenResume workspace and a user-provided
job description to automatically draft a highly tailored, professional cover letter.

### Proposed Implementation Plan

**UI Changes (`index.html`)**
- Add a "🪄 Generate Cover Letter" button to the left-hand workspace actions panel.
- Build a new modal overlay (`#cover-letter-modal`) containing:
  - Input: Target Job Title
  - Input: Target Company Name
  - Textarea: Job Description (optional, for tailoring)
  - Button: "Generate with AI"
  - Large Output Textarea: For displaying and editing the generated cover letter
  - Button: "Copy to Clipboard"

**Logic Changes (`app.js`)**
- Implement `generateCoverLetter()` attached to the modal.
- Extract the user's parsed resume data (Contact, Work Experience, Skills, Education).
- Construct a strict Gemini prompt for professional cover letter generation.
- Reuse existing `fetchWithRetry` wrapper and API key logic hitting `gemini-2.5-flash`.
- Display result in output textarea with full error state handling.

### Future Considerations
- Feature will share the same API key quota as Magic Import — need clear UI warnings.
- Decide: downloadable PDF output vs. simple text copy-paste (initial plan: text area).

---

## 2. 📱 Android App (TWA — Trusted Web Activity / Google Play Store)
**Status:** Archived — Discussed: July 2026

### Feature Overview
Package ZenResume as a lightweight Android App Bundle (.aab) using Google's Trusted Web Activity
(TWA) method and publish it on the Google Play Store.

### Why Archived
- Requires the website to first achieve stable Google AdSense approval and consistent user traffic.
- Once the site has a strong user base, the Play Store listing will dramatically increase discovery.

### Implementation Plan (Already Prepared)
- The ZenResume package files were already prepared and stored at:
  `C:\Users\DELL\Downloads\ZenResume - Google Play package`
- `manifest.json` and Service Worker (`sw.js`) are already in place for PWA compliance.
- Next step: Use Bubblewrap CLI to generate the signed `.aab` file and submit to Play Store.

### Traffic Milestone to Trigger Release
- Recommended: Launch when the site reaches **500+ daily active users**.

---

## 3. 🏆 Premium Templates (Paid/Pro Tier)
**Status:** Archived — Discussed: July 2026

### Feature Overview
Introduce a set of exclusive, premium-design resume templates that users can unlock.
This creates a freemium monetization layer beyond AdSense alone.

### Monetisation Model
- Free: 4–5 standard ATS-friendly templates (current).
- Pro (₹99–₹199 one-time or monthly): Access to 3–4 premium, highly-designed templates
  (e.g., creative industry, executive, research/academic).

### Implementation Notes
- Requires a payment gateway integration (Razorpay for India is recommended).
- Template unlock status stored in Firebase user profile.

---

## 4. 📊 Resume Score / ATS Score Checker
**Status:** Archived — Discussed: July 2026

### Feature Overview
After the user builds their resume, provide an AI-generated ATS Compatibility Score (0–100)
with a detailed breakdown of what's good and what needs to be improved.

### How It Works
- Send the completed resume data to Gemini with a structured scoring prompt.
- Score categories: Keyword Density, Formatting, Contact Info, Skills Match, Experience Detail.
- Show a visual progress bar for each category and an overall score badge.

### Why Archived
- This is a high-value "stickiness" feature that keeps users coming back.
- Should be released after AdSense is approved to use it as a traffic driver via blog content
  ("Check your resume's ATS score for free!").

---

## 5. 🌐 Multi-Language Resume Support
**Status:** Archived — Discussed: July 2026

### Feature Overview
Allow users to switch the UI language and also generate resume content in languages other
than English (e.g., Hindi, Telugu, Tamil, French, German) for non-English job markets.

### Why Archived
- Current user base is primarily English-speaking India (confirmed via traffic data).
- Low priority until traffic data shows significant demand from non-English regions.

---

## 6. 💼 Job Description Tailoring (Resume Auto-Tailoring)
**Status:** Already Partially Built — Enhancement Archived

### Feature Overview (Enhancement)
The current "Tailor & Download" feature uses Gemini to tailor resume bullets to a job description.
The archived enhancement is to make this smarter:
- Auto-detect missing keywords from the JD and highlight them in the editor.
- Suggest additional skills or certifications to add based on the target JD.
- Show a "Keyword Match %" score before and after tailoring.

---

## 7. 📧 Email Newsletter / User Re-engagement System
**Status:** Archived — Discussed: July 2026

### Feature Overview
Build an opt-in email newsletter system for users who sign up.
- Welcome email with resume tips on sign-up.
- Weekly "Career Tips" newsletter linking back to blog articles.
- Re-engagement email if a user hasn't visited in 30 days.

### Why Archived
- Requires a third-party email provider integration (Mailchimp / Brevo recommended).
- Should only be built once user sign-up numbers are meaningful (target: 1,000+ registered users).

---

## 📅 Feature Release Milestones

| Milestone | Target | Features to Unlock |
|---|---|---|
| **Stage 1** | AdSense Approved | Launch as-is, let ads monetise |
| **Stage 2** | 500 Daily Users | Android TWA App (Play Store) |
| **Stage 3** | 2,000 Daily Users | ATS Score Checker + Cover Letter Generator |
| **Stage 4** | 5,000 Daily Users | Premium Templates + Razorpay |
| **Stage 5** | 10,000 Daily Users | Email Newsletter + Multi-Language Support |
