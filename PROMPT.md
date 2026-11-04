# Prompt đầu tiên cho Claude Code

Dán nguyên phần dưới đây vào Claude Code (hoặc gõ: "Đọc PROMPT.md và làm theo").

---

Tôi cần thiết kế và code landing page cho The Nail Story. Đọc `CLAUDE.md` trước, sau đó đọc toàn bộ `assets/brand/brand-guideline.pdf` và xem hết các file trong `assets/`. Dùng skill `design-taste-frontend`.

## Bối cảnh
Tôi đã thử một bản trước và bỏ, vì 3 lý do:
- Không có gì ấn tượng, nhìn ra ngay là AI làm (lưới card đều nhau, mọi thứ căn giữa, label in hoa ở mọi section).
- Typography không theo guideline.
- Copy sáo, có chỗ cringe (ví dụ "Chốn dừng chân cho những cô nàng có gu").

Bản lần này phải có chất của một studio nail cao cấp, đủ thời trang và có một khoảnh khắc khiến khách nhớ đến.

## Ref
Tôi thích Venetian Nail Spa (venetianspa.ca, ảnh và video trong `assets/ref/`) ở sự nhẹ nhàng trong màu sắc và font chữ mà vẫn sang. Lấy tinh thần đó, áp brand guideline của The Nail Story lên, không copy layout.

## Concept: Nacre
Ánh xà cừ / ngọc trai là hiệu ứng ký tên. Chỉ dùng ở 1-2 khoảnh khắc đắt giá nhất (gợi ý: hero và collection). Phải mượt trên mobile.

## Cấu trúc trang (theo thứ tự)
1. **Hero = không gian studio.** Thể hiện bằng ảnh/video không gian. Tôi chưa chụp, nên dùng khung ảnh tạm có ghi rõ tỷ lệ và nội dung cần chụp. Bố cục hero quyết định vibe cho buổi chụp, nên nghĩ kỹ phần này.
2. **Dịch vụ:** chỉ để 2 logo, The Nail Story và The Lash Story, mỗi logo dẫn đến trang tương ứng (Lash: để link tạm). Không liệt kê dịch vụ. File logo nằm trong `assets/logos/`.
3. **Collection:** 12 mẫu trong `assets/collection/` (tên, giá, nền móng, extension lấy từ `assets/brand/collection-*.png`). Không dàn lưới dài. Làm dạng **vuốt được** (swipe trên mobile, kéo/cuộn trên desktop), có hiệu ứng đẹp mắt, đây là chỗ hợp với Nacre. Mỗi mẫu có cách chọn nhanh để đưa xuống form đặt lịch.
4. **Bảng giá:** đúng theo `assets/brand/bang-gia.png` (GEL, DESIGN, SPA, ghi chú "giá đã bao gồm...", ngày áp dụng).
5. **Form đặt lịch:** tên, SĐT/Zalo, dịch vụ, mẫu (không bắt buộc), ngày, khung giờ, ghi chú. Dưới form: icon Google 5 sao dẫn sang Google Maps của tiệm, và nút nhắn Zalo.
6. **Footer:** dải **Inspiration** lấy post từ Instagram (xem `assets/ref/venetian-glow-with-us.png`), địa chỉ, số điện thoại, link mạng xã hội.

## Cách làm
1. Đọc hết tài liệu. Tóm tắt cho tôi trong 10 dòng: những gì guideline quy định về màu, typo, chất liệu, tone. Liệt kê font nào thiếu file hoặc thiếu dấu tiếng Việt.
2. Viết dòng **Design Read**, rồi đề xuất **2 hướng thiết kế khác nhau rõ rệt**, mỗi hướng: ý tưởng một câu, hero trông thế nào, collection chuyển động ra sao, khoảnh khắc Nacre nằm ở đâu. Dựng hero + collection của cả 2 hướng ở dạng trang tĩnh để tôi xem (chụp screenshot mobile và desktop). **Dừng lại chờ tôi chọn.**
3. Khi tôi chọn xong, dựng cả trang. Chụp screenshot 390px và 1440px, chạy pre-flight check của skill, tự sửa những lỗi thấy được rồi mới báo tôi.
4. Viết copy theo quy tắc trong `CLAUDE.md`. Mỗi tiêu đề đưa tôi 2 lựa chọn để duyệt.
5. Cuối cùng liệt kê shot list cần chụp (ảnh nào, tỷ lệ, góc, ánh sáng) dựa trên layout đã chốt.
