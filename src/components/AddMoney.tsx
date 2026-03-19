import React, { useState } from "react";
import { Wallet, CreditCard, PlayCircle, Info } from 'lucide-react';
import { useToast } from "../context/ToastContext";

interface AddMoneyProps {
  videoLink?: string;
  onProceed: (amount: number, method: string) => void;
  onViewTransactions?: () => void;
}

const AddMoney: React.FC<AddMoneyProps> = ({ videoLink, onProceed, onViewTransactions }) => {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { showToast } = useToast();

  const quickAmounts = [100, 500, 1000];

  // Helper Function to convert ANY YouTube link to Embed link
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const shortUrlRegex = /youtu.be\/([a-zA-Z0-9_-]+)\??/i;
    const longUrlRegex = /youtube.com\/((?:embed)|(?:watch))((?:\?v\=)|(?:\/))([a-zA-Z0-9_-]+)/i;

    let youtubeId = "";
    const longMatches = url.match(longUrlRegex);
    if (longMatches) {
      youtubeId = longMatches[longMatches.length - 1];
    }
    const shortMatches = url.match(shortUrlRegex);
    if (shortMatches) {
      youtubeId = shortMatches[1];
    }
    
    return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url;
  };

  const embedLink = videoLink ? getYoutubeEmbedUrl(videoLink) : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10) {
      setError("Minimum deposit amount is ৳10");
      showToast("Minimum deposit amount is ৳10", "error");
      return;
    }
    setError("");
    onProceed(numAmount, 'bkash'); // Defaulting to bkash as the method selection is removed
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError("");
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#f0f5f9] pb-20 pt-4">
      <div className="container mx-auto px-2 max-w-3xl">
        
        {/* Header Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
              <Wallet className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl leading-tight">Add Money</h1>
              <p className="text-xs text-gray-500 mt-0.5">Add funds to your wallet instantly</p>
            </div>
          </div>
          {onViewTransactions && (
            <button 
              onClick={onViewTransactions}
              className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
            >
              History
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Enter Amount */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
            <div className="mb-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">৳</span>
                <input 
                  type="number" 
                  className={`w-full border ${error ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-gray-300'} rounded-lg p-3 pl-8 text-lg font-bold text-gray-800 focus:outline-none focus:border-[#dc2626] transition-colors`}
                  placeholder="Enter amount (Min ৳10)" 
                  value={amount}
                  onChange={handleAmountChange}
                  required 
                  min="10" 
                />
              </div>
              {error && (
                <div className="error-msg-box flex mt-2">
                  <i className="fa-solid fa-circle-exclamation"></i> {error}
                </div>
              )}
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className="bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  ৳{val}
                </button>
              ))}
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#dc2626] hover:opacity-90 text-white font-bree py-3 rounded-xl shadow-md transition-all active:scale-95 text-lg tracking-wide flex items-center justify-center gap-2"
            >
              Proceed to Payment <i className="fa-solid fa-arrow-right text-sm"></i>
            </button>
          </div>
        </form>

        {/* Tutorial Section */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bree text-gray-800 text-base mb-3 flex items-center gap-2 border-b pb-2">
            <PlayCircle className="w-5 h-5 text-red-600" /> How to Add Money
          </h3>
          
          {videoLink ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-sm border border-gray-100 relative">
              <iframe 
                className="w-full h-full" 
                src={embedLink} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title="Tutorial"
              ></iframe>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <PlayCircle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Video tutorial coming soon</p>
            </div>
          )}
          
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Please send money to the number provided in the next step. Do not save the number as it changes frequently. Always check the number before sending money.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddMoney;
