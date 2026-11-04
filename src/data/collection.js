// Nguon: assets/brand/collection-1..3.png
export const COLLECTION = [
  { slug: "antique-rose", name: "Antique Rose", price: 350000, base: "Nền móng thật", ext: false },
  { slug: "ivory-edge", name: "Ivory Edge", price: 450000, base: "Nền móng thật", ext: false },
  { slug: "milky-french-tip", name: "Milky French Tip", price: 480000, base: "Nền móng thật", ext: false },
  { slug: "blush-whisper", name: "Blush Whisper", price: 500000, base: "Nền móng thật", ext: false },
  { slug: "creamy-mocha-spots", name: "Creamy Mocha Spots", price: 500000, base: "Nền móng thật", ext: false },
  { slug: "leopard-luxe-french", name: "Leopard Luxe French", price: 575000, base: "Nền móng thật", ext: false },
  { slug: "hello-kitty-dotty", name: "Hello Kitty Dotty", price: 590000, base: "Nền móng thật", ext: false },
  { slug: "mighty-mirror", name: "Mighty Mirror", price: 700000, base: "Nền móng thật", ext: false },
  { slug: "teal-marble-gem", name: "Teal Marble Gem", price: 850000, base: "Nền móng úp Gel X", ext: false },
  { slug: "chic-lemon-stiletto", name: "Chic Lemon Stiletto", price: 980000, base: "Nền móng úp Gel X", ext: false },
  { slug: "bow-tiful", name: "Bow-tiful", price: 1320000, base: "Nền móng úp Gel X", ext: true },
  { slug: "sepia-victorian", name: "Sepia Victorian", price: 1650000, base: "Nền móng úp Gel X", ext: true },
];

export const fmtPrice = (n) => n.toLocaleString("vi-VN").replace(/,/g, ".") + "đ";
export const extLabel = (ext) => (ext ? "Có nối" : "Không nối");
export const img = (slug) => `/img/collection/${slug}.webp`;
