// Nguon gia / nen mong: assets/brand/collection-1..3.png
// Anh: assets/collection/<Ten mau>.png (Ryan cung cap) -> public/img/collection/<slug>.webp
// w/h: kich thuoc that cua anh. pos: diem canh khi cat vao khung 4:5 (mac dinh giua).
export const COLLECTION = [
  { slug: "antique-rose", name: "Antique Rose", price: 350000, base: "Nền móng thật", ext: false, w: 635, h: 854 },
  { slug: "ivory-edge", name: "Ivory Edge", price: 450000, base: "Nền móng thật", ext: false, w: 635, h: 848 },
  { slug: "milky-french-tip", name: "Milky French Tip", price: 480000, base: "Nền móng thật", ext: false, w: 635, h: 848 },
  { slug: "blush-whisper", name: "Blush Whisper", price: 500000, base: "Nền móng thật", ext: false, w: 635, h: 846 },
  { slug: "creamy-mocha-spots", name: "Creamy Mocha Spots", price: 500000, base: "Nền móng thật", ext: false, w: 635, h: 837 },
  { slug: "leopard-luxe-french", name: "Leopard Luxe French", price: 575000, base: "Nền móng thật", ext: false, w: 635, h: 848 },
  { slug: "hello-kitty-dotty", name: "Hello Kitty Dotty", price: 590000, base: "Nền móng thật", ext: false, w: 635, h: 848 },
  { slug: "mighty-mirror", name: "Mighty Mirror", price: 700000, base: "Nền móng thật", ext: false, w: 524, h: 964, pos: "50% 62%" },
  { slug: "teal-marble-gem", name: "Teal Marble Gem", price: 850000, base: "Nền móng úp Gel X", ext: false, w: 635, h: 635 },
  { slug: "chic-lemon-stiletto", name: "Chic Lemon Stiletto", price: 980000, base: "Nền móng úp Gel X", ext: false, w: 635, h: 847 },
  { slug: "bow-tiful", name: "Bow-tiful", price: 1320000, base: "Nền móng úp Gel X", ext: true, w: 635, h: 848 },
  { slug: "sepia-victorian", name: "Sepia Victorian", price: 1650000, base: "Nền móng úp Gel X", ext: true, w: 541, h: 964, pos: "50% 55%" },
];

export const fmtPrice = (n) => n.toLocaleString("vi-VN").replace(/,/g, ".") + "đ";
export const extLabel = (ext) => (ext ? "Có nối" : "Không nối");
export const img = (slug) => `/img/collection/${slug}.webp`;
export const bySlug = (slug) => COLLECTION.find((c) => c.slug === slug);
