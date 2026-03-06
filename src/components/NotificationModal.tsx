import React from "react";
import { motion, AnimatePresence } from "motion/react";

export type NotifType = 'success' | 'error' | 'info';

interface NotificationModalProps {
  isOpen: boolean;
  type: NotifType;
  title: string;
  message: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, type, title, message, onClose }) => {
  const getIcon = () => {
    if (type === 'success') return <i className="fa-solid fa-circle-check text-green-500 text-5xl"></i>;
    if (type === 'error') return <i className="fa-solid fa-circle-xmark text-red-500 text-5xl"></i>;
    return <i className="fa-solid fa-circle-info text-5xl text-blue-500"></i>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 px-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-6 text-center"
          >
            <div className="mb-4">{getIcon()}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <button 
              onClick={onClose} 
              className="bg-[#dc2626] text-white w-full py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Okay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
