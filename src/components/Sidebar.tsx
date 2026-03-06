import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, User as UserIcon, ShoppingBag, QrCode, History, Wallet, LifeBuoy, LogOut } from "lucide-react";

/**
 * Interface for User Information
 */
interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  supportLink?: string;
  onLogout?: () => void;
  onLogin?: () => void;
  onNavigate?: (view: 'home' | 'transactions' | 'addmoney' | 'orders' | 'codes' | 'profile') => void;
}

/**
 * Sidebar Navigation Item Component
 */
const SidebarItem: React.FC<{ 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
}> = ({ href, icon, label, onClick }) => (
  <a 
    href={href} 
    onClick={(e) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }}
    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 group transition-colors cursor-pointer"
  >
    <div className="w-5 h-5 text-gray-700">
      {icon}
    </div>
    <span className="font-medium text-gray-700 text-sm tracking-wide">{label}</span>
  </a>
);

/**
 * Main Sidebar Component
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  supportLink = "#", 
  onLogout, 
  onLogin,
  onNavigate
}) => {
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Guest")}&background=random&color=fff`;

  const handleNav = (view: 'home' | 'transactions' | 'addmoney' | 'orders' | 'codes' | 'profile') => {
    onNavigate?.(view);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[99998]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-[280px] bg-white z-[99999] flex flex-col border-l border-gray-200 shadow-2xl"
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-white">
          <img 
            src={avatarUrl} 
            className="w-12 h-12 rounded-full border border-gray-100 object-cover" 
            alt="User Avatar"
            referrerPolicy="no-referrer"
          />
          
          <div className="flex-1 overflow-hidden">
            <h2 className="font-medium text-gray-800 text-base truncate">
              {user?.name || "Guest"}
            </h2>
            <p className="text-xs text-gray-500 truncate font-sans">
              {user?.email || "Please login"}
            </p>
          </div>
        </div>

        {/* Auth Action Section */}
        <div className="px-4 pb-4 pt-4">
          {user ? (
            <button 
              onClick={onLogout}
              style={{ backgroundColor: "var(--primary-color)" }} 
              className="hover:opacity-90 text-white text-sm font-medium w-full py-2.5 rounded-lg flex items-center justify-center gap-2 transition-opacity shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button 
              onClick={onLogin}
              style={{ backgroundColor: "var(--primary-color)" }} 
              className="hover:opacity-90 text-white text-sm font-medium w-full py-2.5 rounded-lg block text-center transition-opacity shadow-sm cursor-pointer"
            >
              Login
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="px-2 py-2 space-y-1 flex-1 overflow-y-auto">
          <SidebarItem 
            href="#" 
            label="Home" 
            onClick={() => handleNav('home')}
            icon={<Home className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="My Account" 
            onClick={() => handleNav('profile')}
            icon={<UserIcon className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="My Orders" 
            onClick={() => handleNav('orders')}
            icon={<ShoppingBag className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="My Codes" 
            onClick={() => handleNav('codes')}
            icon={<QrCode className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="My Transactions" 
            onClick={() => handleNav('transactions')}
            icon={<History className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="Add Money" 
            onClick={() => handleNav('addmoney')}
            icon={<Wallet className="w-5 h-5" />}
          />
        </nav>
        
        {/* Support Section */}
        <div className="p-6 border-t border-gray-100 mt-auto">
          <a 
            href={supportLink} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ backgroundColor: "var(--primary-color)" }} 
            className="hover:opacity-90 text-white w-full py-3 rounded-lg flex items-center justify-center gap-3 font-medium transition-opacity shadow-sm"
          >
            <LifeBuoy className="w-5 h-5" />
            Support
          </a>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
