# Handoff - The Lash Story landing

Đọc `AGENTS.md` trước (`CLAUDE.md` chỉ trỏ tới đó). File này ghi trạng thái và các quyết định đã chốt với Ryan.

## Trạng thái
Đã chuyển từ bản Nail sang The Lash Story (Việc 1 và 2 xong, chờ Ryan duyệt bản chạy local).
- Bỏ Collection. Menu giá Lash đặt ở vị trí cũ, 3 bố cục: Lash Extension (tablist + khung ảnh 4:3, vệt Nacre khi đổi ảnh), Lash Lift (cặp ảnh lệch + danh sách), Brow Lift (dải ảnh + 2 cột). Code: `build/render.js` (khối HTML), `src/main.js` (phần Lash Extension), `src/styles/main.css` (`.lx`, `.ll`, `.bl`, `.plist`).
- Our Services: Lash (trang hiện tại) bên trái, Nail bên phải với nút Khám phá (URL tạm "#", sửa `NAIL_URL` trong `src/config/site.js`).
- Ảnh menu là **ảnh tạm** cắt từ `assets/brand/lash-bang-gia-1.jpg`, `lash-bang-gia-2.jpg` bằng `python scripts/crop-lash-images.py` (có chữ đè, ~390px). Ảnh Our Story / hero / Instagram / og-share vẫn là ảnh Nail. Xem `SHOTLIST.md`.
- Our Story hiện 3 mục thông tin (Từ 12/2018, địa chỉ, Tư vấn và báo giá) và vẫn 4 ô ảnh.

## Chạy dự án
```bash
npm install
npx playwright install chromium   # chỉ cần nếu chụp screenshot / chạy kiểm tra
npm run dev                       # http://localhost:5173
npm run build                     # ra dist/index.html (vi) + dist/en/index.html (en)
node scripts/shots.mjs index en   # screenshot 390px + 1440px vào shots/
npm run check                     # kiểm tra cuộn, form bản Việt (cần dev server) - còn tham chiếu Collection, sửa ở Việc 2
npm run check:i18n                # kiểm tra song ngữ (cần dev server) - còn tham chiếu Nail / Collection, sửa ở Việc 2
npm run i18n:check                # vi.js và en.js phải cùng bộ key
npm run i18n:table                # tạo lại I18N-REVIEW.md
```

## Kiến trúc (kế thừa từ bản Nail, giữ nguyên)
- Song ngữ 1 codebase, 2 URL: "/" = Việt, "/en/" = Anh. Chữ ở `src/i18n/vi.js` và `en.js` (cùng key). Bố cục / CSS / ảnh dùng chung.
- Một template `src/template.html`. `build/render.js` điền chữ và dựng sẵn danh sách thành HTML tĩnh; `build/pages-plugin.js` xuất 2 trang.
- Dữ liệu dùng chung ở `src/data/` (giá, khung giờ, post Instagram). Chỉ tên dịch vụ / nhãn nằm trong i18n.
- Switch VI | EN là link `<a>` thật; JS chỉ thêm `?query` và `#hash` (giữ UTM). SEO: lang, title, description, OG, canonical, hreflang. Domain lấy từ `src/config/site.js`.
- Bản Anh dùng WhatsApp thay Zalo. Font Josefin Sans chỉ cho nút VI | EN.
- Motion: mọi thời lượng / easing là token trong `src/styles/base.css`. H2 lớn dùng chung token `--h2`.

## Chạy ads
- Form có trường ẩn `lang`, `page_url`, `utm_*` (lưu `sessionStorage`) và gửi kèm `brand: "lash"`.
- `src/config/tracking.js`: Pixel ID và Google tag ID **để trống**. `Lead` chỉ bắn khi `FORM_ENDPOINT` có giá trị và gửi thành công; `Contact` khi bấm Zalo / WhatsApp / Hotline.
- **Form chưa nối Sheet.** `FORM_ENDPOINT` (`src/config/form.js`) đang trống. `apps-script/Code.gs` ghi vào tab Lash (gid 357999824 của Sheet Ryan đưa) khi `brand = "lash"`, còn lại ghi tab "The nail story" như cũ. Cách nối: mở Sheet đó > Extensions > Apps Script > dán `Code.gs` > Deploy > Manage deployments > New version (nếu script Nail đã có) hoặc New deployment > Web app (Anyone). Dán URL `/exec` vào `FORM_ENDPOINT`. Tab Lash cần cùng cột với tab Nail (14 cột: giờ gửi, tên, SĐT, ngày, giờ, ghi chú, lang, page_url, 5 utm, trạng thái).

## Việc Ryan cần điền
1. URL landing The Nail Story (nút ở Our Services, tạm "#").
2. Tài khoản Instagram / Threads / Facebook / TikTok của Lash (placeholder), 6 post Instagram và ảnh thumb.
3. Google Maps chính thức (đang là link tìm kiếm), Pixel ID / Google tag ID.
4. Ảnh thật: hero, Our Story, ảnh từng kiểu mi (ảnh tạm cắt từ bảng giá, có chữ đè và độ phân giải thấp), og-share.
5. Apps Script / Sheet riêng cho Lash. Tên Vercel project và domain mới (hiện `src/config/site.js` vẫn trỏ vercel của Nail).
6. Giờ mở cửa thật (`src/data/prices.js`, `TIME_SLOTS`), duyệt chữ EN trong `I18N-REVIEW.md`.
