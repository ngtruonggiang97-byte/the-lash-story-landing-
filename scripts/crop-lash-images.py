# Cat anh menu tu anh nguon 1254x1254 (assets/lash-extension/*.png, assets/lash-lift/lash-lift-{1,2}.png, assets/brow-lift/brow-lift.png).
# Chay: python scripts/crop-lash-images.py   (can: pip install pillow)
# Ra: public/img/lash-looks/*.webp (1000x1000, nguyen anh vuong), public/img/lash-lift/*.webp.
# eye(): (cx, cy) = tam mat, W = chieu rong khung cat, tinh theo px anh nguon.
import os
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "assets")
OUT = os.path.join(ROOT, "public", "img")

def save(c, name, folder, size):
    c = c.resize(size, Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=2))
    d = os.path.join(OUT, folder); os.makedirs(d, exist_ok=True)
    c.save(os.path.join(d, name + ".webp"), "WEBP", quality=90, method=6)
    print(name, size)

# 8 anh Lash Extension: giu nguyen anh vuong, chi thu ve 1000x1000
for n in ("classic", "baby-lash", "classic-plus", "kitten-lash", "pixie-lash", "sunny-lash", "medusa-lash", "anime-lash"):
    save(Image.open(os.path.join(A, "lash-extension", n + ".png")).convert("RGB"), n, "lash-looks", (1000, 1000))
for n in ("lash-lift-1", "lash-lift-2"):
    save(Image.open(os.path.join(A, "lash-lift", n + ".png")).convert("RGB"), n, "lash-lift", (800, 800))
# Brow Lift: cat bo vien trang tren / duoi (anh nguon co 2 dai trang, noi dung nam o y 111-589)
bl = Image.open(os.path.join(A, "brow-lift", "brow-lift.png")).convert("RGB")
save(bl.crop((0, 116, bl.width, 584)), "brow-lift", "lash-lift", (1600, 352))
