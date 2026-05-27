# ZenResume 🌿
> **Peaceful, Premium, and 100% ATS-Compliant Resume Builder**

ZenResume is an elegant, client-side web application designed to help professionals build highly-approved, ATS-friendly resumes with a soothing user experience. Crafted with a beautiful **Sage & Slate HSL design palette**, ZenResume provides an interactive workspace, robust data management, and dynamic template engines.

---

## ✨ Features

### 1. 🗃️ Complete Data Preservation (Auto-Save)
Never lose your work again. ZenResume reactively captures every keystroke, dynamic list addition, and section removal, instantly saving your state to local browser cache. Returning users are automatically restored exactly where they left off.

### 2. 🔀 Layout Hot-Swapping (Zero Data Loss)
Toggle between different elegant templates (*Minimalist Classic, Serene Modern, Technical Grid, Bold Executive, Academic Scholar, Minimalist Sans, Structured Linear*) instantly using the inline selector dropdown in the preview panel. Switching templates changes styling only—your active edits remain perfectly intact.

### 3. 📂 Local Backups (Import / Export JSON)
Take full ownership of your data.
*   **Backup**: Export your resume configuration as a `.json` backup file.
*   **Restore**: Re-upload your backup file to dynamically reconstruct your fields and rebuild repeating timeline sections instantly.

### 4. 📱 100% Seamless Responsiveness
Features a high-fidelity mobile tabbed navigation layout. On mobile and tablet devices, users can cleanly toggle between **Edit Details** (wizard form) and **Live Preview** (document preview), completely preventing screen overlap, scrolling exhaustion, and scaling clipping.

### 5. 🎯 Native A4 Vector Print Formatting
Supports browser-native PDF export (`window.print()`). Uses standard CSS page margins (`@page { margin: 15mm; }`) to ensure perfect document borders and selectable, searchable vector text output that guarantees applicant tracking systems can parse your credentials with highest efficiency.

---

## 🛠️ Architecture & Technology Stack

*   **Structure**: Semantic HTML5 (`index.html`)
*   **Styling**: Vanilla CSS3 (`styles.css`) using CSS variables, custom media queries, and high-fidelity print overrides.
*   **Logic**: Vanilla ES6 JavaScript (`app.js`) handling workspace states, LocalStorage synchronization, and responsive tabs.
*   **Data Layout Engine**: Isolated templates module (`templates-data.js`) containing pre-populated industry profiles (Software, Mechanical, Electrical, Civil) and rendering functions.

---

## 🚀 Getting Started

### Local Setup
Since ZenResume is a lightweight, pure client-side application, it requires no dependencies or build tools.

1.  **Clone / Download** this folder.
2.  Open `index.html` directly in any web browser (Chrome, Firefox, Safari, Edge).

### PDF Export Instructions
To guarantee a searchable vector PDF:
1.  Navigate to the final step in the wizard or click **Download Resume** in the preview bar.
2.  In the system print preview dialog, select **Destination: Save as PDF** (or *Microsoft Print to PDF*).
3.  Under **More Settings**:
    *   Set **Margins** to **Default** or **None** (the page styles handle boundaries automatically).
    *   Uncheck **Headers and Footers**.
4.  Click **Save**.
