import os
import re

INDEX_FOOTER_HTML = """  <!-- Site Footer (Stitch Modern Dark Canvas) -->
  <footer class="stitch-footer no-print">
    <div class="stitch-footer-container">
      
      <div class="stitch-footer-logo">
        <img src="https://www.zenresume.online/favicon-96x96.png" alt="ZenResume Logo" style="width: 32px; height: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); object-fit: cover;">
        <span style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 22px; color: #FFFFFF; letter-spacing: -0.5px;">ZenResume</span>
      </div>

      <!-- Popular Role Resume Guides -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;">
        <span style="color: #00A88A; text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-align: center;">Popular Role Resume Guides</span>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 10px; font-size: 13px; font-weight: 500;">
          <a href="/role/data-engineer-resume.html" class="footer-nav-pill">Data Engineer</a>
          <a href="/role/data-scientist-resume.html" class="footer-nav-pill">Data Scientist</a>
          <a href="/role/ai-engineer-resume.html" class="footer-nav-pill">AI Engineer</a>
          <a href="/role/cloud-engineer-resume.html" class="footer-nav-pill">Cloud Engineer</a>
          <a href="/role/senior-software-developer-resume.html" class="footer-nav-pill">Senior Developer</a>
          <a href="/role/index.html" class="footer-nav-pill" style="color: #00E5BC !important; font-weight: 700;">View All 63 Roles &rarr;</a>
        </div>
      </div>

      <!-- Main Corporate & Legal Links -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 22px; width: 100%; max-width: 900px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 10px;">
        <a href="/" class="footer-nav-pill">Builder App</a>
        <a href="/role/" class="footer-nav-pill">Templates (63 Roles)</a>
        <a href="/blog/" class="footer-nav-pill">Career Resource Hub (21 Guides)</a>
        <a href="/about.html" class="footer-nav-pill">About Us</a>
        <a href="/editorial-policy.html" class="footer-nav-pill">Editorial Policy</a>
        <a href="/methodology.html" class="footer-nav-pill">ATS Testing Methodology</a>
        <a href="/contact.html" class="footer-nav-pill">Contact Support</a>
        <a href="/privacy.html" class="footer-nav-pill">Privacy Policy</a>
        <a href="/terms.html" class="footer-nav-pill">Terms of Service</a>
      </div>
      
      <div class="stitch-footer-copy" style="font-size: 13px; color: #94A3B8; margin-top: 10px; text-align: center; line-height: 1.6;">
        &copy; 2026 ZenResume. A product of <strong>Aneevarp Solutions</strong>. All rights reserved.
      </div>
    </div>
  </footer>"""

SUBPAGE_FOOTER_HTML = """        <!-- Comprehensive Publisher Footer (E-E-A-T & Google Quality Guidelines) -->
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
            &copy; 2026 ZenResume. A product of <strong>Aneevarp Solutions</strong>. All rights reserved.
          </div>
        </footer>"""

def clean_index_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the duplicate middle footer inside section
    middle_footer_pattern = r'<!-- Comprehensive Publisher Footer.*?<footer class="site-publisher-footer no-print">.*?</footer>'
    content = re.sub(middle_footer_pattern, '', content, flags=re.DOTALL)

    # 2. Replace the bottom stitch-footer
    bottom_footer_pattern = r'<!-- Site Footer \(Stitch Modern Dark Canvas\) -->.*?<footer class="stitch-footer no-print">.*?</footer>'
    content = re.sub(bottom_footer_pattern, INDEX_FOOTER_HTML, content, flags=re.DOTALL)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cleaned duplicate footer from index.html and installed sleek dark footer!")

def clean_subpages():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google') and f != 'index.html':
                p = os.path.join(d, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                # Replace footer
                pattern = r'<footer\b[^>]*>.*?</footer>'
                m = re.search(pattern, content, flags=re.DOTALL)
                if m:
                    content = content[:m.start()] + SUBPAGE_FOOTER_HTML + content[m.end():]
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(content)
                    count += 1
    print(f"Cleaned and updated footers across {count} subpages!")

def main():
    clean_index_html()
    clean_subpages()

if __name__ == '__main__':
    main()
