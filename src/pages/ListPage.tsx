import React, { useState, useMemo } from 'react';
import { FilterBar } from '../components/FilterBar';
import { SongCard } from '../components/SongCard';
import { useMusic } from '../context/MusicContext';
import { FilterOptions } from '../types/song';
import { Sparkles, Music2, PlusCircle, HelpCircle } from 'lucide-react';

export const ListPage: React.FC = () => {
  const { songs, openCreateForm } = useMusic();

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    genre: 'all',
    durationRange: 'all',
    dataSource: 'all',
    sortBy: 'newest',
  });

  // Trích xuất danh sách tất cả các thể loại duy nhất
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    songs.forEach((s) => {
      if (s.genre) set.add(s.genre);
    });
    return Array.from(set).sort();
  }, [songs]);

  // Bộ lọc nâng cao & Sắp xếp theo yêu cầu tính năng F = 7
  const filteredSongs = useMemo(() => {
    return songs
      .filter((song) => {
        // 1. Tìm kiếm (theo tên bài hát, nghệ sĩ, album hoặc lời bài hát)
        if (filters.searchTerm.trim() !== '') {
          const q = filters.searchTerm.toLowerCase().trim();
          const matchTitle = song.trackName.toLowerCase().includes(q);
          const matchArtist = song.artistName.toLowerCase().includes(q);
          const matchAlbum = song.albumName.toLowerCase().includes(q);
          const matchLyrics = song.lyrics?.toLowerCase().includes(q);
          if (!matchTitle && !matchArtist && !matchAlbum && !matchLyrics) {
            return false;
          }
        }

        // 2. Lọc theo thể loại nhạc
        if (filters.genre !== 'all' && song.genre !== filters.genre) {
          return false;
        }

        // 3. Lọc theo khoảng thời lượng
        if (filters.durationRange === 'short' && song.durationMs >= 180000) {
          return false;
        }
        if (
          filters.durationRange === 'medium' &&
          (song.durationMs < 180000 || song.durationMs > 240000)
        ) {
          return false;
        }
        if (filters.durationRange === 'long' && song.durationMs <= 240000) {
          return false;
        }

        // 4. Lọc theo nguồn dữ liệu (CRUD cá nhân hay hệ thống)
        if (filters.dataSource === 'custom' && !song.isCustom) {
          return false;
        }
        if (filters.dataSource === 'system' && song.isCustom) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.trackName.localeCompare(b.trackName, 'vi');
          case 'name-desc':
            return b.trackName.localeCompare(a.trackName, 'vi');
          case 'duration-asc':
            return a.durationMs - b.durationMs;
          case 'duration-desc':
            return b.durationMs - a.durationMs;
          case 'rating-desc':
            return b.rating - a.rating;
          case 'oldest':
            return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          case 'newest':
          default:
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }
      });
  }, [songs, filters]);

  return (
    <div className="py-6 sm:py-8">
      {/* Hero Presentation Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 mb-8 shadow-xl">
        {/* Background Decorative Circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-12 w-48 h-48 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-500/40 text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Chủ Đề D=12: Danh Sách Nhạc/Playlist &bull; Màu C=1: Emerald (#059669)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Thư Viện Âm Nhạc &amp; Quản Lý Playlist
          </h1>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
            Ứng dụng hỗ trợ tìm kiếm và lọc nâng cao với debounce 300ms, quản lý CRUD bài hát cục bộ
            lưu trữ vào localStorage, tích hợp API iTunes và xem nhanh thông tin qua modal tương tác
            đóng bằng phím ESC.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200">
            <span className="font-semibold text-white">Sinh viên thực hiện:</span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-600/50">
              Hồ Ngọc Hưng
            </span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-600/50">
              MSSV: 6651071097
            </span>
            <span className="bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-600/50">
              Bộ tính năng F=7 (Tìm kiếm &amp; lọc nâng cao &bull; CRUD &bull; Modal)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Component */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        genres={availableGenres}
        totalResults={filteredSongs.length}
      />

      {/* Responsive Song Grid: đúng 3 breakpoint theo yêu cầu mục III.4:
          < 640px (mobile, 1 cột): grid-cols-1
          640–1024px (tablet, 2 cột): sm:grid-cols-2
          > 1024px (desktop, 3-4 cột): lg:grid-cols-3 xl:grid-cols-4
      */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Music2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Không tìm thấy bài hát phù hợp
          </h3>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại toàn bộ bộ lọc thể loại / thời lượng.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                setFilters({
                  searchTerm: '',
                  genre: 'all',
                  durationRange: 'all',
                  dataSource: 'all',
                  sortBy: 'newest',
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Xóa bộ lọc</span>
            </button>
            <button
              onClick={openCreateForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm bài hát mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
