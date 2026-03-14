import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useToast } from "../context/ToastContext";

interface VerifyOTPProps {
  onBackToLogin: () => void;
  onSubmit: (otp: string) => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ onBackToLogin, onSubmit }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const { showToast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    if (timer === 0) {
      setTimer(60);
      showToast("OTP has been resent to your email.", "success");
      // Here you would typically trigger the actual API call to resend the OTP
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      showToast("OTP is required", "error");
      return;
    }
    if (otp.length < 4) {
      showToast("Please enter a valid OTP", "error");
      return;
    }
    onSubmit(otp);
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
            <i className="fa-solid fa-shield-halved text-2xl text-red-600"></i>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center font-bree">Verify OTP</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Please enter the OTP sent to your email address.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="label-text">Enter OTP</label>
            <input 
              type="text" 
              name="otp" 
              placeholder="Enter OTP code" 
              required 
              className="form-input text-center tracking-widest text-lg font-bold"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>
          
          <button type="submit" className="btn-main mb-4">Verify OTP</button>
        </form>
        
        <div className="text-center mb-4">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in <span className="font-bold text-red-600">{timer}s</span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <a href="#" onClick={handleResend} className="text-red-600 hover:underline font-bold">
                Resend OTP
              </a>
            </p>
          )}
        </div>

        <p className="link-text text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }}>Back to Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
