import os
import re

STITCH_FOOTER_HTML = '''  <!-- Site Footer (Stitch Modern Dark Canvas) -->
  <footer class="stitch-footer no-print" style="background: var(--bg-dark-surface, #0B1315); color: #FFFFFF; padding: 60px 24px 40px 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); margin-top: 60px;">
    <div class="stitch-footer-container" style="max-width: 1160px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 28px;">
      
      <div class="stitch-footer-logo" style="display: flex; align-items: center; gap: 10px;">
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
          <a href="https://ai-job-search-agent-chi.vercel.app/" target="_blank" rel="noopener noreferrer" class="footer-nav-pill" style="color: #00E5BC !important;"><i class="fas fa-robot" style="font-size: 11px;"></i> ZenScout AI</a>
          <a href="/role/index.html" class="footer-nav-pill" style="color: #00E5BC !important; font-weight: 700;">View All 63 Roles &rarr;</a>
        </div>
      </div>

      <!-- Main Corporate & Legal Links -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 22px; width: 100%; max-width: 900px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 10px;">
        <a href="/" class="footer-nav-pill">Builder App</a>
        <a href="/role/" class="footer-nav-pill">Templates (63 Roles)</a>
        <a href="/blog/" class="footer-nav-pill">Career Resource Hub (21 Guides)</a>
        <a href="https://ai-job-search-agent-chi.vercel.app/" target="_blank" rel="noopener noreferrer" class="footer-nav-pill" style="color: #00E5BC !important;"><i class="fas fa-robot" style="font-size: 11px;"></i> ZenScout AI</a>
        <a href="/about.html" class="footer-nav-pill">About Us</a>
        <a href="/editorial-policy.html" class="footer-nav-pill">Editorial Policy</a>
        <a href="/methodology.html" class="footer-nav-pill">ATS Testing Methodology</a>
        <a href="/contact.html" class="footer-nav-pill">Contact Support</a>
        <a href="/privacy.html" class="footer-nav-pill">Privacy Policy</a>
        <a href="/terms.html" class="footer-nav-pill">Terms of Service</a>
      </div>
      
      <!-- Publisher & Copyright Credit -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; width: 100%; text-align: center; font-size: 12px; color: #94A3B8;">
        <p style="margin: 0; line-height: 1.6;">
          &copy; 2026 ZenResume. A product of <strong>Aneevarp Solutions</strong> (MSME Reg: <code>UDYAM-AP-10-0144446</code>). All rights reserved. Recruiter-verified ATS formatting tools.
        </p>
      </div>

    </div>
  </footer>'''

def fix_all_html():
    dirs = ['.', 'blog', 'role']
    count = 0
    pattern = re.compile(r'<footer class="site-publisher-footer[^>]*>.*?</footer>', re.DOTALL)
    
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                # Skip root index.html only
                if d == '.' and f == 'index.html':
                    continue
                p = os.path.join(d, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                if pattern.search(content):
                    content = pattern.sub(STITCH_FOOTER_HTML, content)
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(content)
                    count += 1
                    print(f"Fixed footer in: {p}")

    print(f"Total fixed: {count}")

if __name__ == '__main__':
    fix_all_html()
