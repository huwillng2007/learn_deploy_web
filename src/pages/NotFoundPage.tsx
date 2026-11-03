import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Music } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
        <Music className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy trang yêu cầu</h2>
      <p className="text-xs text-slate-500 mb-6">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Về Trang Chủ Thư Viện</span>
      </Link>
    </div>
  );
};
