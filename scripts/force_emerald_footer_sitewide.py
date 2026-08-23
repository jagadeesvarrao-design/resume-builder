import os
import re

EMERALD_FOOTER_STYLE = """<style id="zenresume-emerald-footer-style">
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
</style>"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update stylesheet link with cache-busting v=3.1
    content = re.sub(r'href="(\/)?styles\.css(\?v=[\d\.]+)*"', 'href="/styles.css?v=3.1"', content)

    # 2. Inject style tag before </head> if not present
    if 'id="zenresume-emerald-footer-style"' not in content:
        content = content.replace('</head>', f'{EMERALD_FOOTER_STYLE}\n</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                update_file(p)
                count += 1
    print(f"Applied cache-busting v=3.1 and guaranteed emerald footer styling across {count} HTML files!")

if __name__ == '__main__':
    main()
