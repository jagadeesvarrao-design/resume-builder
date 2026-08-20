import os
import re

def count_words_in_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    text = re.sub(r'<script.*?</script>', ' ', html, flags=re.DOTALL)
    text = re.sub(r'<style.*?</style>', ' ', text, flags=re.DOTALL)
    text = re.sub(r'<.*?>', ' ', text)
    words = re.findall(r'\b\w+\b', text)
    return len(words), html

def main():
    total_words = 0
    total_files = 0
    errors = 0
    
    dirs = ['.', 'blog', 'role']
    for d in dirs:
        files = [os.path.join(d, f) for f in os.listdir(d) if f.endswith('.html') and not f.startswith('google')]
        for f in files:
            words, html = count_words_in_html(f)
            total_words += words
            total_files += 1
            if not html.startswith('<!DOCTYPE html>'):
                print(f"Error: Missing DOCTYPE in {f}")
                errors += 1
            if '</html>' not in html:
                print(f"Error: Missing closing </html> in {f}")
                errors += 1
            if html.count('<article') != html.count('</article>'):
                print(f"Error: Unbalanced <article> in {f}")
                errors += 1

    print("==================================================")
    print(f"Total Verified HTML Pages: {total_files}")
    print(f"Total Word Count Across Website: {total_words:,} words")
    print(f"Average Words Per Page: {total_words // total_files:,} words")
    print(f"Total HTML Syntax Errors: {errors}")
    print("==================================================")

if __name__ == "__main__":
    main()
