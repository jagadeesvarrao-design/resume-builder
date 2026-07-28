<div align="center">
  <h1>📄 ZenResume</h1>
  <p><strong>A 100% Free, Client-Side, ATS-Optimized Resume Builder</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
  
  <p>
    <a href="https://resume-builder-swart-sigma-93.vercel.app/"><strong>Live Demo</strong></a> ·
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#contributing"><strong>Contributing</strong></a>
  </p>
</div>

<br />

## 🚨 The Problem
90% of job applications are rejected by Applicant Tracking Systems (ATS) before a human ever reads them. 

Most "free" resume builders on the internet suffer from three major issues:
1. **The Bait & Switch:** They let you spend an hour typing your resume, only to lock your PDF export behind a $15/month subscription at the very end.
2. **Terrible Formatting:** They push complex, multi-column "Canva-style" templates that completely break ATS parsing algorithms.
3. **Data Harvesting:** They require you to create an account and store your sensitive personal data on their servers.

## ✨ The Solution: ZenResume
ZenResume is an open-source, client-side web application built to solve this. It strictly enforces single-column, highly readable layouts that are guaranteed to parse correctly in ATS software. 

* **100% Free Forever:** No paywalls, no subscriptions.
* **Zero Signups:** Just open the URL and start typing.
* **Total Privacy:** Everything is processed locally in your browser. Your data never touches our servers.
* **AI-Assisted (Optional):** Integrated with the Gemini API to intelligently help you write impactful bullet points.

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
