// Bang gia The Lash Story: chi giu id + gia (VND, ghi "K" = nghin). Ten dich vu o src/i18n -> menu.*
// Nguon: assets/brand/lash-bang-gia-1.jpg, lash-bang-gia-2.jpg (ap dung tu 20/05/2026).
// img: anh tam cat tu bang gia (scripts/crop-lash-images.py) -> public/img/lash-looks/<img>.webp

// Lash Extension: 3 nhom kieu mi, moi kieu co anh de hien trong khung xem
export const EXTENSION = [
  { id: "natural", looks: [
    { id: "classic", price: "350K", img: "classic" },
    { id: "babyLash", price: "400K", img: "baby-lash" },
  ] },
  { id: "signature", looks: [
    { id: "classicPlus", price: "400K", img: "classic-plus" },
    { id: "kittenLash", price: "400K", img: "kitten-lash" },
    { id: "pixieLash", price: "400K", img: "pixie-lash" },
    { id: "sunnyLash", price: "420K", img: "sunny-lash" },
  ] },
  { id: "glam", looks: [
    { id: "medusaLash", price: "450K", img: "medusa-lash" },
    { id: "animeLash", price: "450K", img: "anime-lash" },
  ] },
];

export const SURCHARGE = [
  { id: "removal", price: "40 - 80K" },
  { id: "bottom", price: "50 - 80K" },
  { id: "thick", price: "+50K" },
  { id: "special", price: "+50K" },
];

export const LASH_LIFT = [
  { id: "lift", price: "500K" },
  { id: "liftPremium", price: "650K" },
  { id: "treatment", price: "200K" },
];

export const BROW_LIFT = [
  { id: "browLift", price: "550K" },
  { id: "browPremium", price: "700K" },
  { id: "browTint", price: "250K" },
  { id: "threading", price: "120 - 150K" },
];

// TODO Ryan: xac nhan gio mo cua that cua studio
export const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
