import React from 'react';
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onBack, onCheckout }) => {
  // Mock cart items
  const cartItems = [
    { id: 1, name: 'Free Fire 100 Diamonds', price: 85, quantity: 1, image: 'https://picsum.photos/seed/ff/100/100' },
    { id: 2, name: 'PUBG 60 UC', price: 95, quantity: 2, image: 'https://picsum.photos/seed/pubg/100/100' }
  ];

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-lg">
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors border border-red-100 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
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
                      <h3 className="font-bold text-gray-900 text-sm font-bree">{item.name}</h3>
                      <p className="text-red-600 font-black mt-1">৳{item.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                        <button className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:text-red-600 transition-colors">-</button>
                        <span className="text-sm font-bold w-4 text-center text-gray-900">{item.quantity}</span>
                        <button className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold hover:text-red-600 transition-colors">+</button>
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors border border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mt-4">
                <h3 className="font-bold text-gray-900 mb-3 font-bree flex items-center gap-2">
                  <i className="fa-solid fa-receipt text-red-600"></i> Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Subtotal ({cartItems.length} items)</span>
                    <span className="font-bold text-gray-900">৳{total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Processing Fee</span>
                    <span className="font-bold text-gray-900">৳0</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl font-black text-red-600 font-bree">৳{total}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={onCheckout}
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
