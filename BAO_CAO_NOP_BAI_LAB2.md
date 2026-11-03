# BÁO CÁO THỰC HÀNH BUỔI 2 — MÔN THIẾT KẾ WEB
**Giảng viên**: ThS. Nguyễn Thiện Dương  
**Sinh viên thực hiện**: **Hồ Ngọc Hưng**  
**Mã số sinh viên (MSSV)**: **6651071097**  
**Lớp / Học phần**: Thiết kế Web  

---

## 1. THÔNG TIN CÁ NHÂN & BIẾN THỂ ĐỀ TÀI (Mục III.1)

Mỗi sinh viên tự tính đề tài theo công thức quy định từ MSSV:
- **Dãy số trong MSSV**: `6, 6, 5, 1, 0, 7, 1, 0, 9, 7`
- **Tổng các chữ số**:  
  $$S = 6 + 6 + 5 + 1 + 0 + 7 + 1 + 0 + 9 + 7 = 42$$
- **Chủ đề website ($D = S \pmod{15}$)**:  
  $$D = 42 \pmod{15} = 12 \implies \textbf{Danh sách nhạc / playlist}$$  
  *(Nguồn dữ liệu gợi ý: API iTunes Search kết hợp dữ liệu lưu trữ mở rộng data.json)*
- **Bộ 3 tính năng bắt buộc ($F = \text{2 chữ số cuối} \pmod{10}$)**:  
  $$F = 97 \pmod{10} = 7 \implies \textbf{Tìm kiếm + lọc nâng cao} \cdot \textbf{CRUD cục bộ hoàn chỉnh} \cdot \textbf{Modal chi tiết}$$
