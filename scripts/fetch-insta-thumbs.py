"""Lay thumb 640x640 cua 6 post Instagram theo ma post trong src/data/insta.js.
Chay: python scripts/fetch-insta-thumbs.py
Anh CDN Instagram het han, nen chi dung de tai ve 1 lan roi luu thanh file tinh."""
import re, io, html, urllib.request
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
codes = re.findall(r'"([\w-]{8,})"', (root / "src/data/insta.js").read_text(encoding="utf8").split("INSTA_POSTS")[1])
UA = {"User-Agent": "Mozilla/5.0"}
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=30).read()

for i, code in enumerate(codes, 1):
    page = get(f"https://www.instagram.com/p/{code}/embed/captioned/").decode("utf8", "ignore")
    m = re.search(r'class="EmbeddedMediaImage"[^>]*?src="([^"]+)"', page)
    if not m:
        print(f"[{i}] {code}: KHONG tim thay anh"); continue
    img = Image.open(io.BytesIO(get(html.unescape(m.group(1))))).convert("RGB")
    w, h = img.size; s = min(w, h)
    img = img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)).resize((640, 640), Image.LANCZOS)
    img.save(root / f"public/images/insta/insta-{i}.webp", "WEBP", quality=82)
    print(f"[{i}] {code}: OK {w}x{h}")
