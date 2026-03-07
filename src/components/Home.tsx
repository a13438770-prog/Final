import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Types for the Home component data
 */
export interface Slide {
  id: number;
  image: string;
  link?: string;
}

export interface Game {
  id: number;
  name: string;
  image: string;
  status: 'active' | 'inactive';
  category_id: number;
  type: string;
  hint_text?: string;
  check_uid?: number;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  priority: number;
  status: 'active' | 'inactive';
}

export interface Order {
  id: number;
  user_name: string;
  user_image?: string;
  game_name?: string;
  product_name: string;
  amount: number;
  created_at?: string;
  status?: 'Processing' | 'Completed';
}

export interface PopupData {
  image?: string;
  link?: string;
  btnText?: string;
  text?: string;
}

interface HomeProps {
  noticeText?: string;
  popup?: PopupData;
  slides: Slide[];
  categories: Category[];
  games: Game[];
  latestOrders: Order[];
  onGameClick?: (gameId: number) => void;
}

/**
 * Popup Component
 */
const Popup: React.FC<{ data: PopupData }> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || (!data.image && !data.text)) return null;

  return (
    <div id="homePopupOverlay" className="fixed top-0 left-0 w-full h-full bg-black/80 z-[10005] flex items-center justify-center p-[15px]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="popup-wrapper"
      >
        <div className="popup-card">
          {data.image && (
            <div className="popup-img-box">
              <img src={data.image} alt="Offer" referrerPolicy="no-referrer" />
            </div>
          )}

          <div className="popup-body">
            {data.text && (
              <div className="popup-text-content whitespace-pre-wrap">
                {data.text}
              </div>
            )}

            {data.btnText && (
              <a href={data.link || "#"} className="popup-action-btn">
                {data.btnText}
              </a>
            )}
          </div>
        </div>

        <button 
          className="popup-bottom-close" 
          onClick={() => setIsOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i> CLOSE
        </button>
      </motion.div>
    </div>
  );
};

/**
 * Notice Component
 */
const Notice: React.FC<{ text: string; onDismiss?: () => void }> = ({ text, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="container mx-auto px-2 mt-2">
      <div className="notice-box rounded-md">
        <div className="notice-header">
          <span className="notice-title flex items-center gap-2">
            <i className="fa-solid fa-bell"></i> Notice
          </span>
          <i 
            className="fa-solid fa-xmark notice-close" 
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
          ></i>
        </div>
        <div className="notice-content whitespace-pre-wrap font-bold">
          {text}
        </div>
      </div>
    </div>
  );
};

/**
 * Slider Component
 */
