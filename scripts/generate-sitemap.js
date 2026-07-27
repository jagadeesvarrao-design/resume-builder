const fs = require('fs');
const path = require('path');

const baseUrl = 'https://resume-builder-swart-sigma-93.vercel.app';
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
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/role/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

// Add blog posts
const blogDir = path.join(__dirname, '..', 'blog');
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

blogFiles.forEach(file => {
  sitemap += `  <url>
    <loc>${baseUrl}/blog/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
});

// Add role pages
const roleDir = path.join(__dirname, '..', 'role');
const roleFiles = fs.readdirSync(roleDir).filter(f => f.endsWith('.html') && f !== 'index.html');

roleFiles.forEach(file => {
  sitemap += `  <url>
    <loc>${baseUrl}/role/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

// Add static pages
const rootFiles = ['about.html', 'privacy.html', 'terms.html'];
rootFiles.forEach(file => {
  sitemap += `  <url>
    <loc>${baseUrl}/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
});

sitemap += `</urlset>`;

const outputPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`Successfully generated sitemap.xml with ${3 + blogFiles.length + roleFiles.length + rootFiles.length} URLs!`);
