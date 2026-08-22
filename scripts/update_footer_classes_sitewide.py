import os
import re

FOOTER_HTML = """        <!-- Comprehensive Publisher Footer (E-E-A-T & Google Quality Guidelines) -->
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
            &copy; 2026 ZenResume. All rights reserved. Recruiter-verified ATS formatting tools.
          </div>
        </footer>"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match the footer tag
    pattern = r'<footer\b[^>]*>.*?</footer>'
    m = re.search(pattern, content, flags=re.DOTALL)
    if m:
        content = content[:m.start()] + FOOTER_HTML + content[m.end():]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                if update_file(p):
                    count += 1
    print(f"Successfully applied clean animated footer classes across {count} HTML pages!")

if __name__ == '__main__':
    main()
