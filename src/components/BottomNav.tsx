import React, { useState, useEffect } from "react";
import { Home, Wallet, Store, User as UserIcon, Headset, Receipt } from "lucide-react";
import { User } from "./Header";
import { motion, AnimatePresence } from "motion/react";

interface BottomNavProps {
  activeView: 'home' | 'store' | 'transactions' | 'addmoney' | 'orders' | 'profile' | 'auth' | 'support';
  onNavigate: (view: any) => void;
  user: User | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, user }) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // If the window height is significantly smaller than the screen height,
      // it's highly likely the virtual keyboard is open on a mobile device.
      if (window.innerHeight < window.screen.height * 0.75) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isKeyboardOpen) return null;

  // Conditional navigation items based on auth state
  const navItems = user 
    ? [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'addmoney', label: 'Add Money', icon: Wallet },
        { id: 'orders', label: 'Orders', icon: Receipt },
        { id: 'profile', label: 'Profile', icon: UserIcon, isAvatar: true }
      ]
    : [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'store', label: 'Store', icon: Store },
        { id: 'support', label: 'Support', icon: Headset },
        { id: 'profile', label: 'Profile', icon: UserIcon }
      ];

  const transitionConfig = { type: "tween", ease: "easeInOut", duration: 0.25 };

  return (
    <motion.nav 
      layout
      onContextMenu={(e) => e.preventDefault()}
      transition={transitionConfig}
      className="fixed bottom-2 left-1/2 -translate-x-1/2 w-max max-w-[96vw] bg-white/70 backdrop-blur-xl saturate-150 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-2xl flex justify-between items-center px-1 py-1 z-[9999] gap-0 will-change-transform"
    >
      {navItems.map((item) => {
        const isActive = activeView === item.id || (activeView === 'auth' && item.id === 'profile');
        const Icon = item.icon;
        
        return (
          <motion.button
            layout
            key={item.id}
            onClick={() => onNavigate(item.id)}
            transition={transitionConfig}
            className={`relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl outline-none group ${
              isActive 
                ? 'text-white' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* Shared Layout Background for Active State */}
            {isActive && (
              <motion.div
                layoutId="active-nav-bg"
                className="absolute inset-0 bg-red-600 rounded-xl"
                transition={transitionConfig}
              />
            )}

            <motion.div 
              layout 
              transition={transitionConfig}
              className={`relative z-10 flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
            >
              {item.isAvatar && user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="User" 
                  className={`w-5 h-5 rounded-full object-cover border ${isActive ? 'border-red-200' : 'border-gray-300 group-hover:border-gray-400'} transition-colors`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </motion.div>
            
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.span 
                  layout
                  initial={{ opacity: 0, width: 0, scale: 0.8 }}
                  animate={{ opacity: 1, width: "auto", scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.8 }}
                  transition={transitionConfig}
                  className="relative z-10 font-bree text-xs font-bold whitespace-nowrap tracking-wide text-white overflow-hidden"
                >
                  <span className="pl-1">{item.label}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.nav>
  );
};

export default BottomNav;
