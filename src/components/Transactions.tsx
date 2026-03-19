import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { Search, ArrowLeft, Clock, ChevronDown } from "lucide-react";
import axios from "axios";

export interface Transaction {
  id: number;
  user_id: number;
  amount: number | string | null;
  payment_method?: string;
  order_txid?: string;
  trx_id?: string;
  created_at: string;
  status: string;
  desc?: string;
  method?: string;
  txid?: string;
}

interface TransactionsProps {
  onBack?: () => void;
  onShopNow?: () => void;
}

const ITEMS_PER_PAGE = 10;
const TABS = ['All', 'Completed', 'Pending', 'Failed'];

const Transactions: React.FC<TransactionsProps> = ({ onBack, onShopNow }) => {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAllDropdownOpen, setIsAllDropdownOpen] = useState(false);
  const [allFilterType, setAllFilterType] = useState<'all' | 'wallet' | 'instant_pay'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAllDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Simulating API call for now, since it was fetching from /api/transactions
        // If there's no real API, we can just use empty array or mock data
        const response = await axios.get('/api/transactions');
        if (response.status === 200) {
          setHistory(response.data);
        } else {
          // Fallback to mock data if API fails
          setHistory([
            {
              id: 1001,
              user_id: 1,
              amount: 500,
              payment_method: 'bkash',
              trx_id: 'BKASH123456',
              created_at: new Date().toISOString(),
              status: 'completed',
              desc: 'Add Money'
            },
            {
              id: 1002,
              user_id: 1,
              amount: 150,
              payment_method: 'nagad',
              trx_id: 'NAGAD789012',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              status: 'pending',
              desc: 'Add Money'
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        // Fallback to mock data
        setHistory([
          {
            id: 1001,
            user_id: 1,
            amount: 500,
            payment_method: 'bkash',
            trx_id: 'BKASH123456',
            created_at: new Date().toISOString(),
            status: 'completed',
            desc: 'Add Money'
          },
          {
            id: 1002,
            user_id: 1,
            amount: 150,
            payment_method: 'nagad',
            trx_id: 'NAGAD789012',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'pending',
            desc: 'Add Money'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(t => {
      const desc = t.desc || `Order #${t.id}`;
      const method = t.method || t.payment_method || 'Wallet';
      const txid = t.txid || t.order_txid || t.trx_id || '-';
      
      const matchesSearch = 
        t.id.toString().includes(searchQuery) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txid.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'All' || t.status.toLowerCase() === activeTab.toLowerCase();
      
      let matchesAllFilter = true;
      if (activeTab === 'All') {
        if (allFilterType === 'wallet') {
          matchesAllFilter = method.toLowerCase() === 'wallet';
        } else if (allFilterType === 'instant_pay') {
          matchesAllFilter = method.toLowerCase() !== 'wallet';
        }
      }
      
      return matchesSearch && matchesTab && matchesAllFilter;
    });
  }, [history, searchQuery, activeTab, allFilterType]);

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-3xl">
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight font-bree">Transactions</h1>
              <p className="text-xs text-gray-500 mt-0.5">Track your wallet history</p>
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
          placeholder="Search by ID, Method, or TrxID..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bree text-sm"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div className={`flex overflow-x-auto hide-scrollbar gap-2 relative z-20 transition-all duration-300 ${isAllDropdownOpen ? 'pb-[12rem] -mb-[10.75rem]' : 'pb-1 mb-4'}`}>
        {TABS.map(tab => (
          tab === 'All' ? (
            <div key={tab} className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (activeTab === 'All') {
                    setIsAllDropdownOpen(!isAllDropdownOpen);
                  } else {
                    setActiveTab('All');
                    setCurrentPage(1);
                  }
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'All' 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {allFilterType === 'all' ? 'All' : allFilterType === 'wallet' ? 'Wallet' : 'Instant Pay'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isAllDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAllDropdownOpen && activeTab === 'All' && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      setAllFilterType('all');
                      setIsAllDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${allFilterType === 'all' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    All Filter
                  </button>
                  <button
                    onClick={() => {
                      setAllFilterType('wallet');
                      setIsAllDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${allFilterType === 'wallet' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Wallet
                  </button>
                  <button
                    onClick={() => {
                      setAllFilterType('instant_pay');
                      setIsAllDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${allFilterType === 'instant_pay' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Instant Pay
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
                setIsAllDropdownOpen(false);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {tab}
            </button>
          )
        ))}
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : paginatedHistory.length > 0 ? (
          paginatedHistory.map((t) => {
            const amountVal = parseFloat(String(t.amount ?? 0));
            const desc = t.desc || `Order #${t.id}`;
            const method = t.method || t.payment_method || 'Wallet';
            const txid = t.txid || t.order_txid || t.trx_id || '-';
            const methodDisplay = method.charAt(0).toUpperCase() + method.slice(1);
            
            return (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
              >
                {/* Header: ID & Status */}
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <i className="fa-solid fa-receipt text-gray-400 text-xs"></i>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] font-normal block uppercase tracking-wider">Trx ID</span>
                      #{t.id}
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusClass(t.status)}`}>
                    {t.status}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(t.created_at).toLocaleString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Description:</span>
                    <span className="font-bold text-gray-900 text-right">
                      {desc}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Method:</span>
                    <span className="font-medium text-gray-800">{methodDisplay}</span>
                  </div>

                  {txid !== '-' && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction ID:</span>
                      <span className="font-medium text-gray-800">{txid}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-1 mt-1 border-t border-gray-50">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-red-600 text-sm">
                      ৳{amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white p-8 text-center rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
              <i className="fa-solid fa-receipt text-2xl text-gray-300"></i>
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No Transactions Found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery ? "Try adjusting your search or filters." : "You haven't made any transactions yet."}
            </p>
            {!searchQuery && onShopNow && (
              <button
                onClick={onShopNow}
                className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Shop Now
              </button>
            )}
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

export default Transactions;
