# Handoff - làm tiếp trên máy khác

Đọc `CLAUDE.md` trước. File này ghi các quyết định đã chốt với Ryan và việc còn dở.

## Chạy dự án
```bash
npm install
npx playwright install chromium   # chỉ cần nếu chụp screenshot / chạy kiểm tra
npm run dev                       # http://localhost:5173
node scripts/shots.mjs            # screenshot 390px + 1440px vào shots/
node scripts/check.mjs            # kiểm tra cuộn, collection, form (cần dev server)
```

## Quyết định đã chốt
- Hướng thiết kế **B "Lookbook"**: hero ảnh full-bleed, tagline phủ ánh xà cừ (Nacre), collection dạng chồng thẻ vuốt. Góc vuông toàn trang (trừ icon social tròn ở footer).
- Collection: **không** có nút "Chọn mẫu này". Tiêu đề "Collection".
- Font (đã kiểm tra glyph):
  - Libre Baskerville và Libre Caslon **thiếu dấu tiếng Việt** (chỉ có á, đ...). Chỉ dùng cho tiêu đề tiếng Anh.
  - Tiêu đề tiếng Việt: Cormorant Garamond (Ryan duyệt).
  - Nội dung: Be Vietnam Pro là **font tạm**, chờ file Aptima / TT Norm (`assets/fonts/` vẫn trống).
- Motion: mọi thời lượng / easing là token trong `src/styles/base.css` (`--ease-soft`, `--dur-reveal`...). Ryan đã duyệt tốc độ hiện tại.
- H2 lớn dùng chung token `--h2` (nhỏ hơn rõ so với H1 hero).
- Ảnh foil trên ảnh móng dùng blend `overlay`, không dùng `color-dodge` (làm sai màu móng).
- Số hiển thị thống nhất: `086 656 6819`, link Zalo `https://zalo.me/0866566819`.

## Ảnh
- Hero: `public/images/hero/hero-mobile.webp` (dọc) + `hero-desktop.webp` (16:9). Gốc 713×854 ở `assets/space/storefront-original.webp`, hơi mềm trên desktop, cần bản gốc lớn hơn.
- Our Story: `public/images/story/story-1..4.webp` (900×1125, 4:5) đã là ảnh thật, gốc 1080×1350 ở `assets/space/1-4.png`. Khớp: story-1 = 4.png (dãy bàn), story-2 = 1.png (sofa chờ), story-3 = 2.png (kệ màu), story-4 = 3.png (đang làm móng).
- Collection: ảnh thật của Ryan ở `assets/collection/<Tên mẫu>.png` -> `public/img/collection/<slug>.webp`.

## Deploy
- Vercel, team `vietnamdee`, project `the-nail-story-landing`: https://the-nail-story-landing.vercel.app
- Trên máy mới: `npx vercel login`, `npx vercel link` (chọn đúng project trên), rồi `npx vercel --prod` để cập nhật.

## Việc còn dở
1. Form đặt lịch mới validate + hiện cảm ơn, **chưa gửi dữ liệu**. Bước tiếp: Google Apps Script -> Google Sheets (payload đã gom sẵn trong `src/main.js`).
2. Link tạm: Facebook, TikTok (`#`), nút "Khám phá" The Lash Story (`#`), Google Maps (đang là link tìm kiếm).
3. Giờ mở cửa thật để chỉnh khung giờ (`src/data/prices.js`, `TIME_SLOTS`).
4. Ảnh hero độ phân giải cao hơn (bản hiện tại 713px, hơi mềm trên desktop).
