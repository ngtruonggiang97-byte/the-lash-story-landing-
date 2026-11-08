// Mot nguon du lieu cho ca 2 ngon ngu. Ten mau giu nguyen; chu "nen mong" / "co noi" lay tu src/i18n.
// Nguon gia / nen mong: assets/brand/collection-1..3.png (gia VND o ca 2 ban).
// Anh: assets/collection/<Ten mau>.png (Ryan cung cap) -> public/img/collection/<slug>.webp
// w/h: kich thuoc that cua anh. pos: diem canh khi cat vao khung 4:5 (mac dinh giua).
// base: "natural" = nen mong that, "gelx" = nen mong up Gel X. ext: co noi hay khong.
export const COLLECTION = [
  { slug: "antique-rose", name: "Antique Rose", price: 350000, base: "natural", ext: false, w: 635, h: 854 },
  { slug: "ivory-edge", name: "Ivory Edge", price: 450000, base: "natural", ext: false, w: 635, h: 848 },
  { slug: "milky-french-tip", name: "Milky French Tip", price: 480000, base: "natural", ext: false, w: 635, h: 848 },
  { slug: "blush-whisper", name: "Blush Whisper", price: 500000, base: "natural", ext: false, w: 635, h: 846 },
  { slug: "creamy-mocha-spots", name: "Creamy Mocha Spots", price: 500000, base: "natural", ext: false, w: 635, h: 837 },
  { slug: "leopard-luxe-french", name: "Leopard Luxe French", price: 575000, base: "natural", ext: false, w: 635, h: 848 },
  { slug: "hello-kitty-dotty", name: "Hello Kitty Dotty", price: 590000, base: "natural", ext: false, w: 635, h: 848 },
  { slug: "mighty-mirror", name: "Mighty Mirror", price: 700000, base: "natural", ext: false, w: 524, h: 964, pos: "50% 62%" },
  { slug: "teal-marble-gem", name: "Teal Marble Gem", price: 850000, base: "gelx", ext: false, w: 635, h: 635 },
  { slug: "chic-lemon-stiletto", name: "Chic Lemon Stiletto", price: 980000, base: "gelx", ext: false, w: 635, h: 847 },
  { slug: "bow-tiful", name: "Bow-tiful", price: 1320000, base: "gelx", ext: true, w: 635, h: 848 },
  { slug: "sepia-victorian", name: "Sepia Victorian", price: 1650000, base: "gelx", ext: true, w: 541, h: 964, pos: "50% 55%" },
];

// 6 post Instagram moi nhat (ma post = phan sau /p/ trong link). Anh: public/images/insta/insta-N.webp (640x640).
export const INSTA_POSTS = ["DfJdflUvk1R", "De9i8zlvewD", "DfBvlF6vR19", "DGqEjRSv_9O", "DeUBd2iva9-", "DcNUfeQj_sL"];

export const img = (slug) => `/img/collection/${slug}.webp`;
