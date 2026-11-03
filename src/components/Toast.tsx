import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useMusic();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
