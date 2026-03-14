import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../context/ToastContext";

interface AuthProps {
  onLogin: (data: any) => void;
  onSignup: (data: any) => void;
  onForgotPassword: () => void;
  siteName: string;
  initialIsLogin?: boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, onForgotPassword, siteName, initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!formData.email) {
        showToast("Email or Phone Number is required", "error");
        return;
      }
      if (!formData.password) {
        showToast("Password is required", "error");
        return;
      }
      onLogin({ email: formData.email, password: formData.password });
    } else {
      if (!formData.name) {
        showToast("Full Name is required", "error");
        return;
      }
      if (!formData.phone) {
        showToast("Phone Number is required", "error");
        return;
      }
      if (!formData.email) {
        showToast("Email Address is required", "error");
        return;
      }
      if (!formData.password) {
        showToast("Password is required", "error");
        return;
      }
      if (formData.password !== formData.confirm_password) {
        showToast("Passwords do not match", "error");
        return;
      }
      if (!acceptTerms) {
        showToast("You must accept the Terms & Conditions", "error");
        return;
      }
      onSignup(formData);
    }
  };

  return (
    <div className="container mx-auto px-2 pt-6 pb-10">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="auth-card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-bree text-center">Login</h2>
            
            <button className="google-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Login with Google
            </button>
            
            <div className="divider">Or sign in with credentials</div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label-text">Email Address or Phone Number</label>
                <input 
                  type="text" 
                  name="email" 
                  placeholder="Enter your email or phone number" 
                  required 
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label-text mb-0">Password</label>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); onForgotPassword(); }}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="Enter your password" 
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button type="submit" className="btn-main">Login</button>
            </form>
            
            <p className="link-text">
              New user to {siteName}? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>Register Now</a>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="auth-card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-bree text-center">Register</h2> 
            
            <button className="google-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Signup with Google
            </button>
            
            <div className="divider">Or sign up with credentials</div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label-text">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your full name" 
                  required 
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="label-text">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Enter your phone number" 
                  required 
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="label-text">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email address" 
                  required 
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="label-text">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    placeholder="Create a strong password" 
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="mb-1.5">
                <label className="label-text">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirm_password" 
                    placeholder="Re-enter your password" 
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
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-2 flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#dc2626] border-gray-300 rounded focus:ring-[#dc2626] cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none">
                  I accept the <a href="#" className="text-[#dc2626] hover:underline">Terms & Conditions</a>
                </label>
              </div>
              
              <button type="submit" className="btn-main">Register</button>
            </form>
            
            <p className="link-text">
              Already member? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>Login Now</a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
