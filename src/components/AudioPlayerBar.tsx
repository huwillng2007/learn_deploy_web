import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Disc3 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const AudioPlayerBar: React.FC = () => {
  const { currentPlaying, isPlaying, pauseSong, playSong } = useMusic();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current || !currentPlaying) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy until interaction
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentPlaying]);

  if (!currentPlaying) return null;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-2xl transition-all">
      <audio
        ref={audioRef}
        src={currentPlaying.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={pauseSong}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-[200px] sm:max-w-xs">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
            <img
              src={currentPlaying.artworkUrl}
              alt={`Đang phát bài ${currentPlaying.trackName}`}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Disc3 className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {currentPlaying.trackName}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{currentPlaying.artistName}</p>
          </div>
        </div>

        {/* Player Controls & Progress */}
        <div className="flex-1 max-w-xl flex flex-col items-center">
          <div className="flex items-center gap-4 mb-1">
            <button
              onClick={() => {
                if (isPlaying) pauseSong();
                else playSong(currentPlaying);
              }}
              className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={
                isPlaying
                  ? `Tạm dừng phát bài ${currentPlaying.trackName}`
                  : `Tiếp tục phát bài ${currentPlaying.trackName}`
              }
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Seekbar */}
          <div className="w-full flex items-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>{formatSecs(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 30}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
              aria-label="Thanh tua tiến trình phát bài hát"
            />
            <span>{formatSecs(duration || 30)}</span>
          </div>
        </div>

        {/* Right side: Volume & Dismiss */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt tiếng âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={pauseSong}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Ẩn trình phát nhạc"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