const Slider: React.FC<{ slides: Slide[] }> = ({ slides }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = slides.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % total);
  };

  const startTimer = () => {
    if (total > 1) {
      timerRef.current = setInterval(nextSlide, 5000);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIdx(index);
    resetTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIdx((prev) => (prev + 1) % total);
      resetTimer();
    }
    if (isRightSwipe) {
      setCurrentIdx((prev) => (prev - 1 + total) % total);
      resetTimer();
    }
  };

  if (total === 0) {
    return (
      <div className="w-full px-2">
        <div className="relative w-full shadow-sm bg-gray-100 slider-aspect flex items-center justify-center text-gray-400 font-normal rounded-xl">
          No Banners Found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2">
      <div className="relative w-full shadow-sm bg-gray-100 slider-aspect group overflow-hidden rounded-xl">
        <div 
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIdx * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide) => (
            <a 
              key={slide.id}
              href={slide.link || "#"} 
              className="min-w-full h-full block select-none"
              onClick={(e) => { 
                if (e.defaultPrevented) return;
                // If it's just "#", prevent default to avoid jumping to top
                if (!slide.link || slide.link === "#") {
                  e.preventDefault();
                }
              }}
            >
              <img 
                src={slide.image} 
                className="w-full h-full object-cover pointer-events-none" 
                alt="Slide"
                referrerPolicy="no-referrer"
              />
            </a>
          ))}
        </div>

        {/* Navigation Buttons */}
        {total > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1 z-10">
            <button 
              onClick={(e) => {
                e.preventDefault();
                setCurrentIdx((prev) => (prev - 1 + total) % total);
                resetTimer();
              }}
              className="text-white w-7 h-7 flex items-center justify-center hover:text-gray-200 transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-xs drop-shadow-md"></i>
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setCurrentIdx((prev) => (prev + 1) % total);
                resetTimer();
              }}
              className="text-white w-7 h-7 flex items-center justify-center hover:text-gray-200 transition-colors"
            >
              <i className="fa-solid fa-chevron-right text-xs drop-shadow-md"></i>
            </button>
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="flex justify-center gap-2 mt-2 mb-4">
          {slides.map((_, i) => (
            <button 
              key={i}
              onClick={() => goToSlide(i)} 
              className={`h-1 w-6 sharp-edge transition-all duration-300 ${i === currentIdx ? 'dot-active' : 'dot-inactive'}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Game Card Component
 */
const GameCard: React.FC<{ game: Game; onClick?: (id: number) => void }> = ({ game, onClick }) => {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleOutside = (e: TouchEvent | MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };

    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('mouseover', handleOutside);

    return () => {
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('mouseover', handleOutside);
    };
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startHover = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsActive(true);
    }, 200); // 200ms delay before hover effect triggers
  };

  const cancelHover = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const endHover = () => {
    cancelHover();
    setIsActive(false);
  };

  return (
    <button 
      ref={cardRef}
      onClick={(e) => {
        cancelHover();
        setIsActive(false);
        onClick?.(game.id);
      }} 
      onContextMenu={(e) => e.preventDefault()}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onTouchStart={startHover}
      onTouchMove={cancelHover}
      className="block text-left cursor-pointer focus:outline-none w-full"
    >
      <div className={`rounded-md overflow-hidden mb-2 relative bg-white shadow-sm border border-gray-200 transition-transform duration-300 ${isActive ? 'scale-[0.87]' : 'scale-100'}`}>
        <img 
          src={game.image} 
          className="w-full aspect-square object-cover" 
          alt={game.name}
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="text-center">
        <h3 className={`text-xs md:text-sm font-bold leading-tight uppercase transition-colors duration-300 ${isActive ? 'text-[var(--primary-color)]' : 'text-black'}`}>
          {game.name}
        </h3>
      </div>
    </button>
  );
};

/**
 * Game Grid Component
 */
const GameGrid: React.FC<{ games: Game[]; onGameClick?: (id: number) => void }> = ({ games, onGameClick }) => {
  if (games.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={onGameClick} />
      ))}
    </div>
  );
};

/**
 * Latest Orders Component
 */
const LatestOrders: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div className="container mx-auto px-2 pb-24">
      <div className="latest-orders-container">
        <h2 className="latest-orders-title">Latest Orders</h2>
        <p className="latest-orders-subtitle">সবচেয়ে সাম্প্রতিক <span>5টি অর্ডার</span> এক নজরে</p>
        
        <div className="flex flex-col gap-2 mt-3">
          {orders.length > 0 ? (
            orders.map((order) => {
              const initial = order.user_name ? order.user_name.charAt(0).toUpperCase() : 'G';
              const status = order.status || (order.id % 2 === 0 ? 'Processing' : 'Completed');
              
              return (
                <div key={order.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-[40px] h-[40px] rounded-full bg-[#e5e7eb] flex items-center justify-center text-gray-800 font-normal text-xl flex-shrink-0 shadow-sm">
                      {initial}
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-[15px] font-bree">{order.user_name || 'Guest'}</h4>
                      <p className="text-[12px] text-gray-600 mt-0.5 leading-snug">
                        {order.game_name ? `${order.game_name} - ` : ''}{order.product_name} — <span className="font-bold text-gray-900">{order.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}৳</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 text-right flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      status === 'Processing' 
                        ? 'bg-[#eab308] text-black' 
                        : 'bg-[#22c55e] text-white'
                    }`}>
                      {status}
                    </span>
                    {order.created_at && (
                      <span className="text-[10px] text-gray-500 font-medium max-w-[90px] leading-tight">
                        {order.created_at}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm py-4 text-center">No recent orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main Home Component
 */
const Home: React.FC<HomeProps> = (props) => {
  const { 
    noticeText, 
    popup, 
    slides, 
    categories, 
    games, 
    latestOrders,
    onGameClick 
  } = props;

  const [noticeDismissed, setNoticeDismissed] = useState(false);

  // Filter active categories and games
  const activeCategories = categories.filter(c => c.status === 'active').sort((a, b) => a.priority - b.priority);
  const activeGames = games.filter(g => g.status === 'active');

  return (
    <div className="min-h-screen">
      {/* Popup */}
      {popup && <Popup data={popup} />}

      {/* Notice */}
      {noticeText && <Notice text={noticeText} onDismiss={() => setNoticeDismissed(true)} />}

      {/* Slider */}
      <div className={noticeDismissed || !noticeText ? "mt-4" : ""}>
        <Slider slides={slides} />
      </div>

      {/* Game Sections */}
      <div className="container mx-auto px-2 pb-6">
        {activeCategories.length > 0 ? (
          <>
            {activeCategories.map((cat) => {
              const catGames = activeGames.filter(g => g.category_id === cat.id);
              if (catGames.length === 0) return null;

              return (
                <React.Fragment key={cat.id}>
                  <div className="divider-container px-2">
                    <div className="divider-line" style={{ "--dir": "left" } as React.CSSProperties}></div>
                    <h2 className="divider-text">{cat.name}</h2>
                    <div className="divider-line" style={{ "--dir": "right" } as React.CSSProperties}></div>
                  </div>
                  <GameGrid games={catGames} onGameClick={onGameClick} />
                </React.Fragment>
              );
            })}

            {/* Others (Uncategorized) */}
            {(() => {
              const uncategorizedGames = activeGames.filter(g => g.category_id === 0);
              if (uncategorizedGames.length === 0) return null;

              return (
                <>
                  <div className="divider-container px-2 mt-8">
                    <div className="divider-line" style={{ "--dir": "left" } as React.CSSProperties}></div>
                    <h2 className="divider-text">Others</h2>
                    <div className="divider-line" style={{ "--dir": "right" } as React.CSSProperties}></div>
                  </div>
                  <GameGrid games={uncategorizedGames} onGameClick={onGameClick} />
                </>
              );
            })()}
          </>
        ) : (
          /* No Categories: Show All Active Games */
          activeGames.length > 0 && (
            <>
              <div className="divider-container px-2">
                <div className="divider-line" style={{ "--dir": "left" } as React.CSSProperties}></div>
                <h2 className="divider-text">All Games</h2>
                <div className="divider-line" style={{ "--dir": "right" } as React.CSSProperties}></div>
              </div>
              <GameGrid games={activeGames} onGameClick={onGameClick} />
            </>
          )
        )}
      </div>

      {/* Latest Orders */}
      <LatestOrders orders={latestOrders} />
    </div>
  );
};

export default Home;
