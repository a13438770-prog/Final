import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import Header, { SiteInfo, User } from "./components/Header";
import Home, { Slide, Category, Game, Order, PopupData } from "./components/Home";
import Transactions, { Transaction } from "./components/Transactions";
import GameDetail, { Product } from "./components/GameDetail";
import Orders, { OrderDetail } from "./components/Orders";
import Profile, { UserStats } from "./components/Profile";
import Auth from "./components/Auth";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AddMoney from "./components/AddMoney";
import Checkout from "./components/Checkout";
import PaymentVerify from "./components/PaymentVerify";
import Sidebar from "./components/Sidebar";
import Footer, { SocialLinks } from "./components/Footer";
import BottomNav from "./components/BottomNav";
import SupportButton from "./components/SupportButton";
import DownloadPopup from "./components/DownloadPopup";
import PageLoader from "./components/PageLoader";
import NotificationModal, { NotifType } from "./components/NotificationModal";
import Cart from "./components/Cart";
import OrderTracker from "./components/OrderTracker";

/**
 * Mock data for Header
 */
const mockSiteInfo: SiteInfo = {
  name: "TopupBD",
  title: "TopupBD - Best Game Topup",
  logo: "https://picsum.photos/seed/logo/200/70",
  primaryColor: "#DC2626",
};

const mockSocialLinks: SocialLinks = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  telegram: "https://t.me",
  email: "support@topupbd.com",
  helpline: "01700000000"
};

const mockUser: User = {
  id: 1,
  name: "Rahat",
  balance: 1500,
  avatar: "https://picsum.photos/seed/user1/40/40",
  email: "rahat@example.com"
};

/**
 * Mock data for Home component
 */
const mockSlides: Slide[] = [
  { id: 1, image: "https://picsum.photos/seed/slide1/800/400", link: "#" },
  { id: 2, image: "https://picsum.photos/seed/slide2/800/400", link: "#" },
  { id: 3, image: "https://picsum.photos/seed/slide3/800/400", link: "#" },
];

const mockCategories: Category[] = [
  { id: 1, name: "Top Games", priority: 1, status: "active" },
  { id: 2, name: "New Arrivals", priority: 2, status: "active" },
];

const mockGames: Game[] = [
  { 
    id: 1, 
    name: "Free Fire", 
    image: "https://picsum.photos/seed/ff/200/200", 
    status: "active", 
    category_id: 1,
    type: "uid",
    check_uid: 1,
    description: "1. Enter your Player ID correctly.\n2. Select the amount of diamonds you want.\n3. Complete the payment.\n4. Diamonds will be added to your account instantly."
  },
  { 
    id: 2, 
    name: "PUBG Mobile", 
    image: "https://picsum.photos/seed/pubg/200/200", 
    status: "active", 
    category_id: 1,
    type: "uid",
    check_uid: 0,
    description: "Rules for PUBG Mobile topup."
  },
  { 
    id: 3, 
    name: "Mobile Legends", 
    image: "https://picsum.photos/seed/ml/200/200", 
    status: "active", 
    category_id: 1,
    type: "uid",
    check_uid: 1,
    description: "Rules for MLBB topup."
  },
  { 
    id: 4, 
    name: "Valorant", 
    image: "https://picsum.photos/seed/val/200/200", 
    status: "active", 
    category_id: 2,
    type: "uid",
    check_uid: 0,
    description: "Rules for Valorant topup."
  },
  { 
    id: 5, 
    name: "Genshin Impact", 
    image: "https://picsum.photos/seed/genshin/200/200", 
    status: "active", 
    category_id: 2,
    type: "uid",
    check_uid: 0,
    description: "Rules for Genshin topup."
  },
  { 
    id: 6, 
    name: "Minecraft", 
    image: "https://picsum.photos/seed/mc/200/200", 
    status: "active", 
    category_id: 0,
    type: "voucher",
    description: "Rules for Minecraft voucher."
  },
];

