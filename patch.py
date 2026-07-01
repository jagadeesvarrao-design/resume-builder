
import re
with open('templates-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('render: (data) => {')
new_parts = [parts[0]]

for part in parts[1:]:
    if 'RenderHelpers.header' in part and 'RenderHelpers.summary' not in part:
        part = re.sub(
            r'(html \+= RenderHelpers\.header.*?;)', 
            r'\1\n      html += RenderHelpers.summary(data, font, \'Professional Summary\', accent);', 
            part
        )
    new_parts.append(part)

with open('templates-data.js', 'w', encoding='utf-8') as f:
    f.write('render: (data) => {'.join(new_parts))
print('Patched templates-data.js')

