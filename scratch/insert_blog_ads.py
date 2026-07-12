import os
import re

blog_dir = r"c:\Users\DELL\OneDrive\Desktop\PROJECTS\resume-builder\blog"

# AdSense Placeholder: Mid-Article
mid_ad_placeholder = """
      <!-- AdSense In-Article Mid Placeholder -->
      <div class="ad-placeholder-in-article no-print" style="margin: 35px 0; padding: 18px; background: rgba(0,0,0,0.02); border: 1px dashed rgba(22, 160, 133, 0.25); border-radius: 12px; text-align: center; box-shadow: inset 0 2px 8px rgba(0,0,0,0.01);">
        <span style="font-size: 10px; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 12px; font-weight: 600;">Advertisement</span>
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-1993051486567311"
             data-ad-slot="8372659102"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
"""

# AdSense Placeholder: Bottom of Article
bottom_ad_placeholder = """
      <!-- AdSense In-Article Bottom Placeholder -->
      <div class="ad-placeholder-in-article no-print" style="margin: 35px 0 15px 0; padding: 18px; background: rgba(0,0,0,0.02); border: 1px dashed rgba(22, 160, 133, 0.25); border-radius: 12px; text-align: center; box-shadow: inset 0 2px 8px rgba(0,0,0,0.01);">
        <span style="font-size: 10px; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 12px; font-weight: 600;">Advertisement</span>
        <ins class="adsbygoogle"
             style="display:block; text-align:center;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-1993051486567311"
             data-ad-slot="9823756105"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
"""

html_files = [f for f in os.listdir(blog_dir) if f.endswith(".html") and f != "index.html"]

for file_name in html_files:
    file_path = os.path.join(blog_dir, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if placeholders are already added to avoid double insertion
    if "AdSense In-Article Mid Placeholder" in content:
        print(f"Skipping (already has ads): {file_name}")
        continue
    
    # Find the article content div
    # <div class="article-content">
    # We want to insert the mid ad placeholder right before the first <h2> tag inside article-content
    art_start_match = re.search(r'(<div class="article-content">)', content)
    if not art_start_match:
        print(f"Error finding article-content in: {file_name}")
        continue
        
    start_pos = art_start_match.end()
    
    # Find the first <h2> tag after article-content start
    h2_match = re.search(r'<h2>', content[start_pos:])
    if not h2_match:
        print(f"Error finding <h2> in: {file_name}")
        continue
        
    h2_absolute_pos = start_pos + h2_match.start()
    
    # Insert mid-ad before the first h2
    modified_content = content[:h2_absolute_pos] + mid_ad_placeholder + content[h2_absolute_pos:]
    
    # Now find the end of the article-content div.
    # The end of the article-content is marked by the closing </div> tag before the CTA block.
    # Let's locate:
    #     </div>
    #
    #     <div style="text-align: center; margin-top: 60px;
    # We can search for the closing tag right before the text-align: center CTA block
    cta_pattern = r'</div>\s*<div style="text-align: center; margin-top: 60px;'
    cta_match = re.search(cta_pattern, modified_content)
    if not cta_match:
        print(f"Error finding CTA closure block in: {file_name}")
        continue
        
    cta_pos = cta_match.start() # Position of the closing </div>
    
    # Insert bottom-ad right before this closing </div>
    final_content = modified_content[:cta_pos] + bottom_ad_placeholder + modified_content[cta_pos:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(final_content)
        
    print(f"Successfully added ad placeholders to: {file_name}")
