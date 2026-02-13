
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-indigo-600'
  }[type];

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[9999] animate-slide-up`}>
      <span className="font-bold">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  );
};
