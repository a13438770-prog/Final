import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserType } from "./Header";
import { User, Wallet, ShoppingBag, CreditCard, Shield, Calendar, Clock, LayoutGrid, CheckCircle, Camera, Lock, Save, X, LogOut, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface UserStats {
  support_pin: number;
  weekly_spent: number;
  total_spent: number;
  total_orders: number;
}

interface ProfileProps {
  user: UserType & { email: string; phone: string; location?: string; joinedYear?: string };
  stats: UserStats;
  onRefresh: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, stats, onRefresh }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Mock initial state
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avUrl = avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name || user.name)}&background=random&color=fff`;

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form on cancel
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setAvatarPreview(null);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    console.log("Saving changes:", editForm);
    if (editForm.email !== user.email) {
      setIsEmailVerified(false);
    }
    setIsEditing(false);
  };

  const handleVerifyEmail = () => {
    setIsVerifying(true);
    // Simulate API call for sending verification email
    setTimeout(() => {
      setIsVerifying(false);
      alert("Verification email sent! Please check your inbox.");
      // In a real app, this would be set to true after the user clicks the link in their email
      setIsEmailVerified(true); 
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-lg">
        
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight">My Profile</h1>
              <p className="text-xs text-gray-500 mt-0.5">Manage your account</p>
            </div>
          </div>
          {!isEditing ? (
            <button 
              onClick={handleEditToggle}
              className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleEditToggle}
                className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 shadow-sm"
              >
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          )}
        </div>

        {/* User Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center gap-4"
        >
          <div className="relative flex-shrink-0">
            <img 
              src={avUrl} 
              className={`w-16 h-16 rounded-full border-2 border-gray-100 object-cover shadow-sm ${isEditing ? 'opacity-70' : ''}`}
              alt={user.name}
              referrerPolicy="no-referrer"
            />
            {!isEditing ? (
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-red-600 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm hover:bg-red-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input 
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="text-lg font-bold text-gray-900 font-bree w-full border border-gray-200 rounded-md px-2 py-1 mb-1 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-lg font-bold text-gray-900 font-bree truncate">{editForm.name}</h2>
            )}
            <p className="text-sm text-gray-500 truncate">{editForm.email}</p>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded text-[10px] font-bold uppercase tracking-wider">
              <i className="fa-solid fa-crown text-yellow-500"></i> Gold Member
            </div>
          </div>
        </motion.div>

        {/* Balance & Add Money */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-3"
        >
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                <Wallet className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Available Balance</div>
                <div className="text-xl font-black text-[#dc2626] font-bree leading-none flex items-center gap-2 mt-0.5">
                  ৳ {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <button onClick={onRefresh} className="text-gray-400 hover:text-red-600 transition-colors ml-1">
                    <i className="fa-solid fa-rotate-right text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/addmoney')}
            className="w-full bg-[#dc2626] hover:opacity-90 text-white font-bree py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-base tracking-wide flex items-center justify-center gap-2"
          >
            Add Money <i className="fa-solid fa-plus text-sm"></i>
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <button 
            onClick={() => navigate('/orders')}
            className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 hover:bg-red-50 hover:border-red-100 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0 group-hover:bg-white transition-colors">
              <ShoppingBag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900 font-bree leading-none group-hover:text-red-700 transition-colors">{stats.total_orders}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 group-hover:text-red-500 transition-colors">Orders</div>
            </div>
          </button>

          <button 
            onClick={() => navigate('/transactions')}
            className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 hover:bg-red-50 hover:border-red-100 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0 group-hover:bg-white transition-colors">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900 font-bree leading-none group-hover:text-red-700 transition-colors">
                ৳{stats.total_spent >= 1000 ? (stats.total_spent / 1000).toFixed(1) + 'k' : stats.total_spent}
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 group-hover:text-red-500 transition-colors">Spent</div>
            </div>
          </button>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900 font-bree leading-none">{stats.support_pin}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Support Pin</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100 flex-shrink-0">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-lg font-black text-gray-900 font-bree leading-none">{user.joinedYear || '2024'}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Joined</div>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4"
        >
          <h3 className="font-bree text-gray-800 text-base mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
            <User className="w-4 h-4 text-red-600" /> Account Details
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <i className="fa-solid fa-phone text-gray-400 w-4 text-center"></i> Phone
              </span>
              {isEditing ? (
                <input 
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="text-sm font-bold text-gray-900 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-right w-32"
                />
              ) : (
                <span className="text-sm font-bold text-gray-900">{user.phone}</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-2">
                <i className="fa-solid fa-envelope text-gray-400 w-4 text-center"></i> Email
              </span>
              <div className="flex flex-col items-end gap-1">
                {isEditing ? (
                  <input 
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="text-sm font-bold text-gray-900 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-right w-48"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{editForm.email}</span>
                    {isEmailVerified ? (
                      <i className="fa-solid fa-circle-check text-green-500 text-sm" title="Verified"></i>
                    ) : (
                      <button 
                        onClick={handleVerifyEmail}
                        disabled={isVerifying}
                        className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {isVerifying ? 'Sending...' : 'Verify'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Password Change (Only visible in edit mode) */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4"
            >
              <h3 className="font-bree text-gray-800 text-base mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Lock className="w-4 h-4 text-red-600" /> Change Password
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                  <input 
                    type="password"
                    value={editForm.currentPassword}
                    onChange={(e) => setEditForm({...editForm, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">New Password</label>
                  <input 
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                  <input 
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={(e) => setEditForm({...editForm, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6"
        >
          <h3 className="font-bree text-gray-800 text-base mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i className="fa-solid fa-link text-red-600"></i> Quick Links
          </h3>
          
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/transactions')} 
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-red-50 hover:border-red-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-red-200 shadow-sm">
                  <Clock className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
                <span className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">Transaction History</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover:text-red-500 transition-colors"></i>
            </button>

            <button 
              onClick={() => navigate('/orders')} 
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-red-50 hover:border-red-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-red-200 shadow-sm">
                  <ShoppingBag className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
                <span className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">Orders</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover:text-red-500 transition-colors"></i>
            </button>

            <button 
              onClick={() => navigate('/order_tracker')} 
              className="w-full bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-red-50 hover:border-red-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-red-200 shadow-sm">
                  <MapPin className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
                <span className="font-bold text-gray-900 text-sm group-hover:text-red-700 transition-colors">Order Tracker</span>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-400 text-xs group-hover:text-red-500 transition-colors"></i>
            </button>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <button 
            onClick={() => {
              // Add logout logic here
              console.log("Logging out...");
              navigate('/'); // Redirect to home or login page
            }}
            className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
