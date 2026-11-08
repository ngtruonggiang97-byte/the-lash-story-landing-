# Cat anh TAM tu 2 bang gia Lash. Chay: python scripts/crop-lash-images.py
# Nguon: assets/brand/lash-bang-gia-1.jpg, lash-bang-gia-2.jpg
# Ra: assets/lash-looks/*.webp, assets/lash-lift/*.webp (ban goc) va public/img/lash-looks, public/img/lash-lift (de trang dung).
# Toa do = ty le (x0, y0, x1, y1) tren chieu rong / cao cua anh, da co vao ~1% moi canh.
# Anh kieu mi co CHU TEN de len va phan giai thap (~390px): chi la anh tam, se thay bang anh that.
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = os.path.join(ROOT, "assets", "brand")
SHEETS = {
    "lash-bang-gia-1.jpg": ("lash-looks", {
        "classic": (0.054, 0.190, 0.328, 0.340),
        "baby-lash": (0.366, 0.190, 0.639, 0.341),
        "classic-plus": (0.054, 0.396, 0.332, 0.545),
        "kitten-lash": (0.370, 0.394, 0.645, 0.549),
        "pixie-lash": (0.682, 0.395, 0.958, 0.545),
        "sunny-lash": (0.376, 0.583, 0.651, 0.733),
        "medusa-lash": (0.054, 0.793, 0.328, 0.944),
        "anime-lash": (0.366, 0.793, 0.644, 0.944),
    }),
    "lash-bang-gia-2.jpg": ("lash-lift", {
        "lash-lift-1": (0.043, 0.149, 0.510, 0.287),
        "lash-lift-2": (0.515, 0.149, 0.962, 0.287),
        "brow-lift": (0.043, 0.564, 0.957, 0.699),
    }),
}

for fn, (folder, crops) in SHEETS.items():
    path = os.path.join(B, fn)
    if not os.path.exists(path):
        raise SystemExit(f"Thieu file {path}")
    im = Image.open(path).convert("RGB")
    W, H = im.size
    for name, (x0, y0, x1, y1) in crops.items():
        c = im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))
        for base in (os.path.join(ROOT, "assets"), os.path.join(ROOT, "public", "img")):
            d = os.path.join(base, folder)
            os.makedirs(d, exist_ok=True)
            c.save(os.path.join(d, name + ".webp"), "WEBP", quality=88)
        print(name, c.size)
