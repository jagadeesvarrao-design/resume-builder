import os

meta_tag = '  <meta name="google-adsense-account" content="ca-pub-1993051486567311">\n'
old_url = 'resume-builder-swart-sigma-93.vercel.app'
new_url = 'zenresume.online'

def process_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False
    
    # 1. Add AdSense meta tag if not present
    if 'google-adsense-account' not in content:
        head_idx = content.find('<head>')
        if head_idx != -1:
            insert_pos = head_idx + len('<head>\n')
            # Check if there is already a newline, if not just head_idx + len('<head>')
            if content[head_idx + len('<head>')] != '\n':
                insert_pos = head_idx + len('<head>')
            content = content[:insert_pos] + meta_tag + content[insert_pos:]
            modified = True
            print(f"Added AdSense verification tag to {file_path}")

    # 2. Update canonical and social sharing URLs
    if old_url in content:
        content = content.replace(old_url, new_url)
        modified = True
        print(f"Updated domain URLs in {file_path}")

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    root_dir = 'c:\\Users\\DELL\\OneDrive\\Desktop\\PROJECTS\\resume-builder'
    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules and git
        if 'node_modules' in root or '.git' in root or 'scratch' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                process_html_file(file_path)

if __name__ == '__main__':
    main()
