# Archived Features (Future Roadmap)

This document stores major features, updates, and architectures planned for ZenResume. These features are archived here and will be rolled out when the website reaches its desired growth milestones.

---

## 1. AI Cover Letter Generation (Using Gemini 2.5)

**Status:** Archived (Planned for Future Release)

### Feature Overview
An AI-powered Cover Letter Generator that leverages the existing Gemini AI integration. It reads the user's currently loaded resume data in the ZenResume workspace and a user-provided job description to automatically draft a highly tailored cover letter.

### Proposed Implementation Plan

**UI Changes (`index.html`)**
- Add a **"🪄 Generate Cover Letter"** button to the left-hand workspace actions panel.
- Build a new modal overlay (`#cover-letter-modal`) containing:
  - Input: Target Job Title
  - Input: Target Company Name
  - Textarea: Job Description (optional, for tailoring)
  - Button: "Generate with AI"
  - Large Output Textarea: To display and allow manual editing of the generated cover letter.
  - Button: "Copy to Clipboard"

**Logic Changes (`app.js`)**
- Implement `generateCoverLetter()` attached to the modal.
- Extract the user's parsed resume data (Contact, Work Experience, Skills, Education) from the current editor session.
- Construct a strict prompt for the Gemini API (e.g., `"You are an expert career coach. Write a professional cover letter for [Job Title] at [Company Name]. Here is the job description: [Job Desc]. Here is the candidate's resume data: [Resume Data]. Output only the cover letter text, no markdown."`).
- Reuse the existing API fetch wrapper (`fetchWithRetry`) and API key storage logic to hit the `gemini-2.5-flash` endpoint.
- Display the streamed/fetched result in the output textarea and handle error states (e.g., API key invalid).

### Future Considerations
- Will this feature consume the same API key quota as the Magic Import? (Yes, ensure clear UI warnings).
- Do we render the cover letter into a downloadable PDF (like the resumes), or keep it as a text output for the user to copy-paste into an email? (Initial plan: Text area for copy-pasting).
