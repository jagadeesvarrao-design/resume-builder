import os
import re

STITCH_FOOTER_HTML = '''  <!-- Site Footer (Stitch Modern Dark Canvas) -->
  <footer class="stitch-footer no-print" style="background: #0B1315; color: #FFFFFF; padding: 60px 24px 40px 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); margin-top: 60px; width: 100%; box-sizing: border-box;">
    <div class="stitch-footer-container" style="max-width: 1160px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 28px; text-align: center;">
      
      <div class="stitch-footer-logo" style="display: flex; align-items: center; justify-content: center; gap: 10px;">
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
          <a href="/role/" class="footer-nav-pill" style="color: #00E5BC !important; font-weight: 700;">View All 63 Roles &rarr;</a>
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

EMERALD_STYLE = '''<style id="zenresume-emerald-footer-style">
  .stitch-footer {
    background: #0B1315 !important;
    color: #FFFFFF !important;
    padding: 60px 24px 40px 24px !important;
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    margin-top: 60px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
  .stitch-footer-container {
    max-width: 1160px !important;
    margin: 0 auto !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 28px !important;
    text-align: center !important;
  }
  .stitch-footer a.footer-nav-pill,
  .site-publisher-footer a.footer-nav-pill,
  .footer-nav-pill,
  footer a.footer-nav-pill,
  footer a:link,
  footer a:visited,
  .stitch-footer a:link,
  .stitch-footer a:visited {
    color: #00E5BC !important;
    background: rgba(0, 104, 86, 0.22) !important;
    border: 1px solid rgba(0, 168, 138, 0.4) !important;
    text-decoration: none !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    padding: 7px 16px !important;
    border-radius: 9999px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
  }
  .stitch-footer a.footer-nav-pill:hover,
  .site-publisher-footer a.footer-nav-pill:hover,
  .footer-nav-pill:hover,
  footer a:hover,
  .stitch-footer a:hover {
    color: #FFFFFF !important;
    background: #006856 !important;
    border-color: #00A88A !important;
    transform: translateY(-3px) scale(1.05) !important;
    box-shadow: 0 6px 20px rgba(0, 168, 138, 0.5) !important;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5) !important;
  }
</style>'''

def process_all_pages():
    dirs = ['.', 'blog', 'role']
    processed_count = 0
    all_files = []

    footer_regex = re.compile(r'<footer[^>]*>.*?</footer>', re.DOTALL)
    style_regex = re.compile(r'<style id="zenresume-emerald-footer-style">.*?</style>', re.DOTALL)

    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                all_files.append(p)
                
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()

                # 1. Update/Inject Head Style
                if style_regex.search(content):
                    content = style_regex.sub(EMERALD_STYLE, content)
                else:
                    if '</head>' in content:
                        content = content.replace('</head>', f"{EMERALD_STYLE}\n</head>")

                # 2. Update CSS Cache Buster to v=3.3
                content = re.sub(r'/styles\.css(\?v=[\d\.]+)?', '/styles.css?v=3.3', content)

                # 3. Replace Footer with exact STITCH_FOOTER_HTML
                if footer_regex.search(content):
                    content = footer_regex.sub(STITCH_FOOTER_HTML, content)
                else:
                    if '</body>' in content:
                        content = content.replace('</body>', f"{STITCH_FOOTER_HTML}\n</body>")

                with open(p, 'w', encoding='utf-8') as file:
                    file.write(content)

                processed_count += 1

    print(f"Successfully verified and updated 100% of HTML files ({processed_count}/{len(all_files)}) with identical Stitch dark footers and emerald buttons!")

if __name__ == '__main__':
    process_all_pages()
