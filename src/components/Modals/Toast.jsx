import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'border-pink-500' : 'border-red-500';

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white border-l-4 ${bgColor} p-3 rounded-xl shadow-lg animate-fade-in`}>
      {message}
    </div>
  );
}