# -*- coding: utf-8 -*-
with open('scripts/build_pillar_blog_articles.py', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8', errors='ignore')
text = text.replace('\u2014', '&mdash;').replace('\u2013', '&ndash;').replace('\u2018', "'").replace('\u2019', "'").replace('\u201c', '"').replace('\u201d', '"')

with open('scripts/build_pillar_blog_articles.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Decoded and cleaned build_pillar_blog_articles.py")
