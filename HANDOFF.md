# Handoff - The Lash Story landing

Đọc `AGENTS.md` trước (`CLAUDE.md` chỉ trỏ tới đó). File này ghi trạng thái và các quyết định đã chốt với Ryan.

## Trạng thái
Đã chuyển từ bản Nail sang The Lash Story (Việc 1 và 2 xong, chờ Ryan duyệt bản chạy local).
- Bỏ Collection. Menu giá Lash đặt ở vị trí cũ, 3 bố cục: Lash Extension (tablist + khung ảnh 4:3, vệt Nacre khi đổi ảnh), Lash Lift (cặp ảnh lệch + danh sách), Brow Lift (dải ảnh + 2 cột). Code: `build/render.js` (khối HTML), `src/main.js` (phần Lash Extension), `src/styles/main.css` (`.lx`, `.ll`, `.bl`, `.plist`).
- Our Services: Lash (trang hiện tại) bên trái, Nail bên phải với nút Khám phá (URL tạm "#", sửa `NAIL_URL` trong `src/config/site.js`).
- Ảnh menu là **ảnh tạm** cắt từ `assets/brand/lash-bang-gia-1.jpg`, `lash-bang-gia-2.jpg` bằng `python scripts/crop-lash-images.py` (có chữ đè, ~390px). Ảnh Our Story / hero / Instagram / og-share vẫn là ảnh Nail. Xem `SHOTLIST.md`.
- Our Story hiện 1 mục thông tin (địa chỉ) và vẫn 4 ô ảnh. Our Services: logo Lash mờ (trang hiện tại), logo Nail đậm, dòng "Nail art trong cùng không gian" dưới logo Nail. Menu Lash Extension desktop: ảnh nhỏ 30%, hover thì ảnh trượt tới cạnh dòng và gạch chân dòng kéo dài tới ảnh (--ext tính trong place() ở src/main.js).

## Menu cuộn nhanh (nav)
- Desktop từ 1100px: link section + switch + CTA trong nav, 1 dòng. Dưới 1100px: nút hai gạch mở panel full màn hình (khóa cuộn, `inert` main / footer / sticky CTA, Esc / link / resize đóng).
- Code: `src/nav.js` (`initQuickNav`, gồm scroll-spy IntersectionObserver `aria-current="location"`), khối CSS "NAV: menu cuon nhanh" trong `src/styles/main.css`, markup trong `src/template.html` (`.nav__end`, `.nav__panel`), danh sách `NAV_ITEMS` ở `build/render.js`, nhãn ở `nav.items / label / open / close` trong i18n.
- Id section: `story`, `services`, `bang-gia` (cũ), `insta`, `dat-lich` (cũ, theo dõi nhưng không có link nào sáng). CTA tái dùng `book.title`.
- Lỗi có sẵn từ trước (so bằng git stash): `npm run check` 2 FAIL form (không ra mạng), `check:i18n` 4 FAIL còn chữ Nail ở mô tả Our Services. Chưa sửa.

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
5. Nối form (xem mục Chạy ads) và gắn tên miền riêng nếu có (`SITE_URL` trong `src/config/site.js`, đang là the-lash-story-landing.vercel.app).
6. Giờ mở cửa thật (`src/data/prices.js`, `TIME_SLOTS`), duyệt chữ EN trong `I18N-REVIEW.md`.

## Chuẩn bị Google Ads (phiên 13/11/2026)
- GTM `GTM-PWKFLDJX` (`GTM_ID` trong `src/config/tracking.js`): snippet chuẩn, in bởi `build/render.js` (gtmHead sau charset, gtmBody ngay sau `<body>`). Đã gỡ gtag trực tiếp. Không dùng đoạn "gtm.js async + gtag" thiếu `gtm.start` (GTM không khởi tạo đúng, đo thiếu/sai).
- dataLayer: `generate_lead` {lang} khi form gửi OK; `contact` {lang, method} khi bấm Zalo/WhatsApp/hotline (`src/tracking.js`). Meta Pixel giữ nguyên (ID trống).
- Form: ẩn `gclid`, `gbraid`, `wbraid`, lưu sessionStorage key `ns_clickids` (tách khỏi `ns_utm`), gửi trong payload (`captureClickIds` ở `src/form.js`).
- Apps Script: tab Lash 14 cột A-N ("Trạng thái" = N). `Code.gs` ghi thêm gclid, gbraid, wbraid vào O, P, Q chỉ khi brand = lash. Ryan cần: thêm tiêu đề O1:Q1, dán code, cập nhật ĐÚNG deployment có ID khớp URL /exec trong `FORM_ENDPOINT` (New version, không New deployment).
- SEO: `SITE_URL` = https://thelashstory.studio (`src/config/site.js`). Canonical, hreflang, og:url, og:image đã trỏ apex. JSON-LD BeautySalon (tên, địa chỉ, SĐT, sameAs, url, image, hasMap), CHƯA có openingHours/geo/rating vì chưa có dữ liệu thật.
- `vercel.json`: header cache (fonts 1 năm immutable; images, img 1 ngày + SWR). CHƯA có redirect vercel.app -> domain chính (chờ Ryan xác nhận domain đã gắn).
- Preload ảnh hero mobile/desktop theo media, fetchpriority high.
- Còn chờ Ryan: GA4 Measurement ID (cấu hình trong GTM, không vào code), Ads chung hay riêng với Nail, giờ mở cửa/toạ độ, domain đã gắn Vercel chưa, www redirect, URL nút Nail (`NAIL_URL` đang "#").

### Cập nhật 13/11/2026 (đã deploy main)
- Domain thelashstory.studio đã gắn Vercel. `vercel.json` có redirect 301 từ the-lash-story-landing.vercel.app. Ryan xác nhận www đã redirect về apex.
- JSON-LD có `geo` (21.0421203, 105.8435925, từ link Maps của Ryan). Chưa khai openingHours (Ryan chưa cần).
- `NAIL_URL` = https://thenailstory.studio/ (nút Khám phá ở Our Services).
- `Code.gs` ghi gclid, gbraid, wbraid vào O, P, Q cho CẢ Nail và Lash (bản live trước đó chỉ ghi cho Nail; không được đổi thành chỉ Lash). Tab Lash đã có tiêu đề O1:Q1.
- GA4 Lash: G-4DZ28MX4VL, cấu hình trong GTM (tag đã nổ trong Preview). Ryan chưa Publish GTM, chưa link GA4 - Ads, chưa tạo conversion trong Ads.
- Đang debug: Sheet chưa nhận gclid (dòng test có page_url chứa gclid nhưng O trống => deployment Apps Script chưa chạy code mới; kiểm tra bằng doGet trả "v2-gclid").
- Chung tài khoản Ads với Nail: đặt tên conversion "Lash Story - ...", goal cấp campaign chỉ gồm conversion Lash.
