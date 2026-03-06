import React, { useState } from "react";
import { motion } from "motion/react";

export interface Voucher {
  id: number;
  code: string;
  game_name: string;
  product_name: string;
  game_image: string;
  order_id: number;
  amount: number;
  created_at: string;
}

interface CodesProps {
  vouchers: Voucher[];
  onBuyNow: () => void;
}

const Codes: React.FC<CodesProps> = ({ vouchers, onBuyNow }) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const totalSpent = vouchers.reduce((sum, v) => sum + v.amount, 0);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  return (
    <div className="container mx-auto px-2 py-6 mb-20 max-w-lg">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="main-card"
      >
        <div className="card-header-row">
          <div className="header-title-box">
            <img 
              src="https://img.icons8.com/?size=100&id=aVHe2jHuORcA&format=png&color=000000" 
              className="custom-icon" 
              alt="Icon" 
              referrerPolicy="no-referrer"
            />
            <h2 className="page-title">My Codes</h2>
          </div>
          <a 
            href="https://shop.garena.my/app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-redeem"
          >
            Redeem Site
          </a>
        </div>

        <div className="total-bar">
          Total Spent : <span className="text-primary font-bold">৳ {totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="voucher-list">
          {vouchers.length > 0 ? (
            vouchers.map((voucher) => (
              <div key={voucher.id} className="voucher-item">
                <div className="flex gap-3 items-center mb-1">
                  <img 
                    src={voucher.game_image} 
                    className="voucher-img" 
                    alt={voucher.game_name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{voucher.game_name}</h3>
                    <p className="text-[11px] text-gray-500 font-normal">{voucher.product_name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Order #{voucher.order_id}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary text-sm">৳ {voucher.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(voucher.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="code-container">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[9px] text-gray-400 uppercase font-semibold mb-0.5">REDEEM CODE</p>
                    <code className="code-text select-all break-all">{voucher.code}</code>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(voucher.code, voucher.id)} 
                    className="copy-btn"
                    style={copiedId === voucher.id ? { borderColor: 'var(--primary-color)', color: 'var(--primary-color)' } : {}}
                  >
                    <i className={copiedId === voucher.id ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center">
              <i className="fa-solid fa-ticket text-gray-300 text-4xl mb-3"></i>
              <p className="text-gray-500 font-medium text-sm mb-3">No codes found yet!</p>
              <button onClick={onBuyNow} className="btn-buy-now cursor-pointer">BUY NOW</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Codes;
