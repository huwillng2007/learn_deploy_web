import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, PlusCircle, Search, Sparkles, RefreshCw } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const Header: React.FC = () => {
  const { openCreateForm, searchFromItunes, resetToDefault, songs } = useMusic();
  const [isItunesModalOpen, setIsItunesModalOpen] = useState(false);
  const [itunesQuery, setItunesQuery] = useState('');
  const [isLoadingItunes, setIsLoadingItunes] = useState(false);

  const handleItunesSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itunesQuery.trim()) return;
    setIsLoadingItunes(true);
    await searchFromItunes(itunesQuery);
    setIsLoadingItunes(false);
    setIsItunesModalOpen(false);
    setItunesQuery('');
  };

  const favoriteCount = songs.filter((s) => s.isFavorite).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
              aria-label="Về trang chủ Emerald Music"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Emerald<span className="text-emerald-600">Music</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    LAB 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  SV: Hồ Ngọc Hưng &bull; MSSV: 6651071097
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Stats & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stats Badge */}
            <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
              <span>
                Tổng số:{' '}
                <strong className="text-emerald-700 font-semibold">{songs.length}</strong> bài
              </span>
              <span className="text-slate-300">&bull;</span>
              <span>
                Yêu thích:{' '}
                <strong className="text-rose-600 font-semibold">{favoriteCount}</strong>
              </span>
            </div>

            {/* Sync from iTunes API */}
            <button
              onClick={() => setIsItunesModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Tìm kiếm và nhập bài hát từ Apple iTunes API"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">API iTunes</span>
            </button>

            {/* Reset to default */}
            <button
              onClick={resetToDefault}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Khôi phục danh sách mặc định"
              aria-label="Khôi phục danh sách mặc định ban đầu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Add New Song Button (CRUD Create) */}
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label="Thêm bài hát mới vào playlist"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm Bài Hát</span>
            </button>
          </div>
        </div>

        {/* Mobile student info badge */}
        <div className="sm:hidden pb-2 text-[11px] text-slate-500 flex justify-between items-center border-t border-slate-100 pt-1.5">
          <span>SV: Hồ Ngọc Hưng (6651071097)</span>
          <span className="text-emerald-700 font-semibold">{songs.length} bài hát</span>
        </div>
      </div>

      {/* Modal Quick Import from iTunes API */}
      {isItunesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="itunes-modal-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 id="itunes-modal-title" className="text-base font-bold text-slate-900">
                  Nhập nhạc từ Apple iTunes API
                </h3>
                <p className="text-xs text-slate-500">
                  Nguồn dữ liệu Bảng 1: iTunes Search API miễn phí
                </p>
              </div>
            </div>

            <form onSubmit={handleItunesSearch} className="space-y-4">
              <div>
                <label htmlFor="itunes-query" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tên bài hát, nghệ sĩ hoặc thể loại
                </label>
                <div className="relative">
                  <input
                    id="itunes-query"
                    type="text"
                    value={itunesQuery}
                    onChange={(e) => setItunesQuery(e.target.value)}
                    placeholder="Ví dụ: Taylor Swift, Sơn Tùng, Adele, K-Pop..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsItunesModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isLoadingItunes || !itunesQuery.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
                >
                  {isLoadingItunes ? 'Đang tìm kiếm...' : 'Tìm & Nhập vào Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
