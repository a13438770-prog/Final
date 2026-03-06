import React from "react";
import { motion } from "motion/react";
import { User } from "./Header";

export interface UserStats {
  support_pin: number;
  weekly_spent: number;
  total_spent: number;
  total_orders: number;
}

interface ProfileProps {
  user: User & { email: string; phone: string };
  stats: UserStats;
  onRefresh: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, stats, onRefresh }) => {
  const avUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`;

  return (
    <div className="container mx-auto px-2 py-6 mb-20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center mb-6"
      >
        <div className="w-28 h-28 rounded-full p-1 shadow-lg mb-3 flex items-center justify-center bg-white avatar-gradient-ring">
          <div className="w-full h-full rounded-full p-[3px] bg-white flex items-center justify-center">
            <img 
              src={avUrl} 
              className="w-full h-full rounded-full object-cover border-2 border-white"
              alt={user.name}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <h2 className="text-primary text-sm font-bold">Hi, {user.name}</h2>
        
        <p className="text-gray-600 text-xs font-bold mt-1 flex items-center gap-1">
          Available Balance : {Math.floor(user.balance)} Tk 
          <i className="fa-solid fa-rotate-right text-xs cursor-pointer hover:rotate-180 transition-transform duration-500" onClick={onRefresh}></i>
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="profile-card">
          <div className="stat-val">{stats.support_pin}</div>
          <div className="stat-label">Support Pin</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="profile-card">
          <div className="stat-val">{Math.floor(stats.weekly_spent)} ৳</div>
          <div className="stat-label">Weekly Spent</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="profile-card">
          <div className="stat-val">{Math.floor(stats.total_spent)}</div>
          <div className="stat-label">Total Spent</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="profile-card">
          <div className="stat-val">{stats.total_orders}</div>
          <div className="stat-label">Total Order</div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded shadow-sm border border-gray-200 mb-6"
      >
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <i className="fa-regular fa-folder-open"></i> Account Information
          </h3>
        </div>
        
        <div className="p-6 text-center">
          <div className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm inline-block min-w-[250px]">
            <div className="flex justify-center items-center gap-2 text-gray-500 text-sm font-bold mb-2">
              <i className="fa-solid fa-rotate-right border p-1 rounded cursor-pointer" onClick={onRefresh}></i> ৳ {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <h2 className="font-bold text-black text-lg font-bree">Available Balance</h2>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-center mb-2 relative">
              <i className="fa-solid fa-certificate verified-badge"></i>
              <i className="fa-solid fa-check text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm"></i>
            </div>
            <h2 className="font-bold text-black text-lg font-bree">Account Verified!</h2>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded shadow-sm border border-gray-200 mb-6"
      >
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <i className="fa-solid fa-circle-info"></i> User Information
          </h3>
        </div>
        
        <div className="p-4">
          <div className="text-xs font-bold text-gray-800 space-y-2">
            <p><span className="text-gray-900">email :</span> {user.email}</p>
            <p><span className="text-gray-900">Phone :</span> {user.phone}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
