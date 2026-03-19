import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserIcon, ShoppingBag, ShoppingCart, History, MapPin, LogOut, HelpCircle } from "lucide-react";

/**
 * Interface for User Information
 */
interface User {
  name: string;
  email: string;
  avatar?: string;
  ordersCount?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  cartCount?: number;
  onLogout?: () => void;
  onLogin?: () => void;
  onNavigate?: (view: 'home' | 'transactions' | 'addmoney' | 'orders' | 'profile') => void;
}

/**
 * Sidebar Navigation Item Component
 */
const SidebarItem: React.FC<{ 
  href: string; 
  icon: React.ReactNode; 
  label: string;
  onClick?: () => void;
  badge?: number;
}> = ({ href, icon, label, onClick, badge }) => (
  <a 
    href={href} 
    onClick={(e) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }}
    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/40 group transition-colors cursor-pointer justify-between"
  >
    <div className="flex items-center gap-4">
      <div className="w-5 h-5 text-gray-700">
        {icon}
      </div>
      <span className="font-medium text-gray-700 text-sm tracking-wide">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </a>
);

/**
 * Main Sidebar Component
 */
const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  cartCount = 0,
  onLogout, 
  onLogin,
  onNavigate
}) => {
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Guest")}&background=random&color=fff`;

  const handleNav = (view: 'home' | 'transactions' | 'addmoney' | 'orders' | 'profile') => {
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
            className="fixed top-[56px] bottom-0 left-0 right-0 bg-black/50 z-[10000]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-[56px] bottom-0 right-0 w-[220px] bg-white/70 backdrop-blur-xl saturate-150 z-[10001] flex flex-col border-l border-white/50 shadow-2xl"
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-white/30 flex items-center gap-4">
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

        {/* Navigation Section */}
        <nav className="px-2 py-4 space-y-1 flex-1 overflow-y-auto">
          <SidebarItem 
            href="#" 
            label="Profile" 
            onClick={() => handleNav('profile')}
            icon={<UserIcon className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="Cart" 
            onClick={() => {
              onNavigate?.('cart' as any);
              onClose();
            }}
            icon={<ShoppingCart className="w-5 h-5" />}
            badge={cartCount}
          />

          <SidebarItem 
            href="#" 
            label="Orders" 
            onClick={() => handleNav('orders')}
            icon={<ShoppingBag className="w-5 h-5" />}
            badge={user?.ordersCount} // Assuming user object might have this, or we can pass it as a prop. For now, let's just pass a mock value or leave it undefined if not available.
          />

          <SidebarItem 
            href="#" 
            label="Transactions" 
            onClick={() => handleNav('transactions')}
            icon={<History className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="Order Tracker" 
            onClick={() => {
              onNavigate?.('order_tracker' as any);
              onClose();
            }}
            icon={<MapPin className="w-5 h-5" />}
          />

          <SidebarItem 
            href="#" 
            label="Support Center" 
            onClick={() => {
              onNavigate?.('support' as any);
              onClose();
            }}
            icon={<HelpCircle className="w-5 h-5" />}
          />
        </nav>
        
        {/* Auth Action Section */}
        <div className="p-4 border-t border-white/30 mt-auto pb-24">
          {user ? (
            <button 
              onClick={onLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button 
              onClick={onLogin}
              style={{ backgroundColor: "var(--primary-color)" }} 
              className="hover:opacity-90 text-white text-sm font-bold w-full py-3 rounded-lg block text-center transition-opacity shadow-sm cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
