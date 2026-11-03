/**
 * Các hàm tiện ích bắt buộc theo yêu cầu đề bài
 * Sinh viên: Hồ Ngọc Hưng - MSSV: 6651071097
 */

export function formatCurrency(amount: number, currency: string = '₫'): string {
  const formatted = new Intl.NumberFormat('vi-VN').format(amount);
  return `${formatted} ${currency}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

export function validateEmail(email: string): boolean {
  // Kiểm tra email chuẩn RFC có chứa domain và TLD hợp lệ (ít nhất 2 ký tự sau dấu chấm)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounced = function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
  return debounced as unknown as T;
}
