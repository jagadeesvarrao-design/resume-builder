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
            &copy; 2026 ZenResume. A product of <strong>Aneevarp Solutions</strong> (MSME Reg: <code>UDYAM-AP-10-0144446</code>). All rights reserved. Recruiter-verified ATS formatting tools.
          </div>
        </footer>"""

def update_footers():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()
                pattern = r'<footer\b[^>]*>.*?</footer>'
                m = re.search(pattern, content, flags=re.DOTALL)
                if m:
                    content = content[:m.start()] + FOOTER_HTML + content[m.end():]
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(content)
                    count += 1
    print(f"Updated footer across {count} HTML pages with Aneevarp Solutions & MSME ID!")

def update_contact_page():
    path = 'contact.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    box = '''      <!-- Direct Contact Badges -->
      <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 25px; flex-wrap: wrap;">
        <div style="background: rgba(0, 104, 86, 0.04); border: 1px solid var(--border-glass); border-radius: 10px; padding: 12px 18px; display: flex; align-items: center; gap: 10px; font-size: 13.5px;">
          <i class="fas fa-envelope" style="color: #006856; font-size: 16px;"></i>
          <span><strong>Email:</strong> support@zenresume.online</span>
        </div>
        <div style="background: rgba(0, 104, 86, 0.04); border: 1px solid var(--border-glass); border-radius: 10px; padding: 12px 18px; display: flex; align-items: center; gap: 10px; font-size: 13.5px;">
          <i class="fas fa-building" style="color: #006856; font-size: 16px;"></i>
          <span><strong>Parent Entity:</strong> Aneevarp Solutions</span>
        </div>
      </div>

      <div style="background: rgba(0, 104, 86, 0.03); border: 1px solid rgba(0, 104, 86, 0.12); border-radius: 10px; padding: 14px 18px; margin-bottom: 25px; font-size: 13px; color: var(--text-sub); text-align: center;">
        ZenResume is an official digital product developed, published, and supported by <strong>Aneevarp Solutions</strong> (Govt. of India MSME: <code>UDYAM-AP-10-0144446</code>), Visakhapatnam, Andhra Pradesh, India.
      </div>'''

    target = re.search(r'<!-- Direct Contact Badges -->.*?</div>\s*</div>', content, flags=re.DOTALL)
    if target and 'Aneevarp Solutions' not in target.group(0):
        content = content[:target.start()] + box + content[target.end():]
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated contact.html with Aneevarp Solutions!")

def update_editorial_and_methodology():
    # 1. editorial-policy.html
    ed_path = 'editorial-policy.html'
    if os.path.exists(ed_path):
        with open(ed_path, 'r', encoding='utf-8') as f:
            ed = f.read()
        if 'Aneevarp Solutions' not in ed:
            ed = ed.replace('ZenResume Editorial Board', 'ZenResume Editorial Board (Aneevarp Solutions)')
            with open(ed_path, 'w', encoding='utf-8') as f:
                f.write(ed)
            print("Updated editorial-policy.html with Aneevarp Solutions!")

    # 2. methodology.html
    meth_path = 'methodology.html'
    if os.path.exists(meth_path):
        with open(meth_path, 'r', encoding='utf-8') as f:
            meth = f.read()
        if 'Aneevarp Solutions' not in meth:
            meth = meth.replace('ZenResume Engineering & Research', 'ZenResume Engineering (Aneevarp Solutions)')
            with open(meth_path, 'w', encoding='utf-8') as f:
                f.write(meth)
            print("Updated methodology.html with Aneevarp Solutions!")

def main():
    update_footers()
    update_contact_page()
    update_editorial_and_methodology()

if __name__ == '__main__':
    main()
