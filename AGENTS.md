# The Lash Story - Landing page

Đọc file này ở đầu mỗi phiên làm việc. Nó chứa các quy tắc cố định của dự án. (`CLAUDE.md` chỉ trỏ tới file này.)

## Dự án
- Landing page 1 trang cho **The Lash Story** (mi và lông mày, cùng studio với The Nail Story, 43 Quán Thánh, Ba Đình, Hà Nội). Dự án này là bản clone từ landing The Nail Story, đang được chuyển sang Lash. The Nail Story có landing riêng.
- Mục tiêu duy nhất: khách **điền form đặt lịch**. Mọi section và hiệu ứng đều phải phục vụ mục tiêu này.
- Khách chủ yếu đến từ Instagram, nên **mobile first** (thiết kế cho 390px trước, desktop sau).
- Người làm việc với bạn: Ryan, phụ trách marketing. Trả lời bằng tiếng Việt, ngắn gọn, thẳng thắn. Không dùng dấu gạch dài "—", chỉ dùng "-".

## Nguồn sự thật
- `assets/brand/brand-guideline.pdf` - guideline chung của studio: màu, typo, chất liệu, tone.
- `assets/brand/typography.png` - trang typography của guideline.
- `assets/brand/lash-bang-gia-1.jpg` (Lash Extension) và `lash-bang-gia-2.jpg` (Lash Lift, Brow Lift) - bảng giá chính thức, áp dụng từ 20/05/2026. Thiếu file thì dừng và báo Ryan, không tự thay ảnh khác.
- `assets/ref/` - ref Venetian Nail Spa (venetianspa.ca). Chỉ xem khi Ryan yêu cầu.

## Thông tin cố định
- Địa chỉ đúng: **43 Quán Thánh, Ba Đình, Hà Nội** (guideline ghi 84 là sai).
- Hotline / Zalo: 0866 566 819. Link Zalo: https://zalo.me/0866566819. Bản EN dùng WhatsApp `wa.me/84866566819`.
- Tagline: "Every set tells a story". Thành lập 12/2018.
- Dịch vụ: Lash Extension (Natural / Signature / Glam), Lash Lift, Brow Lift. Menu giá chỉ lấy từ 2 bảng giá ở trên, không bịa thêm.
- Link sang landing The Nail Story: URL tạm "#", Ryan điền sau.

## Brand
- Tính cách: **Artistry, Refined** (chính), Feminine (phụ). Phong cách: cao cấp - tối giản - nghệ thuật, understated luxury.
- Màu: #faf9f4, #cdc4b9, #5f5846, #cfbaa1 (xem guideline để biết vai trò từng màu).
- Chất liệu gợi ý: xà cừ, ngọc trai, lụa. Biểu tượng: cánh bướm (lấy từ logo, không tự vẽ lại).
- Logo dùng `public/img/logo/logo-tls-*.png` (Lash). Logo Nail chỉ xuất hiện ở mục Our Services.

## Typography (guideline trang 03)
- Tiêu đề tiếng Anh: **Libre Baskerville**, Libre Caslon. Hai font này **thiếu dấu tiếng Việt**, chỉ dùng cho chữ tiếng Anh.
- Tiêu đề tiếng Việt: **Cormorant Garamond** (Ryan đã duyệt).
- Nội dung: **Be Vietnam Pro** là font tạm, chờ Aptima / TT Norm (`assets/fonts/` vẫn trống). Không âm thầm đổi font.
- Nút VI | EN: Josefin Sans (Ryan chỉ định).
- KHÔNG dùng Le Jour Serif.
- Font mới nào thêm vào phải kiểm tra đủ dấu tiếng Việt (ạ, ế, ữ, ơ...). Thiếu thì báo Ryan và đề xuất phương án.

## Copy
- Giọng: nhẹ nhàng, súc tích, gợi hình. Ít chữ, để ảnh nói.
- Tránh: "siêu đẹp", "hot trend", "sang chảnh", và câu sáo kiểu "chốn dừng chân cho những cô nàng có gu". Không viết câu kiểu quảng cáo. Không tâng bốc khách. Không thêm tính từ quảng cáo.
- Có thể dùng tiêu đề tiếng Anh ngắn, phần giải thích viết tiếng Việt tự nhiên, không mang giọng dịch. Bản EN viết tự nhiên, không dịch từng chữ.
- Không bịa số liệu (số review, điểm Google, số khách).

## Thiết kế
- Dùng skill `design-taste-frontend` (trong `.claude/skills/`) cho mọi quyết định thiết kế. Viết dòng "Design Read" trước khi code, và chạy pre-flight check của skill trước khi báo xong.
- Hướng đã chốt: **B "Lookbook"**, góc vuông toàn trang (trừ icon social tròn ở footer).
- Concept **Nacre** (ánh xà cừ / ngọc trai) là hiệu ứng ký tên, chỉ xuất hiện 1-2 khoảnh khắc, không phủ cả trang. Ở trang Lash: hero và khung ảnh Lash Extension trong menu. Không thêm Nacre chỗ khác.
- Chuyển động dùng token trong `src/styles/base.css` (`--ease-soft`, `--dur-*`...). Trang phải mượt trên iPhone tầm trung. Tôn trọng `prefers-reduced-motion`.
- Tránh look "AI": card bo tròn giống nhau xếp lưới, mọi thứ căn giữa, eyebrow label in hoa trên mọi section, nền kem + serif mặc định, emoji.

## Kỹ thuật
- HTML/CSS/JS thuần, Vite để chạy local và build. Cho phép GSAP và thư viện carousel nhẹ nếu thật sự cần.
- Song ngữ 1 codebase: chữ ở `src/i18n/vi.js` và `en.js` (cùng bộ key, chạy `npm run i18n:check`), một template `src/template.html`, `build/render.js` dựng HTML tĩnh. "/" = Việt, "/en/" = Anh.
- Ảnh: WebP, lazy-load, có `width`/`height`.
- Form nối Google Sheets qua Google Apps Script (`apps-script/Code.gs`, URL ở `src/config/form.js`). Lash dùng Sheet / tab riêng: phải tạo tab và deployment mới, không dùng chung endpoint với Nail.
- Tracking: `src/config/tracking.js`, ID Pixel / Google tag để trống cho đến khi Ryan điền.
- Sau mỗi thay đổi lớn: chụp screenshot bằng Playwright ở 390px và 1440px, tự xem lại rồi mới báo Ryan.
- Commit git sau mỗi phiên bản được duyệt.

## Tiết kiệm token
- Sửa file bằng Edit tại chỗ, không viết lại cả file. Không dán code vào chat trừ khi Ryan hỏi.
- Kiểm tra bằng đo trong code (getBoundingClientRect, computed style, quét text node) thay vì chụp ảnh khi có thể.
- Khi cần chụp: chỉ khu vực vừa sửa, một viewport (390 hoặc 1440), thu nhỏ còn khoảng 800px rộng, tối đa 2 ảnh mỗi lần. Chụp cả trang chỉ ở bước cuối của một phiên bản.
- Tối đa 1 vòng tự kiểm tra rồi sửa. Còn lỗi thì báo Ryan, không lặp.
- Không đọc lại file đã đọc trong phiên nếu không có thay đổi. Dùng Grep để tìm đoạn cần sửa.
- Không mở node_modules, .git, assets/ref (video), brand-guideline.pdf trừ khi Ryan yêu cầu.
- Báo kết quả ngắn: danh sách những gì đã đổi, không kể lại từng bước.
- Cuối mỗi việc lớn: commit và cập nhật HANDOFF.md, rồi nhắc Ryan mở phiên mới.