const mockProducts: Product[] = [
  { id: 1, name: "100 Diamonds", price: 85, status: 1 },
  { id: 2, name: "210 Diamonds", price: 170, status: 1 },
  { id: 3, name: "530 Diamonds", price: 420, status: 1 },
  { id: 4, name: "1080 Diamonds", price: 840, status: 1 },
  { id: 5, name: "2200 Diamonds", price: 1680, status: 1 },
  { id: 6, name: "Weekly Membership", price: 160, status: 1 },
  { id: 7, name: "Monthly Membership", price: 800, status: 0 },
];

const mockLatestOrders: Order[] = [
  { id: 1, user_name: "Rahat", user_image: "https://picsum.photos/seed/user1/40/40", product_name: "Free Fire 100 Diamonds", amount: 85.00, created_at: "2 mins ago" },
  { id: 2, user_name: "Sabbir", user_image: "https://picsum.photos/seed/user2/40/40", product_name: "PUBG 60 UC", amount: 95.00, created_at: "5 mins ago" },
  { id: 3, user_name: "Mitu", user_image: "https://picsum.photos/seed/user3/40/40", product_name: "Weekly Membership", amount: 160.00, created_at: "10 mins ago" },
  { id: 4, user_name: "Tanvir", user_image: "https://picsum.photos/seed/user4/40/40", product_name: "MLBB 50 Diamonds", amount: 45.00, created_at: "15 mins ago" },
  { id: 5, user_name: "Nabil", user_image: "https://picsum.photos/seed/user5/40/40", product_name: "Genshin Welkin", amount: 450.00, created_at: "20 mins ago" },
];

const mockPopup: PopupData = {
  image: "https://picsum.photos/seed/offer/400/300",
  text: "Special Offer! Get 10% extra diamonds on your first purchase today.",
  btnText: "See Offer",
  link: "#",
};

/**
 * Mock data for Transactions component
 */
const mockHistory: Transaction[] = [
  {
    id: 1024,
    user_id: 1,
    amount: 1500.00,
    payment_method: "bkash",
    order_txid: "TRX9283741",
    created_at: "2024-03-04T10:30:00Z",
    status: "Success",
    desc: "Order #1024",
    method: "bkash",
    txid: "TRX9283741"
  },
  {
    id: 1023,
    user_id: 1,
    amount: 450.50,
    payment_method: "Wallet",
    order_txid: "-",
    created_at: "2024-03-03T15:45:00Z",
    status: "Pending",
    desc: "Order #1023",
    method: "Wallet",
    txid: "-"
  }
];

const mockOrderDetails: OrderDetail[] = [
  {
    id: 1024,
    created_at: "2024-03-04T10:30:00Z",
    game_name: "Free Fire",
    product_name: "100 Diamonds",
    player_id: "123456789",
    amount: 85.00,
    status: 'completed',
    payment_method: 'wallet',
    quantity: 1
  },
  {
    id: 1025,
    created_at: "2024-03-04T11:00:00Z",
    game_name: "PUBG Mobile",
    product_name: "60 UC",
    player_id: "987654321",
    amount: 95.00,
    status: 'processing',
    payment_method: 'online',
    payment_number: '01712345678',
    quantity: 2
  },
  {
    id: 1026,
    created_at: "2024-03-04T11:30:00Z",
    game_name: "Mobile Legends",
    product_name: "50 Diamonds",
    player_id: "555666777",
    amount: 45.00,
    status: 'pending',
    payment_method: 'online',
    payment_number: '01812345678',
    quantity: 1
  },
  {
    id: 1027,
    created_at: "2024-03-04T12:00:00Z",
    game_name: "Garena Shells",
    product_name: "100 Shells",
    amount: 150.00,
    status: 'completed',
    payment_method: 'wallet',
    quantity: 1,
    is_voucher: true,
    codes: ["G-1234-5678-9012"]
  },
  {
    id: 1028,
    created_at: "2024-03-03T14:30:00Z",
    game_name: "Razer Gold",
    product_name: "$5 Pin",
    amount: 550.00,
    status: 'completed',
    payment_method: 'online',
    payment_number: '01912345678',
    quantity: 2,
    is_voucher: true,
    codes: ["R-9876-5432-1098", "R-1111-2222-3333"]
  }
];

