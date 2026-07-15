import os
from PIL import Image

src_path = r"C:\Users\DELL\.gemini\antigravity\brain\d9476ac3-c75d-4216-bfe8-2d95a2993352\app_icon_512_1784131296490.png"
dest_dir = r"c:\Users\DELL\OneDrive\Desktop\PROJECTS\resume-builder"

# Open the generated image
img = Image.open(src_path)

# Save as icon-512.png (ensuring 512x512)
img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
img_512.save(os.path.join(dest_dir, "icon-512.png"), "PNG")
print("Saved icon-512.png")

# Save as icon-192.png (ensuring 192x192)
img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
img_192.save(os.path.join(dest_dir, "icon-192.png"), "PNG")
print("Saved icon-192.png")
