# Emerald Music — Kho Nhạc & Quản Lý Playlist Cá Nhân

> **Bài Thực Hành Buổi 2 — Môn Thiết Kế Web**  
> **Giảng viên hướng dẫn**: ThS. Nguyễn Thiện Dương  
> **Sinh viên thực hiện**: **Hồ Ngọc Hưng**  
> **Mã số sinh viên (MSSV)**: **6651071097**  
> **Tên Repository GitHub**: `6651071097-lab2-danh-sach-nhac`  

---

## I. Xác Định Biến Thể Đề Tài Cá Nhân Hóa (Mục III.1)

Theo công thức cá nhân hóa theo MSSV `6651071097`:
1. **Dãy số MSSV**: `6, 6, 5, 1, 0, 7, 1, 0, 9, 7`
2. **Tổng các chữ số**:  
   $$S = 6 + 6 + 5 + 1 + 0 + 7 + 1 + 0 + 9 + 7 = 42$$
3. **Chủ đề website ($D = S \pmod{15}$)**:  
   $$D = 42 \pmod{15} = 12 \implies \textbf{Danh sách nhạc / playlist}$$  
   *Nguồn dữ liệu gợi ý*: API iTunes Search (miễn phí, không cần key) kết hợp dữ liệu lưu trữ mở rộng `data.json`.
4. **Bộ 3 tính năng bắt buộc ($F = \text{2 số cuối} \pmod{10}$)**:  
   $$F = 97 \pmod{10} = 7 \implies \textbf{Tìm kiếm + lọc nâng cao} \cdot \textbf{CRUD cục bộ hoàn chỉnh} \cdot \textbf{Modal chi tiết}$$
