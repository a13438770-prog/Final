import React, { useState, useEffect } from "react";
import { Home, Wallet, ShoppingBag, QrCode, User as UserIcon } from "lucide-react";
import { User } from "./Header";

interface BottomNavProps {
  activeView: 'home' | 'transactions' | 'addmoney' | 'orders' | 'profile' | 'auth';
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

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-6 h-6" />
    },
    {
      id: 'addmoney',
      label: 'Add Money',
      icon: <Wallet className="w-6 h-6" />
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-6 h-6" />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: user ? (
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} 
          alt="User" 
          className="w-6 h-6 rounded-full border border-gray-300 object-cover block"
          referrerPolicy="no-referrer"
        />
      ) : (
        <UserIcon className="w-6 h-6" />
      )
    }
  ];

  if (isKeyboardOpen) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-100 flex justify-between items-center px-2 z-[9999] pb-[env(safe-area-inset-bottom)] h-[60px] md:left-0 md:right-0 md:mx-auto md:max-w-[500px] md:bottom-5 md:rounded-2xl md:border md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] md:pb-0 transition-all duration-500">
      {navItems.map((item) => {
        const isActive = activeView === item.id || (activeView === 'auth' && item.id === 'profile');
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="relative flex-1 flex flex-col items-center justify-center gap-0.5 h-full group outline-none"
          >
            {/* Active Indicator Background */}
            <div 
              className={`absolute inset-0 m-auto w-11 h-11 rounded-xl transition-all duration-300 ease-out -z-10 ${
                isActive 
                  ? 'bg-red-50 scale-100 opacity-100' 
                  : 'bg-gray-50 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100'
              }`} 
            />
            
            {/* Icon Container with pop effect */}
            <div 
              className={`w-6 h-6 flex items-center justify-center transition-all duration-300 ease-out transform ${
                isActive 
                  ? 'text-red-600 -translate-y-1 scale-110' 
                  : 'text-gray-400 group-hover:text-gray-800 group-hover:-translate-y-0.5 group-hover:scale-105'
              }`}
            >
              {item.icon}
            </div>
            
            {/* Label with fade/slide effect */}
            <span 
              className={`text-[10px] font-medium transition-all duration-300 ease-out ${
                isActive 
                  ? 'text-red-600 opacity-100 translate-y-0' 
                  : 'text-gray-400 opacity-70 group-hover:opacity-100 group-hover:text-gray-800'
              }`}
            >
              {item.label}
            </span>
            
            {/* Active Dot Indicator */}
            <div 
              className={`absolute bottom-1.5 w-1 h-1 rounded-full bg-red-600 transition-all duration-300 ease-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`} 
            />
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
