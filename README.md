# ZenResume 🌿
> **Peaceful, Premium, and 100% ATS-Compliant Resume Builder**

🚀 **Live Website:** [https://resume-builder-swart-sigma-93.vercel.app/](https://resume-builder-swart-sigma-93.vercel.app/)

ZenResume is an elegant, client-side web application designed to help professionals build highly-approved, ATS-friendly resumes with a soothing user experience. Crafted with a beautiful **Sage & Slate HSL design palette**, ZenResume provides an interactive workspace, robust data management, and dynamic template engines.

---

## ✨ Features

### 1. 🤖 Gemini AI Magic Import (PDF / Text)
Instantly bootstrap your resume. Users can upload an existing PDF resume or paste raw text. The integrated Gemini AI parses the content and automatically populates all form fields in one click.

### 2. 🗃️ Complete Data Preservation (Auto-Save)
Never lose your work again. ZenResume reactively captures every keystroke, dynamic list addition, and section removal, instantly saving your state to local browser cache. Returning users are automatically restored exactly where they left off.

### 3. 📂 Local Backups (Import / Export JSON)
Take full ownership of your data.
*   **Backup**: Export your resume configuration as a `.json` backup file.
*   **Restore**: Re-upload your backup file to dynamically reconstruct your fields and rebuild repeating timeline sections instantly.

### 4. 🔀 Layout Hot-Swapping (Zero Data Loss)
Toggle between different elegant templates (*Minimalist Classic, Serene Modern, Technical Grid, Bold Executive, Academic Scholar, Minimalist Sans, Structured Linear*) instantly using the inline selector dropdown in the preview panel. Switching templates changes styling only—your active edits remain perfectly intact.

### 5. 📱 100% Seamless Responsiveness
Features a high-fidelity mobile tabbed navigation layout. On mobile and tablet devices, users can cleanly toggle between **Edit Details** (wizard form) and **Live Preview** (document preview), completely preventing screen overlap, scrolling exhaustion, and scaling clipping.

### 6. 🛡️ Secure API Key Obfuscation
Enforces client-side security using XOR obfuscation to prevent raw API keys from being scraped directly from the source code, securing the Gemini API client connection.

### 7. 💌 Sleek Support & Feedback Form
Includes a modern, glassmorphic contact form enabling users to leave feedback, report bugs, and rate the website. Handles submissions gracefully with automated animations and features a direct `mailto:` fallback.

### 8. 📈 SEO Resources Hub (Blog)
A fully responsive, statically generated blog directory (`/blog/`) designed to drive organic search traffic from Google. Contains 5 highly-targeted articles:
*   *How to Pass ATS Scanners in 2026*
*   *Zero Experience? Build a Winning Fresher Resume*
*   *How to Write a Top-Tier Developer Resume*
*   *100+ Powerful Action Verbs to Upgrade Your Resume*
*   *Do You Really Need a Cover Letter in 2026?*

---

## 🛠️ Architecture & Technology Stack

*   **Structure**: Semantic HTML5 (`index.html`, `/blog/index.html`)
*   **Styling**: Vanilla CSS3 (`styles.css`) using CSS variables, custom media queries, and high-fidelity print overrides.
*   **Logic**: Vanilla ES6 JavaScript (`app.js`, `firebase-service.js`) handling workspace states, LocalStorage synchronization, responsive tabs, and API obfuscation.
*   **Data Layout Engine**: Isolated templates module (`templates-data.js`) containing pre-populated industry profiles and rendering functions.

---

## 🚀 Getting Started

### Local Setup
Since ZenResume is a lightweight, pure client-side application, it requires no dependencies or build tools.

1.  **Clone / Download** this folder.
2.  Open `index.html` directly in any web browser (Chrome, Firefox, Safari, Edge).

### PDF Export & Print Engine
ZenResume features native A4 vector print formatting for 100% ATS readability. We have implemented a hybrid printing mechanism:
1.  **CSS `@page` Override:** Automatically forces Google Chrome and Microsoft Edge to hide default browser headers/footers.
2.  **Smart Browser Guessing:** Detects Safari and Firefox users, displaying a helpful warning dialog checklist with instructions to uncheck "Headers and Footers" before printing.

To export your PDF:
1.  Navigate to the final step in the wizard or click **Download Resume** in the preview bar.
2.  In the system print preview dialog, select **Destination: Save as PDF**.
3.  Click **Save**.
