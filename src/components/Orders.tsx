import React from "react";
import { motion } from "motion/react";

export interface OrderDetail {
  id: number;
  created_at: string;
  game_name: string;
  product_name: string;
  player_id?: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_method: string;
}

interface OrdersProps {
  orders: OrderDetail[];
  onBack: () => void;
  onPayNow: (orderId: number) => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, onBack, onPayNow }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'st-completed';
      case 'processing': return 'st-processing';
      case 'cancelled': return 'st-cancelled';
      default: return 'st-pending';
    }
  };

  return (
    <div className="container mx-auto px-2 py-8 mb-20 max-w-lg">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="main-card"
      >
        <div className="card-header">
          <i className="fa-solid fa-list-ul"></i> My Orders
        </div>
        
        <div className="flex flex-col">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="data-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{order.id}</span>
                </div>

                <div className="data-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(order.created_at).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  }).replace(/\//g, '-')}</span>
                </div>

                <div className="data-row">
                  <span className="label">Game:</span>
                  <span className="value font-bold">{order.game_name}</span>
                </div>

                <div className="data-row">
                  <span className="label">Package:</span>
                  <span className="value uppercase">{order.product_name}</span>
                </div>
                
                {order.player_id && (
                  <div className="data-row">
                    <span className="label">Player ID:</span>
                    <span className="value">{order.player_id}</span>
                  </div>
                )}

                <div className="data-row">
                  <span className="label">Price:</span>
                  <span className="value">৳{order.amount.toLocaleString()}</span>
                </div>

                <div className="status-row">
                  <div className="data-row mb-0">
                    <span className="label">Status:</span>
                    <span className={getStatusClass(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>

                  {order.status === 'pending' && order.payment_method !== 'wallet' && (
                    <button 
                      onClick={() => onPayNow(order.id)} 
                      className="pay-btn cursor-pointer"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center">
              <i className="fa-solid fa-cart-shopping text-gray-200 text-5xl mb-4"></i>
              <p className="text-gray-500 font-bold">No orders found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Orders;
