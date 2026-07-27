const fs = require("fs");
const path = require("path");

const files = [
  "index.html",
  "templates/role-page-template.html",
  "blog/index.html",
  "blog/ats-resume-format-2026.html",
  "blog/career-change-resume.html",
  "blog/do-you-need-cover-letter.html",
  "blog/resume-action-verbs.html",
  "blog/resume-for-internship.html",
  "blog/resume-tips-for-freshers.html",
  "blog/software-engineer-resume-guide.html"
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Remove gtag library block
  const gtagRegex = /<script async[\s\S]*?<\/script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-Z90HSSD2P2'\);\s*<\/script>/;
  content = content.replace(gtagRegex, "");

  // Remove gtag comment
  content = content.replace(/<!-- Google tag \(gtag\.js\) -->/, "");

  // Remove adsbygoogle library script (single line)
  const adsRegex = /<script async\s*src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-1993051486567311"\s*crossorigin="anonymous"><\/script>/;
  content = content.replace(adsRegex, "");

  // Remove ads comment
  content = content.replace(/<!-- Google AdSense Auto Ads -->/, "");

  // Add lazy-load.js before </head> if it doesnt exist
  if (!content.includes("lazy-load.js")) {
    content = content.replace("</head>", "  <script src=\"/lazy-load.js\" defer></script>\n</head>");
  }

  fs.writeFileSync(filePath, content, "utf8");
});
console.log("Replaced scripts successfully.");
