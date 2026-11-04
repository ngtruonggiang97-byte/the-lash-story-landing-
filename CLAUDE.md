# The Nail Story - Landing page

Bạn có thể đọc file này ở đầu mỗi phiên làm việc. Nó chứa các quy tắc cố định của dự án.

## Dự án
- Landing page 1 trang cho **The Nail Story** (studio nail, 43 Quán Thánh, Ba Đình, Hà Nội). The Lash Story làm sau, trang riêng.
- Mục tiêu duy nhất: khách **điền form đặt lịch**. Mọi section và hiệu ứng đều phải phục vụ mục tiêu này.
- Khách chủ yếu đến từ Instagram, nên **mobile first** (thiết kế cho 390px trước, desktop sau).
- Người làm việc với bạn: Ryan, phụ trách marketing. Trả lời bằng tiếng Việt, ngắn gọn, thẳng thắn. Không dùng dấu gạch dài "—", chỉ dùng "-".

## Nguồn sự thật (đọc trước khi thiết kế)
- `assets/brand/brand-guideline.pdf` - **đọc toàn bộ**, đây là căn cứ chính cho màu, typo, chất liệu, tone.
- `assets/brand/typography.png` - trang typography của guideline.
- `assets/brand/bang-gia.png` - bảng giá chính thức (áp dụng từ 20/05/2026).
- `assets/brand/collection-*.png` - 12 mẫu collection kèm giá. Ảnh đã cắt sẵn ở `assets/collection/`.
- `assets/ref/` - ref Venetian Nail Spa (venetianspa.ca): ảnh chụp + video quay màn hình. Xem video bằng cách trích frame (ffmpeg) để hiểu motion.

## Thông tin cố định
- Địa chỉ đúng: **43 Quán Thánh, Ba Đình, Hà Nội** (guideline ghi 84 là sai).
- Hotline / Zalo: 0866 566 819. Link Zalo: https://zalo.me/0866566819
- Tagline: "Every set tells a story". Key message: "Nail Art at an Aesthetic Corner in Hanoi".
- Thành lập 12/2018.

## Brand
- Tính cách: **Artistry, Refined** (chính), Feminine (phụ). Phong cách: cao cấp - tối giản - nghệ thuật, understated luxury.
- Màu: #faf9f4, #cdc4b9, #5f5846, #cfbaa1 (xem lại guideline để biết vai trò từng màu).
- Chất liệu gợi ý: xà cừ, ngọc trai, lụa. Biểu tượng: cánh bướm (lấy từ logo, không tự vẽ lại).

## Typography (theo guideline trang 03 - bắt buộc)
- Font chính (tiêu đề, nhận diện): **Libre Baskerville**, **Caslon** (recommend).
- Font logo: **Kenao Sans Serif** (recommend, dùng để đồng nhất với logo).
- KHÔNG dùng Le Jour Serif (guideline đã loại vì khó đọc khi nhỏ).
- Font phụ (nội dung, chú thích): **Aptima** hoặc **TT Norm**.
- Kenao, Aptima, TT Norm không có trên Google Fonts: dùng file trong `assets/fonts/`. Nếu thư mục trống, **dừng lại và báo Ryan**, không tự thay font khác.
- Nội dung tiếng Việt: kiểm tra từng font có đủ dấu tiếng Việt chưa (ạ, ế, ữ, ơ...). Font nào thiếu thì báo Ryan và đề xuất phương án, **không âm thầm thay font**.

## Copy
- Giọng: nhẹ nhàng, súc tích, gợi hình. Ít chữ, để ảnh nói.
- Tránh: "siêu đẹp", "hot trend", "sang chảnh", và các câu sáo kiểu "chốn dừng chân cho những cô nàng có gu" (Ryan đã chê là cringe). Không viết câu kiểu quảng cáo. Không tâng bốc khách.
- Có thể dùng tiêu đề tiếng Anh ngắn, phần giải thích viết tiếng Việt tự nhiên, không mang giọng dịch.
- Không bịa số liệu (số review, điểm Google, số khách).

## Thiết kế
- Dùng skill `design-taste-frontend` (trong `.claude/skills/`) cho mọi quyết định thiết kế. Viết dòng "Design Read" trước khi code, và chạy pre-flight check của skill trước khi báo xong.
- Concept đã chốt: **Nacre** - ánh xà cừ/ngọc trai. Đây là hiệu ứng ký tên, chỉ xuất hiện ở 1-2 khoảnh khắc, không phủ cả trang.
- Không chọn hiệu ứng nặng: trang phải mượt trên iPhone tầm trung. Tôn trọng `prefers-reduced-motion`.
- Tránh look "AI": card bo tròn giống nhau xếp lưới, mọi thứ căn giữa, eyebrow label in hoa trên mọi section, nền kem + serif mặc định, emoji.

## Kỹ thuật
- HTML/CSS/JS thuần, dùng Vite để chạy local và build. Cho phép GSAP và một thư viện carousel nhẹ nếu thật sự cần.
- Ảnh: tối ưu WebP, lazy-load, có `width`/`height`.
- Form: giai đoạn đầu chỉ validate và hiện thông báo. Sau đó nối Google Sheets qua Google Apps Script.
- Sau mỗi thay đổi lớn: chụp screenshot bằng Playwright ở 390px và 1440px, tự xem lại rồi mới báo Ryan.
- Commit git sau mỗi phiên bản được duyệt.
