import os
from PIL import Image

SRC_PATH = r"C:\Users\DELL\.gemini\antigravity\brain\d9476ac3-c75d-4216-bfe8-2d95a2993352\.user_uploaded\media_1787235610253.png"

def refine_brand_assets():
    raw_img = Image.open(SRC_PATH).convert("RGBA")
    w, h = raw_img.size
    print(f"Raw image size: {w}x{h}")

    # Crop the green central card
    # The green card has a distinct green color (around RGB 145, 200, 160)
    # Let's find bounding box of the green card
    bbox = None
    # Let's scan pixels from center outward to find the green card bounds
    # In this 1024x558 image, the green card is in the center
    # Let's crop the green card specifically:
    # Let's find the card's bounding box:
    card_crop = raw_img.crop((230, 0, 794, 558)) # roughly square card
    card_crop.save("logo-card.png", "PNG", optimize=True)
    
    # Let's create the master logo square (the green card resized to 512x512)
    logo_512 = card_crop.resize((512, 512), Image.Resampling.LANCZOS)
    logo_512.save("icon-512.png", "PNG", optimize=True)
    logo_512.save("logo.png", "PNG", optimize=True)

    logo_192 = card_crop.resize((192, 192), Image.Resampling.LANCZOS)
    logo_192.save("icon-192.png", "PNG", optimize=True)

    logo_180 = card_crop.resize((180, 180), Image.Resampling.LANCZOS)
    logo_180.save("apple-touch-icon.png", "PNG", optimize=True)

    logo_96 = card_crop.resize((96, 96), Image.Resampling.LANCZOS)
    logo_96.save("favicon-96x96.png", "PNG", optimize=True)

    logo_48 = card_crop.resize((48, 48), Image.Resampling.LANCZOS)
    logo_48.save("favicon.png", "PNG", optimize=True)

    # Multi-size ICO for universal browser support
    logo_48.save(
        "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )

    # Social OG image
    og_img = Image.new("RGB", (1200, 630), (237, 246, 242))
    # Place card in center
    target_h = 520
    target_w = int(520 * (card_crop.width / card_crop.height))
    resized_card = card_crop.resize((target_w, target_h), Image.Resampling.LANCZOS)
    paste_x = (1200 - target_w) // 2
    paste_y = (630 - target_h) // 2
    og_img.paste(resized_card, (paste_x, paste_y), resized_card if resized_card.mode == 'RGBA' else None)
    og_img.save("og-image.png", "PNG", optimize=True)

    print("Refined all favicon and logo assets successfully!")

if __name__ == "__main__":
    refine_brand_assets()
