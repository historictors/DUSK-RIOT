'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let globalToast: ((message: string, type?: ToastType) => void) | null = null;

export const showToast = (message: string, type: ToastType = 'success') => {
  if (globalToast) {
    globalToast(message, type);
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  React.useEffect(() => {
    globalToast = addToast;
    return () => {
      globalToast = null;
    };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 border font-label text-label-sm uppercase tracking-wider backdrop-blur-md shadow-2xl ${
              t.type === 'success'
                ? 'bg-surface-container/95 border-accent text-accent'
                : t.type === 'error'
                ? 'bg-surface-container/95 border-error text-error'
                : 'bg-surface-container/95 border-outline text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-error" />}
              {t.type === 'info' && <Info className="w-4 h-4 shrink-0 text-on-surface-variant" />}
              <span className="leading-tight text-on-surface">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-on-surface-variant hover:text-on-surface p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
