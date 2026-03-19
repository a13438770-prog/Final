import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-white/80 backdrop-blur-xl saturate-150 border border-green-200/50 text-green-800',
    error: 'bg-white/80 backdrop-blur-xl saturate-150 border border-red-200/50 text-red-800',
    info: 'bg-white/80 backdrop-blur-xl saturate-150 border border-blue-200/50 text-blue-800'
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-[72px] right-4 z-[10005] flex flex-col items-end gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)", x: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`flex items-center gap-2 px-3.5 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-md w-max max-w-[90vw] pointer-events-auto ${bgColors[toast.type]}`}
            >
              <div className="flex-shrink-0">
                {icons[toast.type]}
              </div>
              <p className="text-xs font-semibold flex-1 tracking-wide">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors ml-1 outline-none">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
