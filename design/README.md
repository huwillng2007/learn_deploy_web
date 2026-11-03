# Thiết Kế Giao Diện Wireframe & Hệ Thống Màu Sắc

## Thông Tin Sinh Viên & Biến Thể Đề Tài
- **Họ và tên**: Hồ Ngọc Hưng
- **Mã số sinh viên (MSSV)**: 6651071097
- **Chủ đề website (D = 12)**: Danh sách nhạc / Playlist
- **Bộ 3 tính năng bắt buộc (F = 7)**:
  1. Tìm kiếm + lọc nâng cao (debounce 300ms, lọc thể loại, thời lượng, nguồn dữ liệu)
  2. CRUD cục bộ hoàn chỉnh (Thêm, Xem, Sửa, Xóa bài hát qua localStorage)
  3. Modal chi tiết (Đóng bằng phím ESC, bẫy focus trap bên trong theo chuẩn Accessibility)
- **Màu sắc chủ đạo (C = 1)**: **Emerald (#059669)**

---

## 1. Hệ Thống Màu Sắc (Color Palette)
- **Primary / Brand**: Emerald `#059669` (Brand 600)
- **Primary Hover**: Emerald `#047857` (Brand 700)
- **Primary Light / Background Accent**: Emerald `#ecfdf5` (Brand 50)
- **Accent Rose (Favorite)**: `#e11d48` (Rose 600)
- **Neutral Dark (Heading / Body)**: `#0f172a` (Slate 900) / `#334155` (Slate 700)
- **Neutral Light (Background)**: `#f8fafc` (Slate 50)
- **Độ tương phản**: Đạt chuẩn WCAG 2.1 Level AA (tương phản văn bản trên nền đạt trên 4.5:1).

---

## 2. Các Điểm Ngắt Đáp Ứng (Responsive Breakpoints)
Theo đúng yêu cầu kỹ thuật mục III.4:
- **Mobile (< 640px)**: 1 cột (`grid-cols-1`). Giao diện thẻ tối ưu thao tác một tay trên điện thoại.
- **Tablet (640px – 1024px)**: 2 cột (`sm:grid-cols-2`). Cân đối giữa thông tin và hình ảnh album.
- **Desktop (> 1024px)**: 3 đến 4 cột (`lg:grid-cols-3 xl:grid-cols-4`). Hiển thị toàn bộ bảng điều khiển tìm kiếm nâng cao, thẻ nhạc phong phú và thanh điều khiển trình phát cố định bên dưới.

---

## 3. Ảnh Wireframe Bản Vẽ
File thiết kế đồ họa vector chi tiết được lưu trữ tại:
`design/wireframe_desktop_mobile.svg` (bao gồm cả giao diện Desktop và Mobile).
