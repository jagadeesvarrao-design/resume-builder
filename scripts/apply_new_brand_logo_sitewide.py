import os
import re

FAVICON_TAGS = """  <link rel="icon" type="image/png" sizes="48x48" href="https://www.zenresume.online/favicon.png">
  <link rel="icon" type="image/png" sizes="96x96" href="https://www.zenresume.online/favicon-96x96.png">
  <link rel="icon" type="image/png" sizes="192x192" href="https://www.zenresume.online/icon-192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="https://www.zenresume.online/icon-512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="https://www.zenresume.online/apple-touch-icon.png">
  <link rel="shortcut icon" href="https://www.zenresume.online/favicon.ico">"""

NAVBAR_LOGO_HTML = """      <img src="https://www.zenresume.online/favicon-96x96.png" alt="ZenResume Logo" style="width: 32px; height: 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); object-fit: cover;">"""

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update/Add favicon tags in <head>
    # If old favicon tag exists, replace it, otherwise inject before </head>
    if 'rel="icon"' in content:
        content = re.sub(r'<link[^>]*rel=["\'](?:shortcut )?icon["\'][^>]*>', '', content)
        content = re.sub(r'<link[^>]*rel=["\']apple-touch-icon["\'][^>]*>', '', content)
    
    content = content.replace('</head>', f'{FAVICON_TAGS}\n</head>')

    # 2. Update navbar logo if old div exists
    if '<div class="header-logo-icon"' in content:
        content = re.sub(
            r'<div class="header-logo-icon"[^>]*>.*?</div>',
            NAVBAR_LOGO_HTML.strip(),
            content,
            flags=re.DOTALL
        )
    elif '<div style="background: linear-gradient(135deg, var(--primary-calm), var(--primary-light)); width: 32px; height: 32px;' in content:
        content = re.sub(
            r'<div style="background: linear-gradient\(135deg, var\(--primary-calm\), var\(--primary-light\)\); width: 32px; height: 32px;[^>]*>.*?</div>',
            NAVBAR_LOGO_HTML.strip(),
            content,
            flags=re.DOTALL
        )

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
    print(f"Successfully applied new Google Search Logo & Favicon metadata across {count} HTML pages!")

if __name__ == "__main__":
    main()