const mockUserStats: UserStats = {
  support_pin: 54321,
  weekly_spent: 1250,
  total_spent: 15400,
  total_orders: 42
};

type AppView = 'home' | 'transactions' | 'addmoney' | 'orders' | 'profile' | 'game_detail' | 'auth' | 'checkout' | 'forgot_password' | 'reset_password' | 'payment_verify' | 'cart' | 'order_tracker';

const GameDetailRoute = ({ products, userBalance, isLoggedIn, onAuthRequired, onBack, onRefreshBalance, onPurchase }: any) => {
  const { id } = useParams();
  const game = mockGames.find(g => g.id === Number(id));
  if (!game) return <div className="p-8 text-center">Game not found</div>;
  return (
    <GameDetail 
      game={game}
      products={products}
      userBalance={userBalance}
      isLoggedIn={isLoggedIn}
      onAuthRequired={onAuthRequired}
      onBack={onBack}
      onRefreshBalance={onRefreshBalance}
      onPurchase={onPurchase}
    />
  );
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getViewFromPath = (): AppView => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/game/')) return 'game_detail';
    if (path.startsWith('/payment_verify')) return 'payment_verify';
    if (path.startsWith('/forgot_password')) return 'forgot_password';
    if (path.startsWith('/reset_password')) return 'reset_password';
    return path.substring(1) as AppView;
  };
  
  const view = getViewFromPath();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('bkash');
  
  // Notification State
  const [notif, setNotif] = useState<{
    isOpen: boolean;
    type: NotifType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const handleNavigate = (newView: AppView, state?: any) => {
    if (newView === view) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Auth Check
    const protectedViews: AppView[] = ['transactions', 'orders', 'profile', 'addmoney'];
    if (protectedViews.includes(newView) && !isLoggedIn) {
      navigate('/auth');
      return;
    }

    let path = `/${newView}`;
    if (newView === 'home') path = '/';
    navigate(path, { state });
  };

  const handleGameClick = (id: number) => {
    navigate(`/game/${id}`);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = () => {
    handleNavigate('auth', { isLogin: true });
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
    setNotif({
      isOpen: true,
      type: 'info',
      title: 'Logged Out',
      message: 'You have been successfully logged out.'
    });
    handleNavigate('home');
  };

  const handleRegister = () => {
    handleNavigate('auth', { isLogin: false });
    setIsSidebarOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setNotif({
      isOpen: true,
      type: 'success',
      title: 'Success',
      message: 'Welcome to TopupBD!'
    });
    handleNavigate('home');
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <PageLoader isLoading={isLoading} />
      
      {(view === 'home' || view === 'game_detail' || view === 'orders' || view === 'profile' || view === 'auth' || view === 'addmoney' || view === 'transactions' || view === 'forgot_password' || view === 'reset_password' || view === 'cart' || view === 'order_tracker') && (
        <Header 
          siteInfo={mockSiteInfo} 
          user={isLoggedIn ? mockUser : null} 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onBalanceClick={() => handleNavigate('addmoney')}
          onLogoClick={() => handleNavigate('home')}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={isLoggedIn ? mockUser : null}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onNavigate={(v) => handleNavigate(v as AppView)}
      />

      <DownloadPopup 
        siteName={mockSiteInfo.name}
        logo={mockSiteInfo.logo}
        downloadLink="https://example.com/app.apk"
      />

      <SupportButton socialLinks={mockSocialLinks} />

      <BottomNav 
        activeView={view} 
        onNavigate={handleNavigate} 
        user={isLoggedIn ? mockUser : null} 
      />

      <NotificationModal 
        isOpen={notif.isOpen}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif({ ...notif, isOpen: false })}
      />

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Home 
                noticeText="Welcome to our shop! Enjoy the best rates for all your favorite games. Fast delivery guaranteed."
                popup={mockPopup}
                slides={mockSlides}
                categories={mockCategories}
                games={mockGames}
                latestOrders={mockLatestOrders}
                onGameClick={handleGameClick}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/transactions" element={
            <>
              <Transactions onBack={() => handleNavigate('home')} onShopNow={() => handleNavigate('home')} />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/game/:id" element={
            <>
              <GameDetailRoute 
                products={mockProducts}
                userBalance={mockUser.balance}
                isLoggedIn={isLoggedIn}
                onAuthRequired={() => handleNavigate('auth')}
                onBack={() => handleNavigate('home')}
                onRefreshBalance={async () => mockUser.balance}
                onPurchase={(data: any) => {
                  console.log("Purchase data:", data);
                  setNotif({ isOpen: true, type: 'success', title: 'Order Placed', message: 'Your order has been placed successfully!' });
                  handleNavigate('home');
                }}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/orders" element={
            <>
              <Orders orders={mockOrderDetails} onBack={() => handleNavigate('home')} onPayNow={(id) => console.log("Pay now for order:", id)} />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/profile" element={
            <>
              <Profile 
                user={{ ...mockUser, email: "user@example.com", phone: "01700000000" }} 
                stats={mockUserStats}
                onRefresh={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/addmoney" element={
            <>
              <AddMoney 
                videoLink="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                onProceed={(amount, method) => { 
                  setCheckoutAmount(amount); 
                  setSelectedPaymentMethod(method);
                  handleNavigate('checkout'); 
                }}
                onViewTransactions={() => handleNavigate('transactions')}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/checkout" element={
            <Checkout 
              amount={checkoutAmount}
              siteName={mockSiteInfo.name}
              siteLogo={mockSiteInfo.logo}
              onBack={() => handleNavigate('home')}
              onCancel={() => handleNavigate('home')}
              onSelectMethod={(method) => { setSelectedPaymentMethod(method); handleNavigate('payment_verify'); }}
            />
          } />
          
          <Route path="/payment_verify" element={
            <PaymentVerify
              amount={checkoutAmount}
              initialMethod={selectedPaymentMethod}
              onBack={() => handleNavigate('checkout')}
              onSuccess={(trxId, amount) => {
                setNotif({ isOpen: true, type: 'success', title: 'Payment Successful', message: `Successfully added ৳${amount} to your wallet. TrxID: ${trxId}` });
                handleNavigate('home');
              }}
            />
          } />
          
          <Route path="/forgot_password" element={
            <>
              <ForgotPassword 
                onBackToLogin={() => handleNavigate('auth')}
                onSubmit={(email) => {
                  setNotif({ isOpen: true, type: 'success', title: 'Email Sent', message: `A password reset link has been sent to ${email}.` });
                  // Simulate redirecting to reset password for demo purposes
                  setTimeout(() => handleNavigate('reset_password'), 1500);
                }}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />

          <Route path="/reset_password" element={
            <>
              <ResetPassword 
                onBackToLogin={() => handleNavigate('auth')}
                onSubmit={(password) => {
                  setNotif({ isOpen: true, type: 'success', title: 'Password Reset', message: 'Your password has been successfully reset. You can now login.' });
                  handleNavigate('auth');
                }}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/auth" element={
            <>
              <Auth 
                siteName={mockSiteInfo.name}
                onLogin={handleAuthSuccess}
                onSignup={handleAuthSuccess}
                onForgotPassword={() => handleNavigate('forgot_password')}
                initialIsLogin={location.state?.isLogin ?? true}
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/cart" element={
            <>
              <Cart 
                onBack={() => handleNavigate('home')} 
                onCheckout={() => handleNavigate('checkout')} 
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="/order_tracker" element={
            <>
              <OrderTracker 
                onBack={() => handleNavigate('home')} 
              />
              <Footer logo={mockSiteInfo.logo} siteName={mockSiteInfo.name} socialLinks={mockSocialLinks} />
            </>
          } />
          
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-screwdriver-wrench text-3xl text-gray-400"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
              <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
              <button onClick={() => handleNavigate('home')} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold">Back to Home</button>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

