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
- Our Story: `public/images/story/story-1..4.webp`, đều dọc 4:5. File hiện tại là ảnh tạm trong suốt, chép đè ảnh thật là nhãn tự ẩn. Cách chụp: `SHOTLIST.md`.

## Deploy
- Vercel, team `vietnamdee`, project `the-nail-story-landing`: https://the-nail-story-landing.vercel.app
- Trên máy mới: `npx vercel login`, `npx vercel link` (chọn đúng project trên), rồi `npx vercel --prod` để cập nhật.

## Việc còn dở
1. Form đặt lịch mới validate + hiện cảm ơn, **chưa gửi dữ liệu**. Bước tiếp: Google Apps Script -> Google Sheets (payload đã gom sẵn trong `src/main.js`).
2. Link tạm: Facebook, TikTok (`#`), nút "Khám phá" The Lash Story (`#`), Google Maps (đang là link tìm kiếm).
3. Giờ mở cửa thật để chỉnh khung giờ (`src/data/prices.js`, `TIME_SLOTS`).
4. Ảnh thật cho Our Story, ảnh hero độ phân giải cao, ảnh collection lớn hơn 640px.
5. SHOTLIST.md chưa cập nhật: Our Story giờ là 4 ảnh 4:5 (ảnh 4: khoảnh khắc làm móng).
