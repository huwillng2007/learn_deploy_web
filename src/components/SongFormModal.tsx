import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Music, AlertCircle } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Song } from '../types/song';

export const SongFormModal: React.FC = () => {
  const { isFormOpen, editingSong, closeForm, addSong, updateSong } = useMusic();

  const [formData, setFormData] = useState({
    trackName: '',
    artistName: '',
    albumName: '',
    genre: 'Pop',
    durationSeconds: 210,
    releaseDate: new Date().toISOString().substring(0, 10),
    artworkUrl: '',
    previewUrl: '',
    price: 25000,
    rating: 4.8,
    description: '',
    lyrics: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSong) {
      setFormData({
        trackName: editingSong.trackName,
        artistName: editingSong.artistName,
        albumName: editingSong.albumName,
        genre: editingSong.genre,
        durationSeconds: Math.round(editingSong.durationMs / 1000),
        releaseDate: editingSong.releaseDate,
        artworkUrl: editingSong.artworkUrl,
        previewUrl: editingSong.previewUrl,
        price: editingSong.price,
        rating: editingSong.rating,
        description: editingSong.description,
        lyrics: editingSong.lyrics,
      });
    } else {
      setFormData({
        trackName: '',
        artistName: '',
        albumName: '',
        genre: 'Pop',
        durationSeconds: 210,
        releaseDate: new Date().toISOString().substring(0, 10),
        artworkUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0d/17/57/0d17578b-3be2-675e-2495-2070f3f6c8d7/mzaf_10332308006248316208.plus.aac.p.m4a',
        price: 25000,
        rating: 4.8,
        description: '',
        lyrics: '',
      });
    }
    setErrors({});

    if (isFormOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [editingSong, isFormOpen]);

  // Đóng modal bằng ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormOpen) {
        closeForm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen, closeForm]);

  if (!isFormOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.trackName.trim()) {
      newErrors.trackName = 'Tên bài hát không được để trống';
    }
    if (!formData.artistName.trim()) {
      newErrors.artistName = 'Tên nghệ sĩ không được để trống';
    }
    if (formData.durationSeconds <= 0) {
      newErrors.durationSeconds = 'Thời lượng bài hát phải lớn hơn 0 giây';
    }
    if (formData.price < 0) {
      newErrors.price = 'Giá bán không được là số âm';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Omit<Song, 'id' | 'isFavorite' | 'isCustom'> = {
      trackName: formData.trackName.trim(),
      artistName: formData.artistName.trim(),
      albumName: formData.albumName.trim() || 'Single',
      genre: formData.genre,
      durationMs: formData.durationSeconds * 1000,
      releaseDate: formData.releaseDate,
      artworkUrl: formData.artworkUrl.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      previewUrl: formData.previewUrl.trim() || 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0d/17/57/0d17578b-3be2-675e-2495-2070f3f6c8d7/mzaf_10332308006248316208.plus.aac.p.m4a',
      price: Number(formData.price) || 0,
      rating: Number(formData.rating) || 5.0,
      playCount: editingSong ? editingSong.playCount : 1,
      description: formData.description.trim() || 'Bài hát do người dùng tự biên soạn và lưu trữ.',
      lyrics: formData.lyrics.trim() || 'Lời bài hát đang được cập nhật.',
    };

    if (editingSong) {
      updateSong(editingSong.id, payload);
    } else {
      addSong(payload);
    }

    closeForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-modal-title"
      onClick={closeForm}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 id="form-modal-title" className="text-base font-bold text-slate-900">
                {editingSong ? 'Chỉnh Sửa Bài Hát (CRUD)' : 'Thêm Bài Hát Mới (CRUD)'}
              </h2>
              <p className="text-xs text-slate-500">
                Lưu trữ đồng bộ vào trình duyệt (localStorage)
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            onClick={closeForm}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Đóng biểu mẫu (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên bài hát */}
          <div>
            <label htmlFor="trackName" className="block text-xs font-semibold text-slate-700 mb-1">
              Tên bài hát <span className="text-rose-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="trackName"
              type="text"
              value={formData.trackName}
              onChange={(e) => setFormData({ ...formData, trackName: e.target.value })}
              placeholder="Ví dụ: Nơi Này Có Anh, Waiting For You..."
              className={`w-full px-3.5 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.trackName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {errors.trackName && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.trackName}
              </p>
            )}
          </div>

          {/* Nghệ sĩ & Album */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="artistName" className="block text-xs font-semibold text-slate-700 mb-1">
                Nghệ sĩ thể hiện <span className="text-rose-500">*</span>
              </label>
              <input
                id="artistName"
                type="text"
                value={formData.artistName}
                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                placeholder="Ví dụ: Sơn Tùng M-TP"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.artistName ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.artistName && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.artistName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="albumName" className="block text-xs font-semibold text-slate-700 mb-1">
                Album / Tuyển tập
              </label>
              <input
                id="albumName"
                type="text"
                value={formData.albumName}
                onChange={(e) => setFormData({ ...formData, albumName: e.target.value })}
                placeholder="Single / Album"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Thể loại & Thời lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="genre" className="block text-xs font-semibold text-slate-700 mb-1">
                Thể loại nhạc
              </label>
              <select
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pop">Pop</option>
                <option value="Ballad">Ballad</option>
                <option value="R&B/Soul">R&B/Soul</option>
                <option value="EDM">EDM</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Acoustic">Acoustic</option>
                <option value="Indie">Indie</option>
              </select>
            </div>

            <div>
              <label htmlFor="durationSeconds" className="block text-xs font-semibold text-slate-700 mb-1">
                Thời lượng (giây) <span className="text-rose-500">*</span>
              </label>
              <input
                id="durationSeconds"
                type="number"
                min="10"
                max="1800"
                value={formData.durationSeconds}
                onChange={(e) =>
                  setFormData({ ...formData, durationSeconds: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.durationSeconds && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.durationSeconds}
                </p>
              )}
            </div>
          </div>

          {/* Giá & Đánh giá */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="price" className="block text-xs font-semibold text-slate-700 mb-1">
                Giá niêm yết (VNĐ)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-xs font-semibold text-slate-700 mb-1">
                Đánh giá (1.0 - 5.0)
              </label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* URL Ảnh bìa */}
          <div>
            <label htmlFor="artworkUrl" className="block text-xs font-semibold text-slate-700 mb-1">
              Link ảnh bìa (Artwork URL)
            </label>
            <input
              id="artworkUrl"
              type="url"
              value={formData.artworkUrl}
              onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả chi tiết tác phẩm
            </label>
            <textarea
              id="description"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập cảm nhận hoặc câu chuyện về bài hát..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Lời bài hát */}
          <div>
            <label htmlFor="lyrics" className="block text-xs font-semibold text-slate-700 mb-1">
              Lời bài hát trích dẫn
            </label>
            <textarea
              id="lyrics"
              rows={2}
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              placeholder="Đoạn điệp khúc hoặc lời nổi bật..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm shadow-emerald-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Save className="w-4 h-4" />
              <span>{editingSong ? 'Cập Nhật' : 'Thêm Vào Playlist'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
