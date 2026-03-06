import React, { useState, useEffect } from "react";
import { SocialLinks } from "./Footer";

interface SupportButtonProps {
  socialLinks: SocialLinks;
}

const SupportButton: React.FC<SupportButtonProps> = ({ socialLinks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < window.screen.height * 0.75) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isKeyboardOpen) return null;

  return (
    <div className="fixed bottom-[75px] right-4 z-[9998] flex flex-col items-end gap-3 transition-all duration-300 md:bottom-[70px] md:right-10">
      {/* Support Options */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'
        }`}
      >
        {socialLinks.helpline && (
          <a
            href={`https://wa.me/${socialLinks.helpline}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-transform hover:scale-110 active:scale-95"
            title="WhatsApp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </a>
        )}
        
        {socialLinks.telegram && (
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#0088cc] rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-transform hover:scale-110 active:scale-95"
            title="Telegram"
          >
            <i className="fa-brands fa-telegram"></i>
          </a>
        )}

        {socialLinks.facebook && (
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#00B2FF] rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-transform hover:scale-110 active:scale-95"
            title="Messenger"
          >
            <i className="fa-brands fa-facebook-messenger"></i>
          </a>
        )}
      </div>

      {/* Main Toggle Button */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-[#dc2626] rounded-full shadow-xl flex items-center justify-center text-white text-xl transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <i className={`fa-solid transition-transform duration-300 ${isOpen ? 'fa-xmark rotate-90' : 'fa-headset'}`}></i>
        </button>
      </div>
    </div>
  );
};

export default SupportButton;
