import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Play,
  Pause,
  Heart,
  Clock,
  Calendar,
  Star,
  Disc3,
  ExternalLink,
  Edit3,
  Volume2,
  Tag,
} from 'lucide-react';
import { useMusic } from '../App';
import { formatCurrency } from '../utils';

export const SongDetailModal: React.FC = () => {
  const {
    selectedSongForModal,
    closeModal,
    currentPlaying,
    isPlaying,
    togglePlay,
    toggleFavorite,
    openEditForm,
  } = useMusic();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const song = selectedSongForModal;
  const isThisPlaying = currentPlaying?.id === song?.id && isPlaying;

  // Xử lý đóng bằng phím ESC và Bẫy Focus (Focus Trap) theo đúng yêu cầu Accessibility đề bài
  useEffect(() => {
    if (!song) return;

    // Tự động focus vào nút đóng khi mở modal
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Phím ESC để đóng modal
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      // 2. Bẫy focus (Focus Trap) bên trong modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: lùi từ đầu về cuối
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: tiến từ cuối lên đầu
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [song, closeModal]);

  if (!song) return null;

  const formatDuration = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-song-title"
      aria-describedby="modal-song-desc"
      onClick={closeModal}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col focus:outline-none"
      >
        {/* Modal Header Bar with Close Button */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
              Chi Tiết Bài Hát
            </span>
            {song.isCustom && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200/90 px-2 py-0.5 rounded-full border border-slate-300">
                Tự tạo
              </span>
            )}
          </div>
          <button
            ref={closeButtonRef}
            onClick={closeModal}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Đóng modal chi tiết bài hát (hoặc bấm ESC)"
            title="Đóng (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Album Artwork */}
            <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-md flex-shrink-0">
              <img
                src={song.artworkUrl}
                alt={`Bìa album ${song.trackName} của nghệ sĩ ${song.artistName}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => togglePlay(song)}
                className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center text-white group focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label={
                  isThisPlaying
                    ? `Tạm dừng nghe thử bài ${song.trackName}`
                    : `Nghe thử bài hát ${song.trackName}`
                }
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 flex items-center justify-center shadow-lg transition-transform">
                  {isThisPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  )}
                </div>
              </button>
            </div>

            {/* Song Meta Information */}
            <div className="flex-1 space-y-2">
              <h2 id="modal-song-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {song.trackName}
              </h2>
              <p className="text-base font-semibold text-emerald-800">
                {song.artistName}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <Disc3 className="w-3.5 h-3.5 text-slate-400" />
                Album: <span className="font-medium text-slate-700">{song.albumName}</span>
              </p>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-medium">Thể loại</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Tag className="w-3 h-3 text-emerald-700" />
                    {song.genre}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-medium">Thời lượng</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-700" />
                    {formatDuration(song.durationMs)}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-medium">Phát hành</span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-emerald-700" />
                    {song.releaseDate}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-medium">Giá bán niêm yết</span>
                  <span className="text-xs font-bold text-emerald-800 block mt-0.5">
                    {formatCurrency(song.price)}
                  </span>
                </div>
              </div>

              {/* Rating & Playcount */}
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{song.rating.toFixed(1)} / 5.0</span>
                </div>
                <span>&bull;</span>
                <span>
                  Lượt nghe: <strong className="text-slate-800">{song.playCount.toLocaleString('vi-VN')}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-700" />
              Giới thiệu tác phẩm
            </h3>
            <p id="modal-song-desc" className="text-sm text-slate-800 leading-relaxed font-normal">
              {song.description}
            </p>
          </div>

          {/* Lyrics snippet */}
          {song.lyrics && (
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Đoạn điệp khúc nổi bật
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 italic border-l-2 border-emerald-500 pl-3 leading-relaxed">
                "{song.lyrics}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(song.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                song.isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              aria-label={song.isFavorite ? 'Bỏ thích bài hát' : 'Yêu thích bài hát này'}
            >
              <Heart className={`w-4 h-4 ${song.isFavorite ? 'fill-current text-rose-600' : ''}`} />
              <span>{song.isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
            </button>

            <button
              onClick={() => {
                closeModal();
                openEditForm(song);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Chỉnh sửa thông tin bài hát"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          </div>

          {/* Link to Detail Page */}
          <Link
            to={`/item/${song.id}`}
            onClick={closeModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={`Mở trang chi tiết đầy đủ cho bài hát ${song.trackName}`}
          >
            <span>Mở trang chi tiết đầy đủ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
