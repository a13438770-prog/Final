import React from "react";

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
const AuthButtons: React.FC<{ onLogin?: () => void; onRegister?: () => void }> = ({ onRegister }) => (
  <div className="flex items-center gap-2">
    <button onClick={onRegister} className="btn-auth-register cursor-pointer">
      Register
    </button>
  </div>
);

/**
 * Main Header Component
 */
const Header: React.FC<HeaderProps> = ({ siteInfo, user, onToggleSidebar, onLogin, onRegister, onBalanceClick }) => {
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
                className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative focus:outline-none border border-gray-100 cursor-pointer" 
                style={{ zIndex: 10001 }}
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f3f4f6&color=333&length=1&font-size=0.5&bold=true`} 
                  className="w-full h-full object-cover block"
                  alt={user.name}
                  referrerPolicy="no-referrer"
                />
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
