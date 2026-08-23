const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.zenresume.online';
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/role/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Add static root E-E-A-T pages
const rootFiles = [
  { file: 'about.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'contact.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'editorial-policy.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'methodology.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'privacy.html', priority: '0.5', changefreq: 'yearly' },
  { file: 'terms.html', priority: '0.5', changefreq: 'yearly' }
];

rootFiles.forEach(item => {
  sitemap += `  <url>
    <loc>${baseUrl}/${item.file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>\n`;
});

// Add blog posts
const blogDir = path.join(__dirname, '..', 'blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

blogFiles.forEach(file => {
  sitemap += `  <url>
    <loc>${baseUrl}/blog/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add role pages
const roleDir = path.join(__dirname, '..', 'role');
const roleFiles = fs.readdirSync(roleDir).filter(f => f.endsWith('.html') && f !== 'index.html');

roleFiles.forEach(file => {
  sitemap += `  <url>
    <loc>${baseUrl}/role/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
});

sitemap += `</urlset>`;

const outputPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

const totalUrls = 3 + rootFiles.length + blogFiles.length + roleFiles.length;
console.log(`Successfully generated sitemap.xml with ${totalUrls} production URLs under https://www.zenresume.online!`);
