// Bang gia: chi giu id + gia (VND, ghi "K" = nghin). Ten dich vu o src/i18n -> menu.items.<id>.
// Nguon: assets/brand/bang-gia.png (ap dung tu 20/05/2026 - ngay hien thi nam trong i18n menu.effective).
export const PRICES = [
  {
    id: "gel",
    items: [
      { id: "apex", price: "350K" },
      { id: "pedi", price: "250K" },
      { id: "biab", price: "400K" },
      { id: "press", price: "450K" },
      { id: "gelx", price: "500K" },
      { id: "dual", price: "650K" },
      { id: "removal", price: "40 - 100K" },
      { id: "length", price: "100 - 200K" },
    ],
  },
  {
    id: "design",
    items: [
      { id: "glitter", price: "100K" },
      { id: "chrome", price: "130K" },
      { id: "french", price: "150K" },
      { id: "ombre", price: "150K" },
      { id: "others", price: "15 - 300K" },
      { id: "concealer", price: "50K" },
    ],
  },
  {
    id: "spa",
    items: [
      { id: "handSpa", price: "400K" },
      { id: "footSpa", price: "400K" },
    ],
  },
];

// TODO Ryan: xac nhan gio mo cua that cua studio
export const TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
