import React, { useState } from "react";
import { motion } from "motion/react";
import { useToast } from "../context/ToastContext";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onSubmit: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onSubmit }) => {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast("Email Address is required", "error");
      return;
    }
    onSubmit(email);
  };

  return (
    <div className="container mx-auto px-2 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="auth-card"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-envelope-open-text text-2xl text-red-600"></i>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center font-bree">Forgot Password</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="label-text">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              required 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-main mb-4">Send Reset Link</button>
        </form>
        
        <p className="link-text text-center">
          Remember your password? <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>Back to Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
