import os

def add_zenscout_footer_pill():
    dirs = ['.', 'blog', 'role']
    count = 0
    pill_html = '<a href="https://ai-job-search-agent-chi.vercel.app/" target="_blank" rel="noopener noreferrer" class="footer-nav-pill" style="color: #00E5BC !important;"><i class="fas fa-robot" style="font-size: 11px;"></i> ZenScout AI</a>'

    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()

                # Add to footer-nav-container or Popular Role Resume Guides if not already present
                if 'ai-job-search-agent-chi.vercel.app' not in content:
                    if '<a href="/about.html" class="footer-nav-pill">' in content:
                        content = content.replace(
                            '<a href="/about.html" class="footer-nav-pill">',
                            pill_html + '\n            <a href="/about.html" class="footer-nav-pill">'
                        )
                    elif '<a href="/role/index.html" class="footer-nav-pill"' in content:
                        content = content.replace(
                            '<a href="/role/index.html" class="footer-nav-pill"',
                            pill_html + '\n          <a href="/role/index.html" class="footer-nav-pill"'
                        )
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(content)
                    count += 1

    print(f"Added ZenScout AI footer link across {count} HTML pages!")

if __name__ == '__main__':
    add_zenscout_footer_pill()
