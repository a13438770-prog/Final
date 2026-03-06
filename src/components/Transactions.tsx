import React, { useState, useEffect } from "react";

/**
 * Interface for a single transaction record.
 * Maps to the database structure from the original PHP code.
 */
export interface Transaction {
  id: number;
  user_id: number;
  amount: number | string | null;
  payment_method?: string;
  order_txid?: string;
  trx_id?: string;
  created_at: string;
  status: string;
  // Mapped fields
  desc?: string;
  method?: string;
  txid?: string;
}

interface TransactionsProps {
  /** Callback for the back button */
  onBack?: () => void;
  /** Callback for the "Shop Now" button in empty state */
  onShopNow?: () => void;
}



/**
 * Transaction Card Component
 */
const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  // Logic from PHP: Fix Amount NULL Error
  const amountVal = parseFloat(String(transaction.amount ?? 0));
  
  // Logic from PHP: Colors
  const amountColor = 'text-red-500'; // Default debit
  const sign = '-';
  
  // Logic from PHP: Icon Settings
  const iconClass = 'fa-bag-shopping';
  const iconBg = 'bg-blue-50 text-[#2B71AD]';

  // Logic from PHP: Display Method formatting
  // Map fields if they exist, or set defaults
  const desc = transaction.desc || `Order #${transaction.id}`;
  const method = transaction.method || transaction.payment_method || 'Wallet';
  const txid = transaction.txid || transaction.order_txid || transaction.trx_id || '-';

  const methodDisplay = method.charAt(0).toUpperCase() + method.slice(1);
  const trxDisplay = txid !== '-' ? `Trx: ${txid}` : '';

  // Date formatting
  const formattedDate = new Date(transaction.created_at).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(',', '');

  return (
    <div className="trans-card">
      <div className="flex gap-3 overflow-hidden w-full">
        <div className={`icon-box ${iconBg}`}>
          <i className={`fa-solid ${iconClass}`}></i>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-gray-800 text-sm truncate">
            {desc}
          </h4>
          
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="detail-tag text-xs border border-gray-200">
              <i className="fa-solid fa-hashtag mr-1"></i>
              {transaction.id}
            </span>
            {methodDisplay && (
              <span className="detail-tag text-xs border border-gray-200">
                <i className="fa-regular fa-credit-card mr-1"></i>
                {methodDisplay}
              </span>
            )}
            
            {trxDisplay && (
              <span className="detail-tag text-xs border border-gray-200">
                <i className="fa-solid fa-receipt mr-1"></i>
                {trxDisplay}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'sans-serif' }}>
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-2">
        <div className={`text-base ${amountColor}`}>
          {sign}{amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ৳
        </div>
        <div className="mt-1">
          <span className={`status-badge st-${transaction.status.toLowerCase()}`}>
            {transaction.status}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Empty State Component
 */
const EmptyState: React.FC<{ onShopNow?: () => void }> = ({ onShopNow }) => (
  <div className="flex flex-col items-center justify-center mt-32 opacity-70">
    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
      <i className="fa-solid fa-receipt text-4xl text-gray-300"></i>
    </div>
    <h3 className="text-lg text-gray-600">No Transactions</h3>
    <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: 'sans-serif' }}>
      You haven't made any orders yet.
    </p>
    <button
      onClick={onShopNow}
      className="mt-6 bg-[#2B71AD] text-white px-6 py-2 rounded-full text-sm shadow-sm hover:opacity-90 transition cursor-pointer"
    >
      Shop Now
    </button>
  </div>
);

/**
 * Main Transactions Component
 */
const Transactions: React.FC<TransactionsProps> = (props) => {
  const { onBack, onShopNow } = props;
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto px-2 py-8 mb-20 max-w-lg">
      <div className="main-card">
        <div className="card-header">
          <i className="fa-solid fa-clock-rotate-left"></i> Transaction History
        </div>

        <div className="flex flex-col mt-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : history && history.length > 0 ? (
            history.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))
          ) : (
            <EmptyState onShopNow={onShopNow} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
