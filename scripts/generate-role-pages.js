const fs = require('fs');
const path = require('path');

const roles = [
  "Data Engineer",
  "Data Scientist",
  "AI Engineer",
  "Prompt Engineer",
  "Cloud Engineer",
  "Senior Software Developer"
];

// Ensure role directory exists
const roleDir = path.join(__dirname, '..', 'role');
if (!fs.existsSync(roleDir)) {
  fs.mkdirSync(roleDir);
}

// Read template
const templatePath = path.join(__dirname, '..', 'templates', 'role-page-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

roles.forEach(roleTitle => {
  // Create slug (e.g., "Data Engineer" -> "data-engineer-resume")
  const slug = roleTitle.toLowerCase().replace(/\s+/g, '-') + '-resume';
  
  let pageContent = template.replace(/\{\{ROLE_TITLE\}\}/g, roleTitle);
  pageContent = pageContent.replace(/\{\{ROLE_SLUG\}\}/g, slug);
  
  const outputPath = path.join(roleDir, `${slug}.html`);
  fs.writeFileSync(outputPath, pageContent);
  console.log(`Generated: ${outputPath}`);
});

console.log("All role pages generated successfully!");
