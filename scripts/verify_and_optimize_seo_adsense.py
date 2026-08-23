import os
import re

def optimize_html_files():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()

                # Ensure canonical and OG URLs use https://www.zenresume.online
                content = content.replace('https://zenresume.online/', 'https://www.zenresume.online/')
                content = content.replace('https://zenresume.online"', 'https://www.zenresume.online/"')

                with open(p, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1
    print(f"Standardized canonical URLs and OG domain tags across {count} HTML files!")

if __name__ == '__main__':
    optimize_html_files()
