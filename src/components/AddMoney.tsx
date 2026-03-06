import React, { useState } from "react";

interface AddMoneyProps {
  videoLink?: string;
  onProceed: (amount: number) => void;
}

const AddMoney: React.FC<AddMoneyProps> = ({ videoLink, onProceed }) => {
  const [amount, setAmount] = useState<string>("");

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
    if (numAmount >= 10) {
      onProceed(numAmount);
    }
  };

  return (
    <div className="container mx-auto px-2 py-6 mb-20 max-w-lg">
      <div className="main-card">
        <div className="card-header">
          <h2 className="page-title">Add Money</h2>
        </div>
        
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-2 text-center">
              <label className="label-text">Enter Amount to Deposit</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400 font-bold text-lg">৳</span>
                <input 
                  type="number" 
                  className="input-flat" 
                  placeholder="100" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                  min="10" 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-flat-main">
              Proceed to Payment
            </button>
          </form>

          <div className="video-title">
            <i className="fa-solid fa-circle-play" style={{ color: "var(--primary-color)" }}></i> 
            Tutorial: How to Add Money
          </div>
          
          {videoLink ? (
            <div className="aspect-video bg-black rounded-md overflow-hidden shadow-sm border border-gray-100 relative">
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
            <div className="bg-gray-50 p-6 text-center rounded-md border border-gray-100 text-gray-400 text-xs italic">
              <i className="fa-brands fa-youtube text-2xl mb-2 opacity-50"></i><br />
              Video tutorial coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMoney;
