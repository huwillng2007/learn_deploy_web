import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { Header } from './components/Header';
import { ListPage } from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SongDetailModal } from './components/SongDetailModal';
import { SongFormModal } from './components/SongFormModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Toast } from './components/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MusicProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pb-24">
          {/* Main Top Navigation Header */}
          <Header />

          {/* Page Routing Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/item/:id" element={<DetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Interactive Modals & Player Overlays */}
          <SongDetailModal />
          <SongFormModal />
          <AudioPlayerBar />
          <Toast />

          {/* Student & Course Academic Footer */}
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
      </MusicProvider>
    </BrowserRouter>
  );
};

export default App;
