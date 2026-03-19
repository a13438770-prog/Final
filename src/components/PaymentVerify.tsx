import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface PaymentVerifyProps {
  amount: number;
  initialMethod?: string;
  onBack: () => void;
  onSuccess: (trxId: string, amount: number) => void;
}

type PayMethod = 'bkash' | 'rocket' | 'nagad';

const paymentData = {
  bkash: { color: 'bg-[#e2136e]', textColor: 'text-[#e2136e]', number: '01797488769', dial: '*247#', name: 'BKASH', logo: 'https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/images/bkash.png' },
  rocket: { color: 'bg-[#8c3494]', textColor: 'text-[#8c3494]', number: '01797488769', dial: '*322#', name: 'Rocket', logo: 'https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/images/Rocket.png' },
  nagad: { color: 'bg-[#f15a29]', textColor: 'text-[#f15a29]', number: '01797488769', dial: '*167#', name: 'NAGAD', logo: 'https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/images/Nagad.png' }
};

const PaymentVerify: React.FC<PaymentVerifyProps> = ({ amount, initialMethod = 'bkash', onBack, onSuccess }) => {
  const [method, setMethod] = useState<PayMethod>((initialMethod as PayMethod) || 'bkash');
  const [trxId, setTrxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const data = paymentData[method];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Number copied to clipboard", "success");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleVerify = () => {
    if (trxId.trim().length < 4) {
      showToast('Please enter a valid Transaction ID.', 'error');
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      onSuccess(trxId, amount);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Lato',_sans-serif] select-none">
      <div className="bg-white h-[60px] flex items-center px-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] fixed top-0 left-0 right-0 z-50">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          <i className="fa-solid fa-arrow-left text-gray-700 text-lg"></i>
        </button>
        <h1 className="font-bold text-lg text-gray-800 ml-2">Add Money</h1>
      </div>

      <div className="pt-20 px-2 pb-10 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(Object.keys(paymentData) as PayMethod[]).map((m) => (
            <div 
              key={m}
              onClick={() => setMethod(m)}
              className={`bg-white border rounded-lg flex items-center justify-center gap-2 cursor-pointer relative transition-all h-[60px] p-1.5 ${
                method === m 
                  ? m === 'bkash' ? 'border-[#e2136e] bg-[#fff5f8]' 
                  : m === 'rocket' ? 'border-[#8c3494] bg-[#fbf5fc]' 
                  : 'border-[#ec1c24] bg-[#fff5f5]'
                  : 'border-[#eee]'
              }`}
            >
              <img src={paymentData[m].logo} className="h-auto max-h-[35px] w-auto max-w-[50%] object-contain shrink-0" alt={paymentData[m].name} referrerPolicy="no-referrer" />
              <span className="font-bold text-[#555] text-sm whitespace-nowrap">{paymentData[m].name}</span>
              
              {method === m && (
                <div className={`absolute -top-1.5 -right-1.5 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center border-2 border-white z-10 ${
                  m === 'bkash' ? 'bg-[#e2136e]' : m === 'rocket' ? 'bg-[#8c3494]' : 'bg-[#ec1c24]'
                }`}>
                  <i className="fa-solid fa-check"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`rounded-xl p-5 md:p-6 text-white transition-colors duration-300 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] mt-6 ${data.color}`}>
          <h3 className="text-center text-white font-bold text-lg mb-1 font-['Noto_Sans_Bengali',_sans-serif]">ট্রানজেকশন আইডি দিন</h3>
          <input 
            type="text" 
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full bg-white/20 border border-white/30 text-white p-3.5 rounded-lg outline-none text-[15px] mt-2.5 mb-4.5 text-center tracking-[1px] font-['Lato',_sans-serif] placeholder-white/80 select-text" 
            placeholder="ট্রানজেকশন আইডি দিন" 
          />
          
          <ul className="list-none p-0 m-0 text-[13px] leading-[1.7] font-['Noto_Sans_Bengali',_sans-serif]">
            <li className="flex items-start gap-2.5 mb-2">
              <span className="min-w-[8px] h-[8px] bg-white rounded-full mt-[7px] inline-block"></span>
              <span>{data.dial} ডায়াল করে আপনার {data.name} মোবাইল মেনুতে যান অথবা {data.name} অ্যাপে যান।</span>
            </li>
            <li className="flex items-start gap-2.5 mb-2">
              <span className="min-w-[8px] h-[8px] bg-white rounded-full mt-[7px] inline-block"></span>
              <span><span className="font-bold text-yellow-300">Send Money</span> - এ ক্লিক করুন।</span>
            </li>
            <li className="flex items-start gap-2.5 mb-2">
              <span className="min-w-[8px] h-[8px] bg-white rounded-full mt-[7px] inline-block"></span>
              <span>প্রাপক নম্বর হিসেবে নিচের এই নম্বরটি লিখুন</span>
            </li>
            <li className="pl-5 mb-2">
              <span className="font-bold text-white bg-black/10 px-1.5 py-0.5 rounded font-mono text-[15px]">{data.number}</span> 
              <button 
                type="button" 
                onClick={() => handleCopy(data.number)}
                className="bg-white/25 border border-white/40 text-white px-2.5 py-1 rounded-md text-[11px] cursor-pointer ml-2 inline-flex items-center gap-1.5 font-['Lato',_sans-serif]"
              >
                {copied ? <i className="fa-solid fa-check text-green-300"></i> : <i className="fa-regular fa-copy"></i>} Copy
              </button>
            </li>
            <li className="flex items-start gap-2.5 mb-2">
              <span className="min-w-[8px] h-[8px] bg-white rounded-full mt-[7px] inline-block"></span>
              <span>নিশ্চিত করতে এখন আপনার {data.name} মোবাইল মেনু পিন লিখুন।</span>
            </li>
            <li className="flex items-start gap-2.5 mb-2">
              <span className="min-w-[8px] h-[8px] bg-white rounded-full mt-[7px] inline-block"></span>
              <span>এখন উপরের বক্সে আপনার Transaction ID এবং Amount দিন আর নিচের VERIFY বাটনে ক্লিক করুন।</span>
            </li>
          </ul>
          
          <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className={`w-full bg-white font-black uppercase p-3.5 rounded-lg border-none mt-5 cursor-pointer shadow-[0_4px_6px_rgba(0,0,0,0.1)] text-[16px] font-['Lato',_sans-serif] ${data.textColor} disabled:opacity-80`}
          >
            {isVerifying ? 'VERIFYING...' : 'VERIFY'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerify;
