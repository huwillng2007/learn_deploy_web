/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';
import { SongDetailModal } from './components/SongDetailModal';
import { SongFormModal } from './components/SongFormModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Toast } from './components/Toast';
import initialSongsData from './data/data.json';
import { Music, Home } from 'lucide-react';

export interface Song {
  id: string;
  trackName: string;
  artistName: string;
  albumName: string;
  genre: string;
  durationMs: number;
  releaseDate: string;
  artworkUrl: string;
  previewUrl: string;
  price: number;
  rating: number;
  playCount: number;
  description: string;
  lyrics: string;
  isFavorite: boolean;
  isCustom?: boolean;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'name-asc'
  | 'name-desc'
  | 'duration-asc'
  | 'duration-desc'
  | 'rating-desc';

export interface FilterOptions {
  searchTerm: string;
  genre: string;
  durationRange: 'all' | 'short' | 'medium' | 'long';
  dataSource: 'all' | 'custom' | 'system';
  sortBy: SortOption;
}

interface MusicContextType {
  songs: Song[];
  currentPlaying: Song | null;
  isPlaying: boolean;
  selectedSongForModal: Song | null;
  editingSong: Song | null;
  isFormOpen: boolean;
  toastMessage: string | null;
  addSong: (newSongData: Omit<Song, 'id' | 'isFavorite' | 'isCustom'>) => void;
  updateSong: (id: string, updatedData: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  toggleFavorite: (id: string) => void;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: (song: Song) => void;
  openModal: (song: Song) => void;
  closeModal: () => void;
  openCreateForm: () => void;
  openEditForm: (song: Song) => void;
  closeForm: () => void;
  resetToDefault: () => void;
  searchFromItunes: (query: string) => Promise<{ success: boolean; count: number; error?: string }>;
  showToast: (message: string) => void;
}

const STORAGE_KEY = 'emerald_music_library_6651071097';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

// Component trang 404 gọn gàng tích hợp trực tiếp
const NotFoundInline: React.FC = () => (
  <div className="py-20 text-center max-w-md mx-auto">
    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
      <Music className="w-8 h-8" />
    </div>
    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404</h1>
    <h2 className="text-lg font-bold text-slate-700 mb-2">Không tìm thấy trang yêu cầu</h2>
    <p className="text-xs text-slate-500 mb-6">Đường dẫn bạn truy cập không tồn tại.</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
    >
      <Home className="w-4 h-4" />
      <span>Về Trang Chủ Thư Viện</span>
    </Link>
  </div>
);

export const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return initialSongsData as Song[];
  });

  const [currentPlaying, setCurrentPlaying] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedSongForModal, setSelectedSongForModal] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch {
      // ignore
    }
  }, [songs]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const addSong = (newSongData: Omit<Song, 'id' | 'isFavorite' | 'isCustom'>) => {
    const newSong: Song = {
      ...newSongData,
      id: 'custom_' + Date.now(),
      isFavorite: false,
      isCustom: true,
      playCount: 1,
      rating: newSongData.rating || 5.0,
      artworkUrl: newSongData.artworkUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    };
    setSongs((prev) => [newSong, ...prev]);
    showToast(`Đã thêm bài hát "${newSong.trackName}" thành công!`);
  };

  const updateSong = (id: string, updatedData: Partial<Song>) => {
    setSongs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
    if (selectedSongForModal && selectedSongForModal.id === id) {
      setSelectedSongForModal((prev) => (prev ? { ...prev, ...updatedData } : null));
    }
    if (currentPlaying && currentPlaying.id === id) {
      setCurrentPlaying((prev) => (prev ? { ...prev, ...updatedData } : null));
    }
    showToast('Đã cập nhật bài hát thành công!');
  };

  const deleteSong = (id: string) => {
    const songToDelete = songs.find((s) => s.id === id);
    setSongs((prev) => prev.filter((item) => item.id !== id));
    if (selectedSongForModal?.id === id) {
      setSelectedSongForModal(null);
    }
    if (currentPlaying?.id === id) {
      setCurrentPlaying(null);
      setIsPlaying(false);
    }
    showToast(`Đã xóa bài hát "${songToDelete?.trackName || ''}" khỏi danh sách.`);
  };

  const toggleFavorite = (id: string) => {
    setSongs((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isFavorite;
          showToast(
            nextState
              ? `Đã thêm "${item.trackName}" vào danh sách yêu thích`
              : `Đã bỏ "${item.trackName}" khỏi yêu thích`
          );
          return { ...item, isFavorite: nextState };
        }
        return item;
      })
    );
  };

  const playSong = (song: Song) => {
    setCurrentPlaying(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const togglePlay = (song: Song) => {
    if (currentPlaying?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentPlaying(song);
      setIsPlaying(true);
    }
  };

  const openModal = (song: Song) => setSelectedSongForModal(song);
  const closeModal = () => setSelectedSongForModal(null);
  const openCreateForm = () => { setEditingSong(null); setIsFormOpen(true); };
  const openEditForm = (song: Song) => { setEditingSong(song); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingSong(null); };

  const resetToDefault = () => {
    setSongs(initialSongsData as Song[]);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Đã khôi phục dữ liệu nhạc ban đầu (22 bài hát).');
  };

  const searchFromItunes = async (query: string): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`
      );
      if (!response.ok) throw new Error('Lỗi kết nối iTunes API');
      interface ItunesItem {
        trackId: number;
        trackName?: string;
        artistName?: string;
        collectionName?: string;
        primaryGenreName?: string;
        trackTimeMillis?: number;
        releaseDate?: string;
        artworkUrl100?: string;
        previewUrl?: string;
        trackPrice?: number;
      }
      const data: { results: ItunesItem[] } = await response.json();
      if (!data.results || data.results.length === 0) {
        return { success: false, count: 0, error: 'Không tìm thấy bài hát nào' };
      }

      const formattedSongs: Song[] = data.results
        .filter((item) => item.trackName && item.previewUrl)
        .map((item) => ({
          id: 'itunes_' + item.trackId,
          trackName: item.trackName || 'Unknown Title',
          artistName: item.artistName || 'Unknown Artist',
          albumName: item.collectionName || 'Single / Album',
          genre: item.primaryGenreName || 'Pop',
          durationMs: item.trackTimeMillis || 210000,
          releaseDate: item.releaseDate ? item.releaseDate.substring(0, 10) : '2023-01-01',
          artworkUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : '',
          previewUrl: item.previewUrl || '',
          price: item.trackPrice && item.trackPrice > 0 ? Math.round(item.trackPrice * 25000) : 25000,
          rating: 4.8,
          playCount: Math.floor(Math.random() * 5000000) + 1000000,
          description: `Bản phát hành chính thức của nghệ sĩ ${item.artistName} trên nền tảng Apple Music / iTunes.`,
          lyrics: `Lời bài hát cho ${item.trackName} đang được cập nhật từ Apple Music.`,
          isFavorite: false,
          isCustom: false,
        }));

      setSongs((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newOnes = formattedSongs.filter((s) => !existingIds.has(s.id));
        return [...newOnes, ...prev];
      });

      showToast(`Đã nhập thêm ${formattedSongs.length} bài hát từ iTunes API!`);
      return { success: true, count: formattedSongs.length };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối iTunes';
      showToast(msg);
      return { success: false, count: 0, error: msg };
    }
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentPlaying,
        isPlaying,
        selectedSongForModal,
        editingSong,
        isFormOpen,
        toastMessage,
        addSong,
        updateSong,
        deleteSong,
        toggleFavorite,
        playSong,
        pauseSong,
        togglePlay,
        openModal,
        closeModal,
        openCreateForm,
        openEditForm,
        closeForm,
        resetToDefault,
        searchFromItunes,
        showToast,
      }}
    >
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-24">
          <Header />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/item/:id" element={<DetailPage />} />
              <Route path="*" element={<NotFoundInline />} />
            </Routes>
          </main>

          <SongDetailModal />
          <SongFormModal />
          <AudioPlayerBar />
          <Toast />

          <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
              <p className="font-semibold text-slate-900">
                BÀI THỰC HÀNH BUỔI 2 &bull; THIẾT KẾ WEB &bull; GV: Nguyễn Thiện Dương
              </p>
              <p>
                Sinh viên: <span className="font-bold text-emerald-800">Hồ Ngọc Hưng</span> &bull;
                MSSV: <span className="font-bold text-emerald-800">6651071097</span>
              </p>
              <p className="text-slate-700 text-[11px] font-medium">
                Biến thể đề tài: S=42, D=12 (Danh sách nhạc/playlist), F=7 (Tìm kiếm &amp; lọc nâng cao &bull; CRUD cục bộ &bull; Modal chi tiết), C=1 (Emerald #059669)
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </MusicContext.Provider>
  );
};

export default App;
