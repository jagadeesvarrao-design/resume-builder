import os
import re

NEW_FOOTER_HTML = """        <!-- Comprehensive Publisher Footer (E-E-A-T & Google Quality Guidelines) -->
        <footer class="site-publisher-footer no-print">
          <div class="footer-nav-container">
            <a href="/" class="footer-nav-pill">Builder</a>
            <a href="/role/" class="footer-nav-pill">All 63 Role Templates</a>
            <a href="/blog/" class="footer-nav-pill">Career Resource Hub (21 Guides)</a>
            <a href="/about.html" class="footer-nav-pill">About Us</a>
            <a href="/editorial-policy.html" class="footer-nav-pill">Editorial Policy</a>
            <a href="/methodology.html" class="footer-nav-pill">ATS Testing Methodology</a>
            <a href="/contact.html" class="footer-nav-pill">Contact Support</a>
            <a href="/privacy.html" class="footer-nav-pill">Privacy Policy</a>
            <a href="/terms.html" class="footer-nav-pill">Terms of Service</a>
          </div>
          <div class="footer-copyright">
            &copy; 2026 ZenResume. A product of <strong>Aneevarp Solutions</strong>. All rights reserved. Recruiter-verified ATS formatting tools.
          </div>
        </footer>"""

def update_footer(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'<footer\b[^>]*>.*?</footer>'
    m = re.search(pattern, content, flags=re.DOTALL)
    if m:
        content = content[:m.start()] + NEW_FOOTER_HTML + content[m.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def update_index_schema():
    filepath = 'index.html'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_schema = '''      "@type": "Organization",
      "name": "ZenResume",
      "url": "https://www.zenresume.online/",
      "logo": "https://www.zenresume.online/favicon-96x96.png",
      "description": "Free, recruiter-approved, privacy-first ATS resume builder."'''

    new_schema = '''      "@type": "Organization",
      "name": "Aneevarp Solutions",
      "alternateName": "ZenResume",
      "url": "https://www.zenresume.online/",
      "logo": "https://www.zenresume.online/favicon-96x96.png",
      "legalName": "Aneevarp Solutions",
      "identifier": "UDYAM-AP-10-0144446",
      "description": "Aneevarp Solutions is the official publisher of ZenResume - a free, recruiter-approved, privacy-first ATS resume builder."'''

    if old_schema in content:
        content = content.replace(old_schema, new_schema)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated index.html Schema.org Organization metadata!")

def update_legal_pages():
    # 1. Update about.html
    about_path = 'about.html'
    with open(about_path, 'r', encoding='utf-8') as f:
        about = f.read()
    
    target = '        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 35px 0 12px 0; font-family: \'Outfit\', sans-serif;">\n          3. Editorial & Technical Leadership\n        </h2>'
    replacement = '''        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 35px 0 12px 0; font-family: 'Outfit', sans-serif;">
          3. Publisher & Legal Entity
        </h2>
        <p>
          ZenResume is developed, maintained, and published by <strong>Aneevarp Solutions</strong>, an official technology and software publishing enterprise registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India (Registration No: <code>UDYAM-AP-10-0144446</code>), headquartered in Visakhapatnam, Andhra Pradesh, India.
        </p>

        <h2 style="font-size: 22px; color: var(--primary-dark); margin: 35px 0 12px 0; font-family: 'Outfit', sans-serif;">
          4. Editorial & Technical Leadership
        </h2>'''

    if target in about and 'Publisher & Legal Entity' not in about:
        about = about.replace(target, replacement)
        about = about.replace('4. Contact Information', '5. Contact Information')
        with open(about_path, 'w', encoding='utf-8') as f:
            f.write(about)
        print("Updated about.html with Aneevarp Solutions publisher details!")

    # 2. Update privacy.html
    privacy_path = 'privacy.html'
    with open(privacy_path, 'r', encoding='utf-8') as f:
        privacy = f.read()
    if 'Aneevarp Solutions' not in privacy:
        privacy = privacy.replace('ZenResume ("we", "our", or "us")', 'Aneevarp Solutions (operating ZenResume, "we", "our", or "us", MSME Reg: UDYAM-AP-10-0144446)')
        with open(privacy_path, 'w', encoding='utf-8') as f:
            f.write(privacy)
        print("Updated privacy.html with Aneevarp Solutions!")

    # 3. Update terms.html
    terms_path = 'terms.html'
    with open(terms_path, 'r', encoding='utf-8') as f:
        terms = f.read()
    if 'Aneevarp Solutions' not in terms:
        terms = terms.replace('ZenResume ("we", "our", or "us")', 'Aneevarp Solutions (operating ZenResume, "we", "our", or "us", MSME Reg: UDYAM-AP-10-0144446)')
        with open(terms_path, 'w', encoding='utf-8') as f:
            f.write(terms)
        print("Updated terms.html with Aneevarp Solutions!")

def main():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                if update_footer(p):
                    count += 1
    print(f"Successfully updated footer across {count} HTML pages!")
    update_index_schema()
    update_legal_pages()

if __name__ == '__main__':
    main()
