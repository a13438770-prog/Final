import React, { useState } from 'react';
import { ArrowLeft, Search, Package, CheckCircle2, Clock, Truck, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface OrderTrackerProps {
  onBack: () => void;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ onBack }) => {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Order ID cannot be empty.');
      return;
    }
    
    setError('');
    setIsSearching(true);
    // Mock API call
    setTimeout(() => {
      const isCompleted = orderId.toLowerCase().includes('comp') || orderId === '123456';
      setTrackedOrder({
        id: orderId,
        status: isCompleted ? 'completed' : 'processing',
        date: new Date().toLocaleDateString(),
        gameName: 'Free Fire',
        variationName: '100 Diamonds',
        quantity: 1,
        placedTime: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completedTime: isCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
        total: 85
      });
      setIsSearching(false);
      showToast("Order found", "success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-lg">
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors border border-red-100 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight font-bree">Order Tracker</h1>
              <p className="text-xs text-gray-500 mt-0.5">Check your order status</p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-4">
          <h2 className="font-bold text-gray-900 mb-2 font-bree flex items-center gap-2">
            <Search className="w-4 h-4 text-red-600" /> Track Your Order
          </h2>
          <p className="text-sm text-gray-500 mb-4">Enter your Order ID below to check the current status of your top-up.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. ORD-123456"
                  className={`w-full bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bree`}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-[#dc2626] hover:bg-red-700 disabled:bg-red-400 text-white px-5 rounded-lg font-bree text-sm transition-colors flex items-center justify-center min-w-[100px] shadow-sm"
              >
                {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Track'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs pl-1">{error}</p>}
          </form>
        </div>

        {/* Tracking Result */}
        {trackedOrder && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 font-bree">Order #{trackedOrder.id}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{trackedOrder.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                trackedOrder.status === 'completed' 
                  ? 'bg-green-50 text-green-600 border-green-100' 
                  : 'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {trackedOrder.status}
              </span>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm mb-3 font-bree border-b border-gray-200 pb-2">Order Details</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Product</p>
                  <p className="font-bold text-gray-900">{trackedOrder.gameName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Variation</p>
                  <p className="font-bold text-gray-900">{trackedOrder.variationName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                  <p className="font-bold text-gray-900">{trackedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                  <p className="font-bold text-red-600">৳{trackedOrder.total}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-green-500 text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-6">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900 text-sm font-bree">Order Placed</h4>
                      {trackedOrder.placedTime && <span className="text-xs font-bold text-gray-500">{trackedOrder.placedTime}</span>}
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5">We have received your order</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-6">
                  <Clock className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)]">
                  <div className="flex flex-col bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-blue-900 text-sm font-bree">Processing</h4>
                    <span className="text-xs text-blue-700 mt-0.5">Your top-up is being processed</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${trackedOrder.status === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'} shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-6`}>
                  <Package className="w-3 h-3" />
                </div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2.5rem)]">
                  <div className={`flex flex-col ${trackedOrder.status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'} p-3 rounded-lg border`}>
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold ${trackedOrder.status === 'completed' ? 'text-green-900' : 'text-gray-500'} text-sm font-bree`}>Completed</h4>
                      {trackedOrder.completedTime && <span className="text-xs font-bold text-green-700">{trackedOrder.completedTime}</span>}
                    </div>
                    <span className={`text-xs ${trackedOrder.status === 'completed' ? 'text-green-700' : 'text-gray-400'} mt-0.5`}>Top-up delivered successfully</span>
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
