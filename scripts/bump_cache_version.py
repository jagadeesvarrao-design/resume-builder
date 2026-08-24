import os

def bump_version():
    dirs = ['.', 'blog', 'role']
    count = 0
    for d in dirs:
        for f in os.listdir(d):
            if f.endswith('.html') and not f.startswith('google'):
                p = os.path.join(d, f)
                with open(p, 'r', encoding='utf-8') as file:
                    content = file.read()

                content = content.replace('/styles.css?v=3.1', '/styles.css?v=3.2')
                content = content.replace('/styles.css', '/styles.css?v=3.2')
                content = content.replace('/styles.css?v=3.2?v=3.2', '/styles.css?v=3.2')

                with open(p, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1
    print(f"Bumped CSS cache buster to v=3.2 across {count} HTML files!")

if __name__ == '__main__':
    bump_version()


