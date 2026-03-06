import React, { useState } from "react";
import { motion } from "motion/react";

interface ResetPasswordProps {
  onBackToLogin: () => void;
  onSubmit: (password: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBackToLogin, onSubmit }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    onSubmit(formData.password);
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
            <i className="fa-solid fa-lock text-2xl text-red-600"></i>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center font-bree">Reset Password</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Please enter your new password below.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label-text">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Enter new password" 
                required 
                className="form-input pr-10"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="label-text">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirm_password" 
                placeholder="Confirm new password" 
                required 
                className="form-input pr-10"
                value={formData.confirm_password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>}
          </div>
          
          <button type="submit" className="btn-main mb-4">Reset Password</button>
        </form>
        
        <p className="link-text text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>Back to Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
