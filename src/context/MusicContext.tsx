import React, { createContext, useContext, useState, useEffect } from 'react';
import { Song } from '../types/song';
import initialSongsData from '../data/data.json';

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

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      // fallback to initial data
    }
    return initialSongsData as Song[];
  });

  const [currentPlaying, setCurrentPlaying] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedSongForModal, setSelectedSongForModal] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lưu vào localStorage mỗi khi danh sách songs thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    } catch {
      // localStorage có thể bị đầy hoặc không khả dụng
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

  const openModal = (song: Song) => {
    setSelectedSongForModal(song);
  };

  const closeModal = () => {
    setSelectedSongForModal(null);
  };

  const openCreateForm = () => {
    setEditingSong(null);
    setIsFormOpen(true);
  };

  const openEditForm = (song: Song) => {
    setEditingSong(song);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingSong(null);
  };

  const resetToDefault = () => {
    setSongs(initialSongsData as Song[]);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Đã khôi phục dữ liệu nhạc ban đầu (22 bài hát).');
  };

  // Tích hợp tìm kiếm từ API iTunes Search (theo gợi ý Bảng 1 đề bài)
  const searchFromItunes = async (query: string): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`
      );
      if (!response.ok) {
        throw new Error('Lỗi kết nối đến iTunes API');
      }
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
        return { success: false, count: 0, error: 'Không tìm thấy bài hát nào trên iTunes' };
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

      // Bổ sung các bài mới chưa trùng id vào danh sách
      setSongs((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newOnes = formattedSongs.filter((s) => !existingIds.has(s.id));
        return [...newOnes, ...prev];
      });

      showToast(`Đã nhập thêm ${formattedSongs.length} bài hát từ iTunes API thành công!`);
      return { success: true, count: formattedSongs.length };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi gọi iTunes API';
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
      {children}
    </MusicContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
