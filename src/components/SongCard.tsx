import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Heart, Eye, Edit3, Trash2, Clock, Disc3, Tag } from 'lucide-react';
import { Song, useMusic } from '../App';
import { formatCurrency, truncateText } from '../utils';

interface SongCardProps {
  song: Song;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const {
    currentPlaying,
    isPlaying,
    togglePlay,
    toggleFavorite,
    openModal,
    openEditForm,
    deleteSong,
  } = useMusic();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCurrentActive = currentPlaying?.id === song.id;
  const isThisPlaying = isCurrentActive && isPlaying;

  // Format mm:ss từ durationMs
  const formatDuration = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSong(song.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
        isCurrentActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200/80 hover:border-emerald-200'
      }`}
    >
      {/* Artwork Header */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={song.artworkUrl}
          alt={`Bìa album ${song.trackName} của nghệ sĩ ${song.artistName}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
            <Tag className="w-3 h-3 text-emerald-600" />
            {song.genre}
          </span>

          {song.isCustom && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
              Cá nhân
            </span>
          )}
        </div>

        {/* Floating Play / Pause Action Button */}
        <button
          onClick={() => togglePlay(song)}
          className={`absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${
            isThisPlaying
              ? 'bg-emerald-600 scale-105 ring-4 ring-white/50'
              : 'bg-emerald-600/90 hover:bg-emerald-600 hover:scale-110'
          }`}
          aria-label={isThisPlaying ? `Tạm dừng nghe thử bài ${song.trackName}` : `Phát thử bài hát ${song.trackName}`}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Floating Favorite Button */}
        <button
          onClick={() => toggleFavorite(song.id)}
          className={`absolute bottom-3 left-3 p-2 rounded-full backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            song.isFavorite
              ? 'bg-rose-500/90 text-white shadow-md'
              : 'bg-black/40 text-white/90 hover:bg-black/60 hover:text-white'
          }`}
          aria-label={
            song.isFavorite
              ? `Bỏ thích bài hát ${song.trackName}`
              : `Thêm bài hát ${song.trackName} vào danh sách yêu thích`
          }
        >
          <Heart className={`w-4 h-4 ${song.isFavorite ? 'fill-current text-white' : ''}`} />
        </button>
      </div>

      {/* Song Details Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Track title & quick link */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg line-clamp-1 group-hover:text-emerald-700 transition-colors">
            <Link
              to={`/item/${song.id}`}
              className="focus:outline-none focus:underline"
              title={song.trackName}
            >
              {song.trackName}
            </Link>
          </h3>

          {/* Artist & Album */}
          <p className="text-xs sm:text-sm font-medium text-slate-600 line-clamp-1 mt-0.5">
            {song.artistName}
          </p>

          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 flex items-center gap-1">
            <Disc3 className="w-3 h-3 text-slate-400" />
            {song.albumName}
          </p>

          {/* Short description using truncateText utility */}
          <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
            {truncateText(song.description, 75)}
          </p>
        </div>

        {/* Metadata & Actions Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDuration(song.durationMs)}
            </span>
            <span className="font-bold text-emerald-700 text-sm">
              {formatCurrency(song.price)}
            </span>
          </div>

          {/* Action Button Bar */}
          <div className="flex items-center gap-1.5 justify-between">
            {/* Quick View Modal Trigger */}
            <button
              onClick={() => openModal(song)}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={`Xem nhanh modal chi tiết bài ${song.trackName}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Nhanh</span>
            </button>

            {/* Navigate to full detail page */}
            <Link
              to={`/item/${song.id}`}
              className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={`Xem trang chi tiết đầy đủ của bài ${song.trackName}`}
            >
              Chi Tiết
            </Link>

            {/* Edit Button (CRUD Update) */}
            <button
              onClick={() => openEditForm(song)}
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Chỉnh sửa bài hát"
              aria-label={`Chỉnh sửa bài hát ${song.trackName}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button (CRUD Delete) */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
              title="Xóa bài hát"
              aria-label={`Xóa bài hát ${song.trackName}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-150">
          <Trash2 className="w-10 h-10 text-rose-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-900 mb-1">Xác nhận xóa bài hát?</h4>
          <p className="text-xs text-slate-500 mb-4 px-2 line-clamp-2">
            Bạn có chắc muốn xóa "{song.trackName}" khỏi thư viện?
          </p>
          <div className="flex gap-2 w-full max-w-xs">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Xóa ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
