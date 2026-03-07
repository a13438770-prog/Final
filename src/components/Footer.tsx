import React from "react";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  telegram?: string;
  email?: string;
  whatsapp?: string;
  helpline?: string;
}

interface FooterProps {
  logo?: string;
  siteName?: string;
  description?: string;
  socialLinks: SocialLinks;
  developerName?: string;
  developerLink?: string;
}

const Footer: React.FC<FooterProps> = ({
  logo,
  siteName = "TOPUPBD",
  description = "কোনো সমস্যায় পড়লে হোয়াটসঅ্যাপ এ যোগাযোগ করবেন। তাহলে দ্রুত সমাধান পেয়ে যাবেন।",
  socialLinks,
  developerName = "Developer Sketvia",
  developerLink = "https://t.me/DeveloperSketvia01"
}) => {
  return (
    <footer className="footer-section bg-[#f3f4f6] text-[#1f2937] pt-5 pb-[80px] border-t border-[#e5e7eb] relative z-[1] w-full font-['Noto_Serif_Bengali',_serif]">
      <div className="container mx-auto px-6">
        {/* Logo */}
        <div className="mb-5">
          {logo ? (
            <img src={logo} alt="Logo" className="h-[35px] object-contain" referrerPolicy="no-referrer" />
          ) : (
            <h2 className="text-2xl font-black text-blue-600 uppercase italic font-['Bree_Serif',_serif]">
              TOPUP<span className="text-red-500">BD</span>
            </h2>
          )}
        </div>

        {/* Stay Connected Section */}
        <h3 className="text-xl font-bold mb-2.5 text-black font-['Bree_Serif',_serif]">Stay Connected</h3>

        {/* Social Grid */}
        <div className="flex justify-start gap-4 mb-4">
          <a 
            href={socialLinks.instagram || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-black text-xl shadow-sm border border-white active:scale-[0.98] active:bg-[#f9fafb] transition-all"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a 
            href={socialLinks.youtube || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-black text-xl shadow-sm border border-white active:scale-[0.98] active:bg-[#f9fafb] transition-all"
          >
            <i className="fa-brands fa-youtube"></i>
          </a>

          <a 
            href={socialLinks.facebook || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-black text-xl shadow-sm border border-white active:scale-[0.98] active:bg-[#f9fafb] transition-all"
          >
            <i className="fa-brands fa-facebook-f"></i>
          </a>

          <a 
            href={`mailto:${socialLinks.email || ""}`} 
            className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-black text-xl shadow-sm border border-white active:scale-[0.98] active:bg-[#f9fafb] transition-all"
          >
            <i className="fa-regular fa-envelope"></i>
          </a>
        </div>

        {/* Description */}
        <p className="text-[#4b5563] text-sm leading-[1.5] mb-5 font-medium">
          {description}
        </p>

        {/* Contact Us Section */}
        <h3 className="text-xl font-bold mb-2.5 text-black font-['Bree_Serif',_serif]">Contact Us</h3>
        
        <div className="space-y-2.5">
          <a 
            href={socialLinks.helpline ? `https://wa.me/${socialLinks.helpline}` : "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-[15px] flex items-center gap-[15px] shadow-sm active:bg-[#f9fafb] transition-colors"
          >
            <div className="flex items-center justify-center text-[28px] shrink-0 text-black">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div className="w-[1px] h-8 bg-gray-200 shrink-0"></div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-black m-0 font-['Bree_Serif',_serif]">
                WhatsApp Helpline
              </h4>
              <p className="text-xs text-[#4b5563] mt-0.5 font-['Noto_Serif_Bengali',_serif] font-normal">
                সকাল ৯টা থেকে রাত ১২টা
              </p>
            </div>
          </a>

          <a 
            href={socialLinks.telegram || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white rounded-xl p-[15px] flex items-center gap-[15px] shadow-sm active:bg-[#f9fafb] transition-colors"
          >
            <div className="flex items-center justify-center text-[28px] shrink-0 text-black">
              <i className="fa-brands fa-telegram"></i>
            </div>
            <div className="w-[1px] h-8 bg-gray-200 shrink-0"></div>
            <div className="flex-1">
              <h4 className="text-[15px] font-bold text-black m-0 font-['Bree_Serif',_serif]">
                Telegram Support
              </h4>
              <p className="text-xs text-[#4b5563] mt-0.5 font-['Noto_Serif_Bengali',_serif] font-normal">
                টেলিগ্রামে সাপোর্ট
              </p>
            </div>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="text-center text-[13px] text-[#9ca3af] mt-6 pt-[15px] border-t border-[#e5e7eb] font-['Bree_Serif',_serif] space-y-0.5">
          <div>© TopUp BD 2026 | All Rights Reserved</div>
          <div>Developed by <a href={developerLink} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] font-medium">RIYAL Games</a></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
