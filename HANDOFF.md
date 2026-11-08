# Handoff - làm tiếp trên máy khác

Đọc `CLAUDE.md` trước. File này ghi các quyết định đã chốt với Ryan và việc còn dở.

## Chạy dự án
```bash
npm install
npx playwright install chromium   # chỉ cần nếu chụp screenshot / chạy kiểm tra
npm run dev                       # http://localhost:5173
npm run build                     # ra dist/index.html (vi) + dist/en/index.html (en)
node scripts/shots.mjs index en   # screenshot 390px + 1440px, bản Việt ("index") và Anh ("en") vào shots/
npm run check                     # kiểm tra cuộn, collection, form bản Việt (cần dev server)
npm run check:i18n                # kiểm tra song ngữ: switch, UTM, form, ads, quét lẫn ngôn ngữ (cần dev server)
npm run i18n:check                # vi.js và en.js phải cùng bộ key
npm run i18n:table                # tạo lại I18N-REVIEW.md (bảng key | VI | EN)
```

## Song ngữ (1 codebase, 2 URL: "/" = Việt, "/en/" = Anh)
- **Chữ**: `src/i18n/vi.js` và `en.js` (cùng key). Sửa chữ chỉ sửa 2 file này. Bố cục / CSS / ảnh dùng chung.
- **Một template**: `src/template.html`. `build/render.js` điền chữ + dựng sẵn danh sách (menu, collection, Instagram, khung giờ) thành **HTML tĩnh** lúc build; plugin `build/pages-plugin.js` xuất `dist/index.html` và `dist/en/index.html`. Dev cũng render 2 URL này (sửa i18n / template là trang tự tải lại).
- Dữ liệu dùng chung ở `src/data/` (collection, bảng giá VND, 6 post Instagram). Chỉ tên dịch vụ / nhãn nằm trong i18n.
- Switch **VI | EN** (góc phải nav) là link `<a>` thật, cùng tab; JS chỉ thêm `?query` + `#hash` (giữ UTM). Không tự chuyển ngôn ngữ theo trình duyệt.
- SEO: mỗi trang có `lang`, title, description, OG, canonical, hreflang (vi / en / x-default = Việt). Domain lấy từ `src/config/site.js` (đổi khi gắn tên miền riêng, hoặc đặt biến môi trường `SITE_URL` lúc build). Ảnh chia sẻ `public/images/og-share.jpg`.
- Bản Anh dùng WhatsApp (`wa.me/84866566819`) thay Zalo, số `+84 86 656 6819`, tiêu đề "Book a visit" bằng Libre Baskerville.
- Font **Josefin Sans** chỉ cho nút VI | EN (Ryan chỉ định, không nằm trong guideline typography).

## Chạy ads
- Form có trường ẩn `lang`, `page_url`, `utm_source/medium/campaign/content/term` (lưu `sessionStorage`, không mất khi cuộn / reload / đổi ngôn ngữ).
- `src/config/tracking.js`: dán Meta Pixel ID và Google tag ID. Sự kiện `Lead` (kèm `lang`) khi gửi form thành công; `Contact` (kèm `lang`, `method`) khi bấm Zalo / WhatsApp / Hotline.
- **`Lead` chỉ bắn khi form thật sự gửi được**, tức là `FORM_ENDPOINT` trong `src/config/form.js` đã có (Google Apps Script). Hiện để trống nên bản deploy chưa bắn Lead (tránh Lead giả). Nối form xong thì Lead tự chạy.

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
1. Form đặt lịch mới validate + hiện cảm ơn, **chưa gửi dữ liệu**. Bước tiếp: Google Apps Script -> Google Sheets, điền `FORM_ENDPOINT` trong `src/config/form.js` (payload đã gom sẵn trong `src/form.js`).
2. Link tạm: nút "Khám phá" The Lash Story (`#`), Google Maps (đang là link tìm kiếm).
3. Duyệt chữ tiếng Anh trong `I18N-REVIEW.md`; điền Pixel ID / Google tag ID khi chạy ads.
4. Giờ mở cửa thật để chỉnh khung giờ (`src/data/prices.js`, `TIME_SLOTS`).
5. Ảnh hero gốc rộng 1145px (hơi mềm khi phóng lên 1440px). Có bản lớn hơn thì chép đè `public/images/hero/`.
