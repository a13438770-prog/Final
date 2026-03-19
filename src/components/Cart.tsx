import React, { useState } from 'react';
import { ArrowLeft, Trash2, ShoppingCart, Tag } from 'lucide-react';

import { CartItem } from '../App';
import { useToast } from '../context/ToastContext';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onBack: () => void;
  onCheckout: (amount: number) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onBack, onCheckout }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);
  const { showToast } = useToast();

  const handleRemove = (id: string) => {
    onRemoveItem(id);
    showToast("Item removed from cart", "info");
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      showToast("Please enter a coupon code", "error");
      return;
    }

    // Mock coupon validation
    if (couponCode.toUpperCase() === 'DISCOUNT10') {
      const discount = subtotal * 0.1; // 10% discount
      setDiscountAmount(discount);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode('');
      showToast(`Coupon applied! You saved ৳${discount.toFixed(2)}`, "success");
    } else if (couponCode.toUpperCase() === 'FLAT50') {
      const discount = 50; // Flat 50 discount
      setDiscountAmount(discount);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode('');
      showToast(`Coupon applied! You saved ৳${discount.toFixed(2)}`, "success");
    } else {
      showToast("Invalid or expired coupon code", "error");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-3xl">
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight font-bree">My Cart</h1>
              <p className="text-xs text-gray-500 mt-0.5">Review your items</p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-3 flex gap-4 shadow-sm border border-gray-200">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">{item.gameName}</p>
                      <h3 className="font-bold text-gray-900 text-sm font-bree">{item.name}</h3>
                      <p className="text-red-600 font-black mt-1">৳{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:text-red-600 transition-colors"
                        >-</button>
                        <span className="text-sm font-bold w-4 text-center text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:text-red-600 transition-colors"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors border border-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-4 overflow-hidden">
                <button 
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className="w-full p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-gray-900 font-bree">Have a coupon?</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {appliedCoupon && (
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                        {appliedCoupon}
                      </span>
                    )}
                    <i className={`fa-solid fa-chevron-${isCouponOpen ? 'up' : 'down'} text-gray-400`}></i>
                  </div>
                </button>
                
                {isCouponOpen && (
                  <div className="p-4 pt-2 border-t border-gray-50">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <i className="fa-solid fa-check"></i>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-green-800">{appliedCoupon}</p>
                            <p className="text-xs text-green-600">Coupon applied successfully</p>
                          </div>
                        </div>
                        <button 
                          onClick={handleRemoveCoupon}
                          className="text-red-500 hover:text-red-700 text-sm font-bold px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter coupon code" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium uppercase"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap"
                          >
                            Apply
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <i className="fa-solid fa-circle-info"></i> Try <span className="font-bold text-gray-700">DISCOUNT10</span> or <span className="font-bold text-gray-700">FLAT50</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mt-4">
                <h3 className="font-bold text-gray-900 mb-3 font-bree flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-red-600"></i> Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold text-gray-900">৳{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <span className="font-medium">Discount ({appliedCoupon})</span>
                      <span className="font-bold">-৳{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Processing Fee</span>
                    <span className="font-bold text-gray-900">৳0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-black text-red-600 font-bree">৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={() => onCheckout(total)}
                className="w-full bg-[#dc2626] hover:opacity-90 text-white font-bree py-3.5 rounded-xl shadow-sm transition-all active:scale-95 text-base tracking-wide mt-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <i className="fa-solid fa-arrow-right text-sm"></i>
              </button>
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200 mt-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <ShoppingCart className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 font-bree">Your cart is empty</h2>
              <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added anything to your cart yet.</p>
              <button 
                onClick={onBack} 
                className="bg-red-50 text-red-600 border border-red-100 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
