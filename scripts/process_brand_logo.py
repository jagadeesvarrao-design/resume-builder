import os
from PIL import Image

SRC_PATH = r"C:\Users\DELL\.gemini\antigravity\brain\d9476ac3-c75d-4216-bfe8-2d95a2993352\.user_uploaded\media_1787235610253.png"

def process_images():
    img = Image.open(SRC_PATH).convert("RGBA")
    print(f"Loaded image: {img.size}, format: {img.format}")

    # 1. Save master logo.png
    img.save("logo.png", "PNG", optimize=True)
    print("Saved logo.png")

    # 2. Extract the central square emblem (the green square with Z checkmark & text or the rounded card)
    # Let's inspect bounding box of non-white background
    # The image has an outer margin and an inner rounded green card
    w, h = img.size
    
    # Let's create high-res 512x512, 192x192, 180x180, 96x96, 48x48, 32x32, 16x16
    # For square favicons, crop to square center if needed
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    square_img = img.crop((left, top, left + min_dim, top + min_dim))
    
    # Save standard PWA & Google Favicon icons
    square_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
    square_512.save("icon-512.png", "PNG", optimize=True)
    
    square_192 = square_img.resize((192, 192), Image.Resampling.LANCZOS)
    square_192.save("icon-192.png", "PNG", optimize=True)
    
    square_180 = square_img.resize((180, 180), Image.Resampling.LANCZOS)
    square_180.save("apple-touch-icon.png", "PNG", optimize=True)
    
    square_96 = square_img.resize((96, 96), Image.Resampling.LANCZOS)
    square_96.save("favicon-96x96.png", "PNG", optimize=True)
    
    square_48 = square_img.resize((48, 48), Image.Resampling.LANCZOS)
    square_48.save("favicon.png", "PNG", optimize=True)
    
    # Multi-size ICO file
    square_img.resize((48, 48), Image.Resampling.LANCZOS).save(
        "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("Saved favicon.ico, favicon.png, favicon-96x96.png, apple-touch-icon.png, icon-192.png, icon-512.png")

    # 3. Create OpenGraph Social Card (1200x630) for Google Search rich snippets & social sharing
    og_canvas = Image.new("RGBA", (1200, 630), (245, 248, 246, 255))
    # Place image in center
    target_h = 560
    aspect = w / h
    target_w = int(target_h * aspect)
    resized_hero = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    paste_x = (1200 - target_w) // 2
    paste_y = (630 - target_h) // 2
    og_canvas.paste(resized_hero, (paste_x, paste_y), resized_hero)
    og_canvas.convert("RGB").save("og-image.png", "PNG", optimize=True)
    print("Saved og-image.png (1200x630)")

if __name__ == "__main__":
    process_images()
