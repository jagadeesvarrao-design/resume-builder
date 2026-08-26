<div align="center">
  <h1>📄 ZenResume (https://www.zenresume.online)</h1>
  <p><strong>The #1 Free, Local-First, ATS-Friendly Resume Builder with Zero Paywalls &amp; Zero Watermarks</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  
  <p>
    <a href="https://www.zenresume.online/"><strong>🌐 Launch ZenResume App</strong></a> ·
    <a href="https://www.zenresume.online/role/"><strong>63 Role Templates</strong></a> ·
    <a href="https://www.zenresume.online/campus.html"><strong>Campus Placement Suite</strong></a> ·
    <a href="https://ai-job-search-agent-chi.vercel.app/"><strong>ZenScout AI</strong></a>
  </p>
</div>

<br />

## 🚨 Why ZenResume Exists (The Problem With Zety, Novoresume & Canva)
90% of online resume builders use deceptive dark patterns:
1. **The Download Paywall Trap:** Platforms like Zety, Novoresume, and Resume.io let you type your entire resume for an hour, only to demand a $15–$25 subscription or place an ugly watermark when you click "Download PDF".
2. **Parser-Breaking Multi-Column Grids:** Canva and design tools use multi-column graphical canvases that enterprise ATS software (Workday, Taleo, Greenhouse, Lever) completely fail to parse.
3. **Data Harvesting & Privacy Violations:** They force you to create accounts and sell your personal resume data to recruiters.

## ✨ The Solution: ZenResume
ZenResume is an open-source, local-first, privacy-respecting career tool developed by **Aneevarp Solutions**:
* **100% Free Forever ($0.00):** No hidden paywalls, no watermark tricks, no subscriptions.
* **Zero Account Sign-ups:** Open the website and start building immediately.
* **Local-First Browser Storage:** All your data remains in your browser's IndexedDB. Zero remote tracking databases.
* **Pure Vector PDF Engine:** Compiles sharp, selectable-text ATS PDFs (tested across Workday & Taleo).
* **63 Role-Specific Templates:** Pre-populated with quantified bullet benchmarks for Software Engineers, Data Scientists, Accountants, Managers, and Freshers.
* **1-Click Portable JSON Backup:** Full `.zenresume` data export and import for 0% vendor lock-in.

## 🚀 Features

- **Real-Time Live Preview:** See exactly what your resume looks like as you type, using a side-by-side CSS Grid layout.
- **Native PDF Engine:** Uses a highly optimized DOM-to-PDF engine (`html2pdf.js`) to generate crystal clear, unclipped A4 and US Letter documents.
- **Responsive Workspace:** Seamlessly transitions to a tabbed experience on mobile devices.
- **Local Storage:** Safely caches your progress in your browser's local storage so you don't lose work if you accidentally close the tab.

## 🛠️ Tech Stack

ZenResume was built with a focus on simplicity, speed, and zero dependencies:
* **HTML5** (Semantic structure)
* **Vanilla CSS3** (CSS Grid, Flexbox, CSS Variables)
* **Vanilla JavaScript** (No heavy frameworks like React or Vue required)
* **html2pdf.js** (Client-side PDF generation)

## 💻 Running Locally

To run ZenResume on your local machine, you don't need `npm` or `Node.js`. It's a completely static site!

1. Clone the repository:
   ```bash
   git clone https://github.com/jagadeesvarrao-design/resume-builder.git
   ```
2. Open the directory:
   ```bash
   cd resume-builder
   ```
3. Open `index.html` in your favorite browser, or serve it using a local server (e.g., VSCode Live Server).

## 🔒 Security & Privacy

Since ZenResume is a client-side application, we prioritize local-first data privacy:
* **API Key Safety:** If you configure a custom Gemini API key, it is stored locally in your browser's `localStorage` and never transmitted to our servers.
* **Credential Rotation:** If you fork this project and deploy it publicly, rotate all default API keys and Firebase configurations, and scrub any previously hardcoded keys from your git history.

## 🤝 Contributing

We welcome contributions from the community! Whether it's adding a new ATS-compliant template, improving the CSS, or fixing a bug, your help is appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*If this project helped you land an interview or save money, please consider giving it a ⭐ on GitHub!*