5. **Màu chủ đạo gợi ý ($C = \text{chữ số đầu} \pmod{5}$)**:  
   $$C = 6 \pmod{5} = 1 \implies \textbf{Emerald (\#059669)}$$

---

## II. Bộ Công Nghệ Bắt Buộc Sử Dụng

| Thành phần | Công nghệ bắt buộc | Trạng thái tuân thủ |
| :--- | :--- | :--- |
| **Ngôn ngữ** | TypeScript, bật `strict: true`, không dùng `any` | Đã bật strict, 0 lỗi tsc |
| **Build tool** | Vite 6 | Tối ưu build production nhanh |
| **UI library** | React 18 (Hooks, functional components) | 100% Hooks & Context API |
| **Styling** | Tailwind CSS (màu chủ đạo Emerald `#059669`) | Chuẩn responsive 3 breakpoint |
| **Routing** | React Router v6 (Route `/` danh sách & `/item/:id` chi tiết) | Điều hướng hoàn toàn bằng `<Link>` |
| **State cục bộ** | `useState` / `useContext` / `localStorage` | Không dùng thư viện ngoài |
| **Lint** | ESLint flat config + bổ sung rule cấm `any` | 0 lỗi, 0 cảnh báo |
| **Test** | Vitest + Testing Library | 7/7 test cases pass |
| **Triển khai** | Vercel / Netlify (kèm `_redirects` & `vercel.json`) | Đã sẵn sàng deploy |

---

## III. Các Tính Năng Đã Xây Dựng

### 1. Tìm kiếm + Lọc nâng cao (Debounce 300ms)
- Ô tìm kiếm từ khóa bài hát, nghệ sĩ, album, điệp khúc áp dụng hàm `debounce` tự viết trong `src/utils.ts` với độ trễ 300ms, giúp trải nghiệm mượt mà không giật lag.
- Lọc theo thể loại nhạc: Pop, Ballad, R&B/Soul, EDM, Rock, Hip-Hop, Acoustic, Indie...
- Lọc theo khoảng thời lượng: Ngắn (< 3 phút), Trung bình (3-4 phút), Dài (> 4 phút).
- Lọc theo nguồn dữ liệu: Toàn bộ, Bài hát do người dùng tự tạo (CRUD) hoặc Bài hát hệ thống / iTunes.
- Sắp xếp linh hoạt: Mới nhất, Cũ nhất, Tên A-Z, Tên Z-A, Thời lượng tăng/giảm, Đánh giá cao nhất.

### 2. CRUD Cục Bộ Hoàn Chỉnh (Lưu trữ localStorage)
- **Create (Thêm mới)**: Biểu mẫu thêm bài hát với validate chặt chẽ (tên, ca sĩ, thể loại, thời lượng, giá tiền, ảnh bìa, link preview nhạc).
- **Read (Xem)**: Hiển thị danh sách thẻ bài hát dạng lưới chuẩn responsive, hỗ trợ nghe thử audio preview 30s trực tiếp từ Apple iTunes.
- **Update (Chỉnh sửa)**: Chỉnh sửa thông tin bài hát bất kỳ lúc nào, dữ liệu được cập nhật tức thì trên giao diện và lưu trữ `localStorage`.
- **Delete (Xóa)**: Xóa bài hát với hộp thoại xác nhận an toàn, tránh xóa nhầm.

### 3. Modal Chi Tiết Đạt Chuẩn Accessibility
- Mở modal xem nhanh chi tiết bài hát với hiệu ứng phóng to mượt mà.
- **Bẫy focus (Focus Trap)**: Khóa tiêu điểm bàn phím bên trong modal, phím Tab và Shift+Tab tự động xoay vòng giữa các nút bấm, không bị lọt ra ngoài.
- **Đóng bằng ESC**: Bấm phím `Escape` bất cứ lúc nào để thoát modal nhanh chóng.
- Nút bấm đều có `aria-label`, độ tương phản màu sắc đạt chuẩn WCAG AA.
- Cung cấp nút điều hướng `<Link to="/item/:id">` để mở toàn màn hình trang chi tiết.

### 4. Tích Hợp API Apple iTunes Search
- Cho phép người dùng gõ từ khóa bất kỳ để tìm kiếm trực tiếp trên Apple iTunes Search API, lấy thông tin bài hát, ảnh bìa HD và link audio preview m4a/aac chất lượng cao rồi nạp trực tiếp vào thư viện.

---

## IV. Cấu Trúc Thư Mục Dự Án

```
6651071097_LAB2/
├── public/
│   ├── music-icon.svg         # Favicon nốt nhạc màu Emerald
│   └── _redirects             # Cấu hình routing SPA cho Netlify
├── src/
│   ├── assets/                # Hình ảnh và CSS chung
│   ├── components/            # Header, FilterBar, SongCard, SongDetailModal, SongFormModal, AudioPlayerBar...
│   ├── context/               # MusicContext (quản lý state cục bộ và localStorage)
│   ├── data/                  # data.json (22 bài hát khởi tạo ban đầu)
│   ├── pages/                 # ListPage.tsx (/), DetailPage.tsx (/item/:id), NotFoundPage.tsx
│   ├── types/                 # song.ts (TypeScript interface cho Song, FilterOptions)
│   ├── utils.ts               # 4 hàm bắt buộc (formatCurrency, truncateText, validateEmail, debounce)
│   ├── utils.test.ts          # Bộ kiểm thử 7/7 test cases chạy bằng Vitest
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css              # Tailwind CSS styles
├── design/
│   ├── wireframe_desktop_mobile.svg # Bản vẽ wireframe vector
│   └── README.md              # Thuyết minh thiết kế wireframe
├── eslint.config.js
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── vitest.config.ts
├── vercel.json
└── package.json
```

---

## V. Hướng Dẫn Cài Đặt & Chạy Dự Án

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev

# 3. Chạy kiểm thử tự động (Vitest - 7/7 pass)
npm run test

# 4. Kiểm tra kiểu dữ liệu TypeScript (0 lỗi)
npx tsc --noEmit

# 5. Kiểm tra mã nguồn bằng ESLint (0 lỗi, 0 cảnh báo)
npx eslint .

# 6. Đóng gói cho môi trường production
npm run build
```
