import re
with open('templates-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\'Professional Summary\'", r'"Professional Summary"')

with open('templates-data.js', 'w', encoding='utf-8') as f:
    f.write(content)
