import React, { useState } from 'react';
import { ArrowLeft, Search, Package, CheckCircle2, Clock, Truck } from 'lucide-react';

interface OrderTrackerProps {
  onBack: () => void;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ onBack }) => {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsSearching(true);
    // Mock API call
    setTimeout(() => {
      setTrackedOrder({
        id: orderId,
        status: 'processing',
        date: new Date().toLocaleDateString(),
        items: ['Free Fire 100 Diamonds'],
        total: 85
      });
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-[56px]">

      <div className="p-4">
        {/* Search Box */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-800 mb-2">Track Your Order</h2>
          <p className="text-sm text-gray-500 mb-4">Enter your Order ID below to check the current status of your top-up.</p>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ORD-123456"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button 
              type="submit"
              disabled={isSearching || !orderId.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center min-w-[100px]"
            >
              {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Track'}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {trackedOrder && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-800">Order #{trackedOrder.id}</h3>
                <p className="text-sm text-gray-500 mt-1">{trackedOrder.date}</p>
              </div>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {trackedOrder.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-6">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-800 text-sm">Order Placed</h4>
                    <span className="text-xs text-gray-500 mt-0.5">We have received your order</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-6">
                  <Clock className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-800 text-sm">Processing</h4>
                    <span className="text-xs text-gray-500 mt-0.5">Your top-up is being processed</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-gray-200 text-gray-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-6">
                  <Package className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-gray-400 text-sm">Completed</h4>
                    <span className="text-xs text-gray-400 mt-0.5">Top-up delivered successfully</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
