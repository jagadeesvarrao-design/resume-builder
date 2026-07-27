const fs = require('fs');
const path = require('path');

const industries = {
  "Technology & Software": [
    "Software Engineer", "Senior Software Developer", "Data Scientist", "Data Engineer", 
    "AI Engineer", "Prompt Engineer", "Cloud Engineer", "DevOps Engineer", 
    "Frontend Developer", "Backend Developer", "Cybersecurity Analyst", "IT Support Specialist"
  ],
  "Business & Management": [
    "Product Manager", "Project Manager", "Business Analyst", "Operations Manager", 
    "Management Consultant", "Scrum Master", "Executive Assistant", "Human Resources Manager"
  ],
  "Sales & Marketing": [
    "Marketing Manager", "Digital Marketing Specialist", "Sales Executive", "Account Executive", 
    "Social Media Manager", "SEO Specialist", "Customer Success Manager", "Public Relations Specialist"
  ],
  "Design & Creative": [
    "Graphic Designer", "UI/UX Designer", "Art Director", "Copywriter", 
    "Video Editor", "Content Creator", "Interior Designer", "Animator"
  ],
  "Finance & Accounting": [
    "Financial Analyst", "Accountant", "Investment Banker", "Bookkeeper", 
    "Auditor", "Tax Consultant", "Chief Financial Officer"
  ],
  "Healthcare & Medical": [
    "Registered Nurse", "Medical Assistant", "Pharmacist", "Physical Therapist", 
    "Dental Hygienist", "Healthcare Administrator", "Clinical Researcher"
  ],
  "Engineering & Architecture": [
    "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Architect", 
    "Industrial Engineer", "Biomedical Engineer", "Draftsman"
  ],
  "Education & Academia": [
    "Teacher", "Professor", "Instructional Designer", "School Counselor", 
    "Tutor", "Education Administrator"
  ]
};

const roleDir = path.join(__dirname, '..', 'role');
if (!fs.existsSync(roleDir)) {
  fs.mkdirSync(roleDir);
}

const templatePath = path.join(__dirname, '..', 'templates', 'role-page-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

let directoryHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <script>
    (function() {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Templates by Industry [50+ Examples] | ZenResume</title>
  <meta name="description" content="Browse our massive directory of free ATS-friendly resume templates categorized by industry. Find the perfect format for your exact job title in 2026.">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  
  <header style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 15px 30px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(74, 107, 98, 0.1); position: sticky; top: 0; z-index: 100;">
    <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer;">
      <div style="background: linear-gradient(135deg, var(--primary-calm), var(--primary-light)); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-family: 'Outfit', sans-serif;">Z</div>
      <span style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 20px; color: var(--primary-dark); letter-spacing: -0.5px;">ZenResume</span>
    </a>
    
    <div style="display: flex; gap: 20px; align-items: center;">
      <a href="/" style="font-size: 14px; font-weight: 600; color: var(--text-main); text-decoration: none;">App</a>
      <a href="/blog/" style="font-size: 14px; font-weight: 600; color: var(--text-main); text-decoration: none;">Resources</a>
    </div>
  </header>

  <div class="app-container" style="max-width: 1000px; padding-top: 60px;">
    
    <div style="text-align: center; margin-bottom: 50px;">
      <h1 style="font-size: 36px; color: var(--primary-dark); font-weight: 800; margin-bottom: 15px; font-family: 'Outfit', sans-serif;">Resume Templates by Industry</h1>
      <p style="font-size: 16px; color: var(--text-sub); max-width: 600px; margin: 0 auto;">Select your specific job title below to view formatting rules, action verbs, and ATS-compliant templates designed perfectly for your role.</p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 40px;">
`;

let totalRoles = 0;

for (const [industry, roleList] of Object.entries(industries)) {
  directoryHtml += `
      <div style="background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-glass); padding: 30px; box-shadow: var(--shadow-peaceful);">
        <h2 style="font-size: 20px; color: var(--primary-dark); border-bottom: 2px solid var(--primary-calm); padding-bottom: 10px; margin-bottom: 20px; font-family: 'Outfit', sans-serif;">${industry}</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
`;

  roleList.forEach(roleTitle => {
    totalRoles++;
    const slug = roleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-resume';
    
    let pageContent = template.replace(/\{\{ROLE_TITLE\}\}/g, roleTitle);
    pageContent = pageContent.replace(/\{\{ROLE_SLUG\}\}/g, slug);
    const outputPath = path.join(roleDir, `${slug}.html`);
    fs.writeFileSync(outputPath, pageContent);

    directoryHtml += `
          <a href="${slug}.html" style="color: var(--text-main); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='var(--primary-calm)'" onmouseout="this.style.color='var(--text-main)'">
            <i class="fas fa-file-alt" style="color: var(--text-light); margin-right: 6px;"></i> ${roleTitle}
          </a>
`;
  });

  directoryHtml += `
        </div>
      </div>
`;
}

directoryHtml += `
    </div>
    
    <div style="text-align: center; margin-top: 60px;">
      <a href="/" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 14px 28px; font-size: 16px;">
        <i class="fas fa-magic"></i> Build Your Free Resume Now
      </a>
    </div>

  </div>

  <footer style="margin-top: 80px; text-align: center; padding: 40px 20px; border-top: 1px solid var(--border-glass);">
    <div style="font-size: 12px; color: var(--text-light);">
      &copy; 2026 ZenResume. All rights reserved.
    </div>
  </footer>
</body>
</html>
`;

const dirOutputPath = path.join(roleDir, 'index.html');
fs.writeFileSync(dirOutputPath, directoryHtml);

console.log(`Generated ${totalRoles} role pages successfully!`);
console.log(`Generated directory page at role/index.html`);
