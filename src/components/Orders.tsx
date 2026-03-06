import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Copy, CheckCircle, ExternalLink, ArrowLeft, LayoutGrid } from "lucide-react";

export interface OrderDetail {
  id: number;
  created_at: string;
  game_name: string;
  product_name: string;
  player_id?: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_method: string;
  quantity?: number;
  payment_number?: string;
  is_voucher?: boolean;
  codes?: string[];
}

interface OrdersProps {
  orders: OrderDetail[];
  onBack: () => void;
  onPayNow: (orderId: number) => void;
}

const ITEMS_PER_PAGE = 5;
const TABS = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const Orders: React.FC<OrdersProps> = ({ orders, onBack, onPayNow }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyAll = (codes: string[]) => {
    const text = codes.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCode('all');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toString().includes(searchQuery) ||
        order.game_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.player_id && order.player_id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTab = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
      
      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
              <LayoutGrid className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight font-bree">Order Tracker</h1>
              <p className="text-xs text-gray-500 mt-0.5">Track your past purchases</p>
            </div>
          </div>
        </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Order ID, Game, Package, or UID..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bree text-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-4 pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-200"
            >
              {/* Header: Order ID & Status */}
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <i className="fa-solid fa-box text-gray-400 text-xs"></i>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] font-normal block uppercase tracking-wider">Order ID</span>
                    #{order.id}
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-1.5 text-xs mb-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date & Time:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(order.created_at).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Product:</span>
                  <span className="font-bold text-gray-900 text-right">
                    {order.game_name} <span className="text-gray-400 mx-1">|</span> <span className="text-red-600">{order.product_name}</span>
                  </span>
                </div>

                {order.player_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Info (UID):</span>
                    <span className="font-medium text-gray-800">{order.player_id}</span>
                  </div>
                )}

                {order.quantity && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-medium text-gray-800">{order.quantity}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Price:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">৳{order.amount.toLocaleString()}</span>
                    {order.payment_method === 'wallet' && (
                      <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <i className="fa-solid fa-wallet"></i> Wallet
                      </span>
                    )}
                  </div>
                </div>

                {order.payment_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Number:</span>
                    <span className="font-medium text-gray-800">{order.payment_number}</span>
                  </div>
                )}
              </div>

              {/* Voucher / Redeem Codes Section */}
              {order.is_voucher && order.codes && order.codes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
                    <i className="fa-solid fa-ticket text-red-500"></i> Redeem Codes
                  </div>
                  
                  <div className="bg-gray-50 rounded-md border border-gray-200 mb-2 divide-y divide-gray-200">
                    {order.codes.map((code, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2">
                        <code className="text-xs font-mono font-bold text-gray-800 tracking-wider">{code}</code>
                        <button 
                          onClick={() => handleCopy(code)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === code ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open('https://shop.garena.my/app', '_blank')}
                      className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-md text-xs font-bold border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Redeem Now
                    </button>
                    {order.codes.length > 1 && (
                      <button 
                        onClick={() => handleCopyAll(order.codes!)}
                        className="flex-1 bg-gray-900 text-white py-1.5 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {copiedCode === 'all' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCode === 'all' ? 'Copied!' : 'Copy All'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Pay Now Button for Pending Online Orders */}
              {order.status === 'pending' && order.payment_method !== 'wallet' && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button 
                    onClick={() => onPayNow(order.id)} 
                    className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
              <i className="fa-solid fa-box-open text-2xl text-gray-300"></i>
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No Orders Found</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery ? "Try adjusting your search or filters." : "You haven't placed any orders yet."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 shadow-sm"
          >
            <i className="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50 shadow-sm"
          >
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Orders;