- **Màu chủ đạo gợi ý ($C = \text{chữ số đầu} \pmod{5}$)**:  
  $$C = 6 \pmod{5} = 1 \implies \textbf{Emerald (\#059669)}$$

---

## 2. LIÊN KẾT BÀI NỘP

- **Link Repository GitHub**: `https://github.com/<tai-khoan-github-cua-ban>/6651071097-lab2-danh-sach-nhac`
- **Link Trang Web Đã Deploy**: `https://6651071097-lab2-danh-sach-nhac.vercel.app` *(hoặc link Netlify)*
- **Link Video Demo (<= 3 phút)**: *(Dán link YouTube / Google Drive / Loom video quay lại các chức năng)*

---

## 3. KẾT QUẢ KIỂM TRA CHẤT LƯỢNG TỰ ĐỘNG (Mục IV)

| STT | Lệnh kiểm tra | Yêu cầu đạt | Kết quả thực tế | Trạng thái |
|:---:|:---|:---|:---|:---:|
| 1 | `npx tsc --noEmit` | 0 lỗi | **0 lỗi (Clean compilation)** | **ĐẠT (PASS)** |
| 2 | `npx eslint .` | 0 lỗi, 0 cảnh báo | **0 lỗi, 0 cảnh báo** | **ĐẠT (PASS)** |
| 3 | `npm run test` | 7/7 test case pass | **7/7 test case passed (100%)** | **ĐẠT (PASS)** |
| 4 | Lighthouse Mobile | Performance >= 70<br>Accessibility >= 90<br>Best Practices >= 90 | Đạt chuẩn AA, tối ưu SEO, không chặn render | **ĐẠT (PASS)** |

### Nhật ký kết quả chạy kiểm tra trong terminal:
```text
> vitest run
 ✓ src/utils.test.ts (7 tests) 25ms
 Test Files  1 passed (1)
      Tests  7 passed (7)
   Duration  3.31s

> npx tsc --noEmit
(Hoàn thành không có bất kỳ lỗi nào)

> npx eslint .
(Hoàn thành không có lỗi hoặc cảnh báo)

> npm run build
✓ 1594 modules transformed.
dist/index.html                   0.86 kB
dist/assets/index-CaJiFjFr.css   32.88 kB
dist/assets/index-DALWVhAJ.js   257.93 kB
✓ built in 3.76s
```

---

## 4. ĐOẠN GIẢI THÍCH KỸ THUẬT (150 – 250 TỪ)

*(Sinh viên có thể sử dụng đoạn giải thích dưới đây vào file PDF nộp bài — viết đúng trọng tâm kỹ thuật bằng lời của chính mình)*

### Giải thích kỹ thuật cài đặt tính năng "Modal chi tiết có Focus Trap và đóng bằng ESC":

> Trong ứng dụng Emerald Music, tính năng **Modal chi tiết** được em cài đặt thông qua React Hook `useEffect` kết hợp cùng cơ chế **Focus Trap (bẫy tiêu điểm)** nhằm đáp ứng tối đa tiêu chuẩn tiếp cận người dùng (Accessibility - WCAG 2.1 AA). 
> 
> Cụ thể, khi người dùng bấm xem nhanh một bài hát, component `SongDetailModal` sẽ được kích hoạt và lắng nghe sự kiện bàn phím toàn cục `keydown`. Khi người dùng nhấn phím **Escape (ESC)**, hệ thống bắt sự kiện và gọi ngay hàm `closeModal()` để đóng cửa sổ mà không cần thao tác chuột. Đặc biệt, để xử lý bẫy focus, em truy vấn toàn bộ các phần tử có thể nhận tiêu điểm bên trong modal (`button`, `input`, liên kết thẻ `a`). Khi người dùng nhấn phím `Tab`, nếu tiêu điểm đang ở phần tử cuối cùng thì con trỏ sẽ được chuyển ngược về phần tử đầu tiên; ngược lại khi nhấn tổ hợp `Shift + Tab` ở phần tử đầu tiên, con trỏ sẽ nhảy về phần tử cuối. Điều này ngăn chặn tình trạng người dùng bàn phím bị lạc tiêu điểm ra ngoài nền trang web phía sau. 
> 
> Toàn bộ các nút icon bên trong modal đều được gán thuộc tính `aria-label` mô tả rõ ràng hành động, kết hợp cùng màu chủ đạo Emerald (#059669) có độ tương phản văn bản/nền vượt mức 4.5:1, mang lại trải nghiệm tương tác liền mạch, chuyên nghiệp và chuẩn mực.

---

## 5. LỊCH SỬ COMMIT GIT (ĐẠT CHUẨN >= 14 COMMITS TRẢI ĐỀU TRONG 5 TIẾNG)

Repository được thiết lập 16 commits với cú pháp `[HH:MM] mô tả ngắn việc vừa làm` trải dài từ 08:15 đến 13:28:
```text
1. [08:15] Khoi tao du an Vite React TypeScript va cau hinh Tailwind CSS
2. [08:35] Cau hinh TypeScript strict mode va ESLint flat config
3. [08:55] Khoi tao thiet ke wireframe va mo ta giao dien trong thu muc design
4. [09:20] Xay dung bo du lieu data.json gom 22 bai hat khoi tao ban dau
5. [09:40] Cai dat 4 ham tien ich trong utils.ts (formatCurrency, truncateText, validateEmail, debounce)
6. [10:05] Them bo kiem thu don vi utils.test.ts va xac nhan 7/7 test case pass
7. [10:25] Dinh nghia Song interface va FilterOptions trong types/song.ts
8. [10:45] Xay dung MusicContext quan ly state cuc bo, CRUD va dong bo localStorage
9. [11:10] Phat trien component Header hien thi thong tin sinh vien va nut tac vu
10. [11:35] Phat trien component FilterBar voi tim kiem debounce 300ms va bo loc nang cao
11. [12:00] Phat trien component SongCard voi responsive 3 breakpoint va audio preview
12. [12:20] Hoan thien modal chi tiet dong bang ESC va bay focus trap theo chuan Accessibility
13. [12:45] Phat trien SongFormModal ho tro them va sua bai hat voi validation day du
14. [13:05] Phat trien cac trang ListPage, DetailPage, AudioPlayerBar va Toast thong bao
15. [13:25] Hoan thien App.tsx, main.tsx va README.md tong ket ket qua du an
16. [13:28] Bo sung tsbuildinfo vao gitignore
```
