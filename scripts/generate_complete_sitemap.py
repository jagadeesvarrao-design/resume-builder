import os

BASE_URL = "https://www.zenresume.online"
DATE = "2026-08-20"

def build_sitemap():
    entries = []
    
    # Root pages
    root_pages = [
        ("", "daily", "1.0"),
        ("blog/", "daily", "0.9"),
        ("role/", "daily", "0.9"),
        ("about.html", "monthly", "0.7"),
        ("contact.html", "monthly", "0.7"),
        ("editorial-policy.html", "monthly", "0.8"),
        ("methodology.html", "monthly", "0.8"),
        ("privacy.html", "monthly", "0.5"),
        ("terms.html", "monthly", "0.5")
    ]
    
    for path, freq, priority in root_pages:
        url = f"{BASE_URL}/{path}" if path else f"{BASE_URL}/"
        entries.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>{DATE}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    # Blog articles
    blog_files = sorted([f for f in os.listdir('blog') if f.endswith('.html') and f != 'index.html'])
    for b in blog_files:
        url = f"{BASE_URL}/blog/{b}"
        entries.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>{DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

    # Role articles
    role_files = sorted([f for f in os.listdir('role') if f.endswith('.html') and f != 'index.html'])
    for r in role_files:
        url = f"{BASE_URL}/role/{r}"
        entries.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>{DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{os.linesep.join(entries)}
</urlset>
"""
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_xml)
        
    print(f"Generated comprehensive sitemap.xml with {len(entries)} total URLs (Blog: {len(blog_files)}, Roles: {len(role_files)}, Root: {len(root_pages)})!")

if __name__ == "__main__":
    build_sitemap()
