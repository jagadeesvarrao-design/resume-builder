# 📦 ZenResume - Archived Features (Future Roadmap)

This document stores detailed technical blueprints for all major features planned for ZenResume. 
These features are fully architected here and will be rolled out progressively when the website reaches its desired growth milestones (traffic, AdSense approval, user base).

---

## 1. 📊 Resume Score / ATS Score Checker
**Status:** Archived — Ready to Rollout

### Feature Overview
An AI-powered tool that analyzes the user's resume data and provides an ATS Compatibility Score (0–100) with a detailed breakdown of improvements. This is a massive SEO and retention driver.

### Technical Implementation Blueprint
*   **UI Updates (`index.html`):**
    *   Add a large "Score My Resume" button next to the Download button.
    *   Create a modal `<div id="score-modal">` featuring a circular progress bar (for the 0-100 score) and 5 category bars (Keywords, Formatting, Impact, Skills, Contact).
*   **Logic (`app.js`):**
    *   Create `async function calculateATSScore()`.
    *   Extract current editor data via `document.getElementById('editor-content').innerText`.
    *   Send to Gemini API with strict JSON formatting prompt: `{"score": 85, "feedback": ["Add more metrics", "Missing LinkedIn URL"]}`.
    *   Animate the circular progress bar in the UI based on the returned score.

---

## 2. 📱 Android App (TWA — Trusted Web Activity)
**Status:** Archived — Ready to Rollout

### Feature Overview
Package the website as an Android App Bundle (.aab) to publish on the Google Play Store, giving users a native app experience.

### Technical Implementation Blueprint
*   **Prerequisites:** 
    *   The `manifest.json` and `sw.js` (Service Worker) are already active.
    *   Google Play Developer account ($25 fee) required.
*   **Execution (CLI):**
    *   Run `@bubblewrap/cli init --manifest=https://resume-builder-swart-sigma-93.vercel.app/manifest.json`.
    *   Configure the keystore password and app details.
    *   Run `bubblewrap build` to generate the `app-release-bundle.aab`.
    *   Upload the `.aab` file to the Google Play Console.

---

## 3. 🏆 Premium Templates (Paid/Pro Tier)
**Status:** Archived — Ready to Rollout

### Feature Overview
Introduce a Freemium model. Basic templates remain free, but users can pay ₹99 to unlock highly designed executive and creative templates.

### Technical Implementation Blueprint
*   **UI Updates (`index.html` & `styles.css`):**
    *   Add 3 new templates (e.g., `modern-pro`, `executive-pro`) to the template selector.
    *   Add a lock icon 🔒 overlay on Pro templates.
    *   Create a clean, Apple-style payment popup when a Pro template is clicked.
*   **Logic (`app.js` & Backend):**
    *   Integrate Razorpay JS SDK: `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`.
    *   On successful payment (`handler` callback), store a local storage token: `localStorage.setItem('pro_unlocked', 'true')`.
    *   (Optional phase 2: Link Razorpay to Firebase Auth to save purchases across devices).

---

## 4. 💼 Smart Job Description (JD) Tailoring
**Status:** Archived — Ready to Rollout

### Feature Overview
Enhancing the existing AI tailoring feature to automatically detect missing keywords from a Job Description and suggest where to place them.

### Technical Implementation Blueprint
*   **UI Updates (`index.html`):**
    *   Add a new "Keyword Match Score" visual indicator inside the existing Tailor modal.
    *   Add a section: "Keywords you are missing: [React] [Node.js] [Agile]".
*   **Logic (`app.js`):**
    *   Update the Gemini prompt in `tailorResume()` to output a JSON object containing `missing_keywords` and `tailored_bullets`.
    *   Write a function `highlightKeywords(text, keywords)` that wraps matched keywords in `<span class="highlight">` so the user visually sees what the AI added.

---

## 5. 📧 Email Newsletter / User Re-engagement System
**Status:** Archived — Ready to Rollout

### Feature Overview
Automatically capture emails and send "Career Tips" to bring users back to the site.

### Technical Implementation Blueprint
*   **UI Updates (`index.html`):**
    *   Add a non-intrusive "Save your progress" modal that asks for an email before closing the tab.
*   **Logic (Firebase / Brevo):**
    *   Setup Firebase Authentication (Email/Password).
    *   When a user signs up, trigger a Firebase Cloud Function.
    *   The Cloud Function sends a POST request to Brevo/Mailchimp API to add the user to the "Newsletter" list.
    *   Setup an automated sequence in Brevo: Send Day 1 Welcome, Day 7 Resume Tips, Day 30 Check-in.

---

## 6. 🌐 Multi-Language Resume Support
**Status:** Archived — Ready to Rollout

### Feature Overview
Allow users to generate resumes in Hindi, Telugu, French, German, etc.

### Technical Implementation Blueprint
*   **UI Updates (`index.html`):**
    *   Add a dropdown in the top navbar: 🌐 Language (EN | HI | TE | FR).
*   **Logic (`app.js`):**
    *   Create a massive JSON dictionary for UI translations (`const translations = { en: { ... }, hi: { ... }}`).
    *   When the user clicks "Translate Resume", send the current DOM content to Gemini with the prompt: *"Translate this resume into [Language] while keeping a highly professional, corporate tone."*
    *   Replace the DOM elements with the translated text.
