import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../context/ToastContext";
import axios from "axios";

export interface Product {
  id: number;
  name: string;
  price: number;
  status: number;
  badge?: string;
}

interface GameDetailProps {
  game: {
    id: number;
    name: string;
    image: string;
    type: string;
    hint_text?: string;
    check_uid?: number;
    description?: string;
  };
  products: Product[];
  userBalance: number;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
  onBack: () => void;
  onRefreshBalance: () => Promise<number>;
  onPurchase: (data: {
    productId: number;
    playerId: string;
    paymentMethod: 'wallet' | 'online';
  }) => void;
  onAddToCart?: (data: {
    productId: number;
    playerId: string;
    quantity: number;
    productName: string;
    price: number;
    gameName: string;
    image: string;
  }) => void;
}

const GameDetail: React.FC<GameDetailProps> = ({ 
  game, 
  products, 
  userBalance, 
  isLoggedIn,
  onAuthRequired,
  onBack, 
  onRefreshBalance,
  onPurchase,
  onAddToCart
}) => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'online'>('wallet');
  const [isCheckingUid, setIsCheckingUid] = useState(false);
  const [checkedName, setCheckedName] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'guide' | 'rules'>('description');
  const { showToast } = useToast();

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const gameType = game.type.toLowerCase().trim();
  const isVoucher = gameType === 'voucher';
  const isUidCheckEnabled = game.check_uid === 1;
  const totalPrice = (selectedProduct?.price || 0) * quantity;

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    await onRefreshBalance();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const checkUidName = async () => {
    if (!playerId.trim()) {
      showToast("দয়া করে প্রয়োজনীয় তথ্য দিন", "error");
      setErrors({ ...errors, playerId: "দয়া করে প্রয়োজনীয় তথ্য দিন" });
      return;
    }

    setIsCheckingUid(true);
    setCheckedName(null);

    try {
      // Mocking the API call as we don't have the backend endpoint here
      // In a real app, this would be a fetch to the PHP endpoint or a direct API call
      const response = await axios.get(`https://bhauxinfo2.vercel.app/bhau?uid=${playerId}&region=BD`);
      const data = response.data;
      
      if (data.basicInfo?.nickname) {
        setCheckedName(data.basicInfo.nickname);
      } else {
        setCheckedName("Player Not Found");
        setTimeout(() => setCheckedName(null), 3000);
      }
    } catch (error) {
      setCheckedName("Error Checking");
      setTimeout(() => setCheckedName(null), 3000);
    } finally {
      setIsCheckingUid(false);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedProductId) {
      newErrors.product = "অনুগ্রহ করে একটি প্যাকেজ সিলেক্ট করুন";
      showToast("অনুগ্রহ করে একটি প্যাকেজ সিলেক্ট করুন", "error");
    } else if (!isVoucher && !playerId.trim()) {
      newErrors.playerId = "দয়া করে প্রয়োজনীয় তথ্য দিন";
      showToast("দয়া করে প্রয়োজনীয় তথ্য দিন", "error");
    } else if (paymentMethod === 'wallet' && selectedProduct && userBalance < totalPrice) {
      newErrors.balance = "আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!";
      showToast("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!", "error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    const newErrors: { [key: string]: string } = {};
    if (!selectedProductId) {
      newErrors.product = "Please select a package";
      showToast("Please select a package", "error");
    } else if (!isVoucher && !playerId.trim()) {
      newErrors.playerId = "Player ID is required";
      showToast("Player ID is required", "error");
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onAddToCart && selectedProduct) {
      onAddToCart({
        productId: selectedProduct.id,
        playerId: isVoucher ? '' : playerId,
        quantity: quantity,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        gameName: game.name,
        image: game.image
      });
      // Optional: show a success message or toast here
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    if (validate()) {
      if (paymentMethod === 'wallet') {
        setShowConfirm(true);
      } else {
        onPurchase({
          productId: selectedProductId!,
          playerId: isVoucher ? 'Voucher_Request_No_ID' : playerId,
          paymentMethod: 'online',
          quantity: quantity
        });
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setQuantity(val);
    } else if (e.target.value === '') {
      setQuantity(0); // Allow temporary empty state for typing
    }
  };

  const incrementQuantity = () => setQuantity(prev => (prev === 0 ? 1 : prev + 1));
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleQuantityBlur = () => {
    if (quantity === 0) setQuantity(1);
  };

  const confirmPurchase = () => {
    setShowConfirm(false);
    onPurchase({
      productId: selectedProductId!,
      playerId: isVoucher ? 'Voucher_Request_No_ID' : playerId,
      paymentMethod: 'wallet',
      quantity: quantity
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Column */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3">
            {/* Product Info Card */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/backgrounds/bg.png')] opacity-15 bg-cover bg-center"></div>
              <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-gray-100 flex-shrink-0 relative z-10">
                <img src={game.image} className="w-full h-full object-cover" alt={game.name} referrerPolicy="no-referrer" />
              </div>
              <div className="relative z-10">
                <h1 className="text-gray-900 font-bree text-xl md:text-2xl mb-1 leading-tight">{game.name}</h1>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    {game.type === 'uid' ? 'UID Topup' : game.type === 'voucher' ? 'Voucher' : 'Subscription'}
                  </span>
                  <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                    <i className="fa-solid fa-bolt mr-1"></i> Instant
                  </span>
                </div>
              </div>
            </div>

            {/* Rules & Conditions (Desktop) */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'description' ? 'text-[#dc2626] border-b-2 border-[#dc2626] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('guide')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'guide' ? 'text-[#dc2626] border-b-2 border-[#dc2626] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Buying Guide
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'rules' ? 'text-[#dc2626] border-b-2 border-[#dc2626] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Rules
                </button>
              </div>
              <div className="p-3 text-xs text-gray-700 leading-relaxed space-y-2 notice-content whitespace-pre-wrap break-words min-h-[100px]">
                {activeTab === 'description' && (game.description || "No description available.")}
                {activeTab === 'guide' && "1. Select your desired package.\n2. Enter your correct Player ID.\n3. Choose your payment method.\n4. Click Buy Now to complete the purchase."}
                {activeTab === 'rules' && "1. Double check your Player ID before purchasing.\n2. Purchases are final and non-refundable.\n3. Delivery is usually instant but may take up to 10 minutes."}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit}>
        {/* Step 1: Select Package */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <h3 className="font-bree text-gray-800 text-base flex items-center gap-2">
              <span className="step-badge" style={{ width: '24px', height: '24px', fontSize: '14px' }}>1</span> Select Package
            </h3>
            <a href="#" className="text-xs text-[#dc2626] hover:underline flex items-center gap-1 font-bangla font-semibold">
              <i className="fa-brands fa-youtube"></i> Tutorial ?
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 pt-2">
            {products.map((prod) => {
              const isActive = prod.status === 1;
              const badgeText = prod.badge || (!isActive ? 'STOCK OUT' : null);
              
              return (
                <label key={prod.id} className={`${isActive ? 'cursor-pointer' : 'cursor-not-allowed'} relative group select-none flex flex-col h-full pt-2`}>
                  <input 
                    type="radio" 
                    name="product_id" 
                    value={prod.id} 
                    checked={selectedProductId === prod.id}
                    onChange={() => setSelectedProductId(prod.id)}
                    className="pkg-radio sr-only" 
                    disabled={!isActive}
                  />
                  
                  {badgeText && (
                    <div className={`absolute top-0 left-2.5 w-fit max-w-[calc(100%-20px)] overflow-hidden text-ellipsis text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-30 shadow-sm whitespace-nowrap leading-tight ${
                      badgeText.toLowerCase() === 'stock out' ? 'bg-gray-500' : 'bg-[#dc2626]'
                    }`}>
                      {badgeText}
                    </div>
                  )}
                  
                  <div className="pkg-card py-1.5 px-1.5 flex-1 w-full flex flex-col justify-center items-center relative">
                    {selectedProductId === prod.id && (
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#dc2626] text-sm z-10">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                    )}
                    <span className="pkg-title font-bree text-center block px-4 pt-0.5 leading-tight">
                      {prod.name}
                    </span>
                    <span className="pkg-price font-bree text-[11px] mt-0.5">
                      BDT {prod.price.toLocaleString()}
                    </span>
                    
                    {!isActive && (
                      <div className="absolute inset-0 z-20 cursor-not-allowed bg-white/50 rounded-lg"></div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          
          {errors.product && (
            <div className="error-msg-box flex mt-2">
              <i className="fa-solid fa-circle-exclamation"></i> {errors.product}
            </div>
          )}
        </div>

        {/* Step 2: Account Info */}
        {!isVoucher && (
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
            <h3 className="font-bree text-gray-800 text-base mb-3 flex items-center gap-2 border-b pb-2">
              <span className="step-badge" style={{ width: '24px', height: '24px', fontSize: '14px' }}>2</span> Account Info
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1.5 font-bangla font-semibold">
                  {gameType === 'subscription' ? (game.hint_text || 'Enter Player ID') : 'এখানে প্লেয়ার আইডি কোড দিন'}
                </label>
                
                <input 
                  type="text" 
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  placeholder={gameType === 'subscription' ? 'Type here...' : 'এখানে প্লেয়ার আইডি কোড দিন'} 
                  className={`w-full border ${errors.playerId ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-gray-300'} rounded-lg p-2.5 text-sm font-bangla focus:outline-none focus:border-[#dc2626]`} 
                  autoComplete="off"
                />
                
                {errors.playerId && (
                  <div className="error-msg-box flex mt-2">
                    <i className="fa-solid fa-circle-exclamation"></i> {errors.playerId}
                  </div>
                )}
              </div>
              
              {gameType === 'uid' && isUidCheckEnabled && (
                <button 
                  type="button" 
                  onClick={checkUidName}
                  disabled={isCheckingUid}
                  className="w-full bg-[#0047ab] text-white py-1.5 rounded-lg font-bangla text-xs font-semibold hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {isCheckingUid ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Checking...</>
                  ) : (
                    checkedName || 'আপনার গেম আইডির নাম চেক করুন'
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Payment Method */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3">
          <h3 className="font-bree text-gray-800 text-base mb-3 flex items-center gap-2 border-b pb-2">
            <span className="step-badge" style={{ width: '24px', height: '24px', fontSize: '14px' }}>3</span> Payment Methods
          </h3>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <label className="cursor-pointer relative group select-none">
              <input 
                type="radio" 
                name="payment_method" 
                value="wallet" 
                checked={paymentMethod === 'wallet'}
                onChange={() => setPaymentMethod('wallet')}
                className="pay-radio sr-only"
              />
              <div className={`pkg-card h-28 flex flex-col relative overflow-hidden rounded-lg bg-white ${paymentMethod === 'wallet' ? 'border-[#dc2626] outline outline-2 outline-[#dc2626] shadow-[0_0_0_2px_#dc2626]' : 'border-gray-300 border'}`}>
                <div className="flex-1 relative">
                  {!isLoggedIn ? (
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                      <span className="text-gray-500 font-bold text-sm">Login required</span>
                    </div>
                  ) : (
                    <img src="https://ais-dev-nofag6mtpb7ssbqxxcqxzf-8795195565.asia-southeast1.run.app/res/images/walletpay.png" className="absolute inset-0 w-full h-full object-cover object-center" alt="Wallet" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/wallet/150/60'; }} />
                  )}
                </div>
                <div className="bg-[#e9ecef] pt-1 pb-1.5 px-2 border-t border-gray-200 flex items-end justify-start">
                  <span className="font-bree text-gray-700 text-xs font-bold leading-none">
                    {isLoggedIn ? `Wallet Pay - ${userBalance.toFixed(0)}৳` : 'Wallet Pay'}
                  </span>
                </div>
                {paymentMethod === 'wallet' && (
                  <div className="absolute right-2 top-2 text-white text-sm z-10 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                )}
              </div>
            </label>

            <label className="cursor-pointer relative group select-none">
              <input 
                type="radio" 
                name="payment_method" 
                value="online" 
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
                className="pay-radio sr-only"
              />
              <div className={`pkg-card h-28 flex flex-col relative overflow-hidden rounded-lg bg-white ${paymentMethod === 'online' ? 'border-[#dc2626] outline outline-2 outline-[#dc2626] shadow-[0_0_0_2px_#dc2626]' : 'border-gray-300 border'}`}>
                <div className="flex-1 relative">
                  <img src="https://ais-dev-nofag6mtpb7ssbqxxcqxzf-8795195565.asia-southeast1.run.app/res/images/instantpay.png" className="absolute inset-0 w-full h-full object-cover object-center" alt="Instant" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/instant/150/60'; }} />
                </div>
                <div className="bg-[#e9ecef] pt-1 pb-1.5 px-2 border-t border-gray-200 flex items-end justify-start">
                  <span className="font-bree text-gray-700 text-xs font-bold leading-none">
                    Instant Pay
                  </span>
                </div>
                {paymentMethod === 'online' && (
                  <div className="absolute right-2 top-2 text-white text-sm z-10 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 font-bree">Quantity:</span>
              <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden h-8">
                <button 
                  type="button" 
                  onClick={decrementQuantity}
                  className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-minus text-xs"></i>
                </button>
                <input 
                  type="number" 
                  value={quantity === 0 ? '' : quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  className="w-12 h-full text-center text-sm font-bold text-gray-800 border-x border-gray-300 focus:outline-none appearance-none"
                  min="1"
                />
                <button 
                  type="button" 
                  onClick={incrementQuantity}
                  className="w-8 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total Amount</div>
              <div className="text-base font-black text-[#dc2626] font-bree leading-none">
                ৳ {totalPrice.toLocaleString()}
              </div>
            </div>
          </div>
          
          {errors.balance && (
            <div className="error-msg-box flex mb-3">
              <i className="fa-solid fa-circle-exclamation"></i> {errors.balance}
            </div>
          )}

          <div className="flex gap-2">
            <button 
              type="button"
              onClick={handleAddToCart}
              className="w-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bree py-2.5 rounded-lg shadow-sm transition-all active:scale-95 text-base flex items-center justify-center flex-shrink-0 border border-gray-200"
              title="Add to Cart"
            >
              <i className="fa-solid fa-cart-plus"></i>
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-[#dc2626] hover:opacity-90 text-white font-bree py-2.5 rounded-lg shadow-md transition-all active:scale-95 text-base tracking-wide flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Rules & Conditions (Mobile) */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'description' ? 'text-[#dc2626] border-b-2 border-[#dc2626] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'guide' ? 'text-[#dc2626] border-b-2 border-[#dc2626] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Buying Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'rules' ? 'text-[#dc2626] border-b-2 border-[#dc2626] bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Rules
            </button>
          </div>
          <div className="p-3 text-xs text-gray-700 leading-relaxed space-y-2 notice-content whitespace-pre-wrap break-words min-h-[100px]">
            {activeTab === 'description' && (game.description || "No description available.")}
            {activeTab === 'guide' && "1. Select your desired package.\n2. Enter your correct Player ID.\n3. Choose your payment method.\n4. Click Buy Now to complete the purchase."}
            {activeTab === 'rules' && "1. Double check your Player ID before purchasing.\n2. Purchases are final and non-refundable.\n3. Delivery is usually instant but may take up to 10 minutes."}
          </div>
        </div>
      </form>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 px-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 shadow-2xl relative sharp-popup w-full max-w-[340px]"
            >
              <div className="w-full flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4 text-[#dc2626]"><i className="fa-solid fa-circle-question"></i></div>
                <h2 className="text-xl font-black mb-2 uppercase tracking-wide text-gray-900 font-lato">Confirm Purchase?</h2>
                <div className="text-gray-600 text-xs mb-6 font-bold leading-relaxed px-2">
                  <p>Package: {selectedProduct?.name}</p>
                  <p>Total: ৳{selectedProduct?.price}</p>
                  {!isVoucher && <p>Details: {playerId}</p>}
                </div>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => setShowConfirm(false)} 
                    className="flex-1 py-3 text-gray-800 sharp-btn bg-gray-200"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={confirmPurchase} 
                    className="flex-1 py-3 text-white sharp-btn bg-[#dc2626]"
                  >
                    CONFIRM
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameDetail;
