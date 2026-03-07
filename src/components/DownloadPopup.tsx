import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DownloadPopupProps {
  siteName: string;
  logo: string;
  downloadLink: string;
}

const DownloadPopup: React.FC<DownloadPopupProps> = ({ siteName, logo, downloadLink }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissedTime = localStorage.getItem('hide_dl_popup_v1');
    if (dismissedTime) {
      const now = new Date().getTime();
      const cooldown = 30 * 60 * 1000; // 30 Minutes
      if (now - parseInt(dismissedTime) < cooldown) {
        return;
      }
    }
    
    // Show after a small delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hide_dl_popup_v1', new Date().getTime().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-2.5 right-2.5 z-[10000] bg-[#dc2626] text-white rounded-xl p-2.5 flex items-center gap-3 shadow-2xl md:left-0 md:right-0 md:mx-auto md:max-w-[480px] md:bottom-[100px]"
        >
          <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0">
            <img src={logo} className="w-full h-full object-contain" alt="Logo" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="font-extrabold text-sm uppercase leading-tight">{siteName}</span>
            <span className="text-[11px] opacity-90">Add to home screen.</span>
          </div>
          <a 
            href={downloadLink} 
            className="bg-white text-black font-bold text-[13px] px-3.5 py-1.5 rounded-md whitespace-nowrap active:scale-95 transition-transform"
          >
            Install
          </a>
          <button onClick={handleClose} className="text-lg opacity-80 ml-2 cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadPopup;
