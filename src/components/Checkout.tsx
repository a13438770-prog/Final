import React from "react";

interface CheckoutProps {
  amount: number;
  siteName: string;
  siteLogo: string;
  onBack: () => void;
  onCancel: () => void;
  onSelectMethod: (method: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ 
  amount, 
  siteName, 
  siteLogo, 
  onBack, 
  onCancel, 
  onSelectMethod 
}) => {
  const methods = [
    { id: 'bkash', name: 'bKash', logo: 'https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/images/bkash.png' },
    { id: 'nagad', name: 'Nagad', logo: 'https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/images/Nagad.png' },
    { id: 'rocket', name: 'Rocket', logo: 'https://ais-dev-kft2mugwq7fnkyubdpfn7o-342179268189.asia-southeast1.run.app/res/images/Rocket.png' }
  ];

  return (
    <div className="checkout-body min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <div className="top-bar-card">
        <button onClick={onBack} className="nav-icon"><i className="fa-solid fa-house"></i></button>
        <div className="flex gap-4">
          <button className="nav-icon"><i className="fa-solid fa-language"></i></button>
          <button onClick={onCancel} className="nav-icon"><i className="fa-solid fa-xmark"></i></button>
        </div>
      </div>

      {/* Content Container */}
      <div className="content-container flex-1 flex flex-col items-center pt-10 px-2 pb-20">
        <div className="logo-ring">
          <img src={siteLogo} alt="Logo" referrerPolicy="no-referrer" />
        </div>

        <h1 className="page-title">{siteName} Pay</h1>

        <div className="blue-header">মোবাইল ব্যাংকিং</div>

        <div className="methods-grid grid grid-cols-2 gap-4 w-full max-w-[400px]">
          {methods.map((method) => (
            <button 
              key={method.id} 
              onClick={() => onSelectMethod(method.id)}
              className="pay-card w-full flex items-center justify-center"
            >
              <img src={method.logo} className="pay-logo" alt={method.name} referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Bar */}
      <div className="pay-btn-area">
        Pay {amount.toFixed(2)} BDT
      </div>
    </div>
  );
};

export default Checkout;
