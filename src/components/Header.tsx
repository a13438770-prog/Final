import React from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Interface for Site Information
 */
export interface SiteInfo {
  name: string;
  title: string;
  logo: string;
  primaryColor: string;
  metaDesc?: string;
  metaKeywords?: string;
}

/**
 * Interface for User Information
 */
export interface User {
  id: number;
  name: string;
  balance: number;
  avatar?: string;
  email?: string;
}

interface HeaderProps {
  siteInfo: SiteInfo;
  user: User | null;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onLogin?: () => void;
  onRegister?: () => void;
  onBalanceClick?: () => void;
  onLogoClick?: () => void;
}

/**
 * Balance Pill Component
 */
const BalancePill: React.FC<{ balance: number, onClick?: () => void }> = ({ balance, onClick }) => {
  const balStr = balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const digits = balStr.replace(/,/g, '').length;
  
  let fontSize = '15px';
  if (digits > 4) fontSize = '13px';
  if (digits > 6) fontSize = '11px';

  return (
    <div className="secure-balance-box cursor-pointer" onClick={onClick} style={{ fontSize: `${fontSize} !important` } as React.CSSProperties}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </svg>
      <span className="secure-balance-text">{balStr}৳</span>
    </div>
  );
};

/**
 * Auth Buttons Component
 */
const AuthButtons: React.FC<{ onLogin?: () => void; onRegister?: () => void }> = ({ onLogin }) => (
  <div className="flex items-center gap-2">
    <button onClick={onLogin} className="btn-auth-login cursor-pointer font-extrabold">
      Login
    </button>
  </div>
);

/**
 * Main Header Component
 */
const Header: React.FC<HeaderProps> = ({ siteInfo, user, isSidebarOpen, onToggleSidebar, onLogin, onRegister, onBalanceClick, onLogoClick }) => {
  return (
    <header id="main-header-secure">
      <div className="container mx-auto px-2 flex justify-between items-center h-full gap-5">
        
        <div className="flex items-center">
          <a href="/" className="flex items-center" onClick={(e) => { e.preventDefault(); onLogoClick?.(); }}>
            <img 
              id="secure-logo-img" 
              src={siteInfo.logo} 
              alt={siteInfo.name} 
              referrerPolicy="no-referrer"
            />
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <BalancePill balance={user.balance} onClick={onBalanceClick} />

              <button 
                onClick={onToggleSidebar} 
                className="w-10 h-10 rounded-full overflow-hidden relative focus:outline-none cursor-pointer flex items-center justify-center" 
                style={{ zIndex: 10001 }}
              >
                <AnimatePresence mode="wait">
                  {isSidebarOpen ? (
                    <motion.i 
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      className="fa-solid fa-xmark text-xl text-gray-700 absolute"
                    ></motion.i>
                  ) : (
                    <motion.i 
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                      className="fa-solid fa-bars text-xl text-gray-700 absolute"
                    ></motion.i>
                  )}
                </AnimatePresence>
              </button>
            </>
          ) : (
            <AuthButtons onLogin={onLogin} onRegister={onRegister} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
