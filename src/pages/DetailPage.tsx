import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Clock,
  Calendar,
  Star,
  Disc3,
  Edit3,
  Trash2,
  Tag,
  Share2,
  Volume2,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { formatCurrency } from '../utils';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    songs,
    currentPlaying,
    isPlaying,
    togglePlay,
    toggleFavorite,
    openEditForm,
    deleteSong,
    showToast,
  } = useMusic();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const song = songs.find((s) => s.id === id);

  if (!song) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy bài hát</h2>
        <p className="text-sm text-slate-500 mb-6">
          Bài hát với ID "{id}" không tồn tại hoặc đã bị xóa khỏi thư viện.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Thư Viện</span>
        </Link>
      </div>
    );
  }

  const isThisPlaying = currentPlaying?.id === song.id && isPlaying;

  const formatDuration = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài hát vào clipboard!');
    }
  };

  const handleDeleteConfirm = () => {
    deleteSong(song.id);
    navigate('/');
  };

  // Các bài hát cùng thể loại gợi ý
  const relatedSongs = songs.filter((s) => s.genre === song.genre && s.id !== song.id).slice(0, 4);

  return (
    <div className="py-6 sm:py-10">
      {/* Back Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Quay lại danh sách bài hát"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Thư Viện Nhạc</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Chia sẻ liên kết bài hát"
            aria-label="Chia sẻ liên kết bài hát"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditForm(song)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Chỉnh sửa thông tin bài hát"
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Chỉnh sửa</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Xóa bài hát khỏi thư viện"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Xóa bài</span>
          </button>
        </div>
      </div>

      {/* Main Track Presentation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/80 mb-10 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          {/* Large Artwork */}
          <div className="relative w-full md:w-80 lg:w-96 aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-xl flex-shrink-0 group">
            <img
              src={song.artworkUrl}
              alt={`Ảnh bìa bài hát ${song.trackName} của nghệ sĩ ${song.artistName}`}
              className="w-full h-full object-cover"
            />
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button
                onClick={() => togglePlay(song)}
                className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400"
                aria-label={
                  isThisPlaying
                    ? `Tạm dừng phát bài hát ${song.trackName}`
                    : `Bắt đầu nghe thử bài hát ${song.trackName}`
                }
              >
                {isThisPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current translate-x-1" />
                )}
              </button>
            </div>
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(song.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label={song.isFavorite ? 'Bỏ thích bài hát' : 'Yêu thích bài hát này'}
            >
              <Heart className={`w-5 h-5 ${song.isFavorite ? 'fill-current text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Detailed Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                {song.genre}
              </span>
              {song.isCustom && (
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-200/90 px-3 py-1 rounded-full border border-slate-300">
                  Bài hát tự thêm (CRUD)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {song.trackName}
            </h1>

            <p className="text-lg sm:text-xl font-bold text-emerald-800">
              {song.artistName}
            </p>

            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-slate-400" />
              <span>
                Album: <strong className="text-slate-700 font-semibold">{song.albumName}</strong>
              </span>
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 my-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-700 font-medium block">Thời lượng</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  {formatDuration(song.durationMs)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-700 font-medium block">Ngày phát hành</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  {song.releaseDate}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-700 font-medium block">Đánh giá</span>
                <span className="text-sm font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-current" />
                  {song.rating.toFixed(1)} / 5.0
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-700 font-medium block">Giá bán</span>
                <span className="text-sm font-bold text-emerald-800 block mt-0.5">
                  {formatCurrency(song.price)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-700" />
                Câu chuyện và cảm xúc âm nhạc
              </h2>
              <p className="text-sm text-slate-800 leading-relaxed font-normal">
                {song.description}
              </p>
            </div>

            {/* Lyrics block */}
            {song.lyrics && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Lời bài hát (Lyrics trích đoạn)
                </h2>
                <p className="text-sm text-slate-700 italic border-l-3 border-emerald-500 pl-3 leading-relaxed whitespace-pre-line">
                  {song.lyrics}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related tracks section */}
      {relatedSongs.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-12">
          <h2 id="related-heading" className="text-xl font-bold text-slate-900 mb-6">
            Gợi ý cùng thể loại <span className="text-emerald-700">{song.genre}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {relatedSongs.map((rel) => (
              <Link
                key={rel.id}
                to={`/item/${rel.id}`}
                className="group bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all flex items-center gap-3"
              >
                <img
                  src={rel.artworkUrl}
                  alt={`Bìa bài ${rel.trackName}`}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">
                    {rel.trackName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{rel.artistName}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    {formatCurrency(rel.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <Trash2 className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-2">Xác nhận xóa bài hát?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Bạn có chắc chắn muốn xóa bài hát "{song.trackName}"? Thao tác này sẽ cập nhật trên
              localStorage.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
