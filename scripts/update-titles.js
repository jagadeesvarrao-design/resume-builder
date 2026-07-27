const fs = require('fs');
const path = require('path');

const updates = [
  { file: 'blog/ats-resume-format-2026.html', oldT: 'How to Pass ATS Scanners in 2026: The Ultimate Guide | ZenResume', newT: 'Pass ATS Scanners in 2026 [Ultimate Guide + Templates] | ZenResume' },
  { file: 'blog/career-change-resume.html', oldT: 'Resume Format for Career Change in 2026 | ZenResume', newT: 'Career Change Resume Format [2026 Examples] | ZenResume' },
  { file: 'blog/do-you-need-cover-letter.html', oldT: 'Do You Really Need a Cover Letter in 2026? | ZenResume', newT: 'Do You Need a Cover Letter in 2026? [Free Checklist] | ZenResume' },
  { file: 'blog/resume-action-verbs.html', oldT: '100+ Powerful Resume Action Verbs for 2026 | ZenResume', newT: '100+ Resume Action Verbs for 2026 [Copy & Paste] | ZenResume' },
  { file: 'blog/resume-for-internship.html', oldT: 'How to Write a Resume for an Internship in 2026 | ZenResume', newT: 'Internship Resume Format [No Experience Examples] | ZenResume' },
  { file: 'blog/resume-tips-for-freshers.html', oldT: 'Best Resume Format for Freshers in 2026 | ZenResume', newT: 'Resume Format for Freshers [Free 2026 Templates] | ZenResume' },
  { file: 'blog/software-engineer-resume-guide.html', oldT: 'How to Write a Top-Tier Software Engineer Resume in 2026 | ZenResume', newT: 'Software Engineer Resume [FAANG Examples + Template] | ZenResume' }
];

updates.forEach(u => {
  let p = path.join(__dirname, '..', u.file);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace('<title>' + u.oldT + '</title>', '<title>' + u.newT + '</title>');
  content = content.replace(new RegExp('content="' + u.oldT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"', 'g'), 'content="' + u.newT + '"');
  fs.writeFileSync(p, content);
  console.log('Updated ' + u.file);
});
