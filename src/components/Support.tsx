import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, Copy, CheckCircle, Mail, AlertTriangle, Send, PlayCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SupportProps {
  onBack: () => void;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    telegram?: string;
    whatsapp?: string;
    email?: string;
  };
}

const faqs = [
  {
    question: "How do I purchase a game?",
    answer: "To purchase a game, select the game you want, choose your preferred package, select a payment method, and click 'Buy Now'. Follow the instructions to complete the payment."
  },
  {
    question: "How long does delivery take?",
    answer: "Most orders are processed instantly or within 5-10 minutes. However, during peak hours or for specific games, it might take up to 30 minutes."
  },
  {
    question: "What payment methods are supported?",
    answer: "We support Wallet Pay (using your account balance) and Instant Pay methods like bKash, Nagad, and Rocket."
  },
  {
    question: "What should I do if my payment fails?",
    answer: "If your payment fails but money was deducted, please wait 15-30 minutes as it might be processing. If it's still not resolved, contact our support with your transaction ID."
  },
  {
    question: "How can I redeem my game?",
    answer: "For voucher codes, go to your 'Orders' page, copy the code, and click 'Redeem Now' to visit the official redemption site. Follow their instructions to redeem."
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are only provided if we fail to deliver your order within the promised timeframe. Once an order is successfully delivered or a code is viewed, it cannot be refunded."
  }
];

const tutorials = [
  { title: "How to buy a game", url: "#" },
  { title: "How to redeem a game key", url: "#" },
  { title: "How to verify payment", url: "#" }
];

const Support: React.FC<SupportProps> = ({ onBack, socialLinks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    category: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { showToast } = useToast();

  const supportEmail = socialLinks.email || "support@riyalgames.online";

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    showToast("Email address copied", "success");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.category) errors.category = "Please select a category";
    if (!formData.message.trim()) errors.message = "Message is required";
    
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showToast("Please fix the errors in the form", "error");
    }
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', orderId: '', category: '', message: '' });
      showToast("Support request submitted successfully", "success");
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit support request", error);
      showToast("Failed to submit support request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-2 py-4 pb-24 max-w-2xl">
      {/* Header Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
          <HelpCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-gray-900 font-bold text-xl leading-tight font-bree">Support Center</h1>
          <p className="text-xs text-gray-500 mt-0.5">Find help, guides, or contact our support team.</p>
        </div>
      </div>

      {/* Search Help */}
      <div className="mb-8">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search help articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-bree flex items-center gap-2">
          <i className="fa-solid fa-circle-question text-red-500"></i> Frequently Asked Questions
        </h2>
        <div className="space-y-2.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-sm text-gray-800">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100 mt-2 font-['Noto_Serif_Bengali',_serif]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">No FAQs found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Tutorials / Guides */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 font-bree flex items-center gap-2">
          <i className="fa-solid fa-book-open text-blue-500"></i> Tutorials & Guides
        </h2>
        <div className="grid gap-3">
          {tutorials.map((tutorial, idx) => (
            <a 
              key={idx}
              href={tutorial.url}
              className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PlayCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-800">{tutorial.title}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </a>
          ))}
        </div>
      </div>

      {/* Contact Support & Community */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Contact Support */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 font-bree flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500" /> Contact Support
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Support Email</p>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-800 block select-all">support@riyalgames.online</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Business Email</p>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-800 block select-all">support@riyalgames.online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Support */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4 font-bree flex items-center gap-2">
            <i className="fa-solid fa-users text-blue-500"></i> Community & Social Links
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Telegram Channel */}
            <a href={socialLinks.telegram || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-[#0088cc]/10 hover:border-[#0088cc]/30 transition-colors group">
              <div className="w-6 h-6 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
                <i className="fa-brands fa-telegram text-xs"></i>
              </div>
              <span className="text-xs font-bold text-gray-700">Telegram Channel</span>
            </a>

            {/* WhatsApp Support */}
            <a href={`https://wa.me/${socialLinks.whatsapp || socialLinks.helpline || ""}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-[#25D366]/10 hover:border-[#25D366]/30 transition-colors group">
              <div className="w-6 h-6 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <i className="fa-brands fa-whatsapp text-xs"></i>
              </div>
              <span className="text-xs font-bold text-gray-700">WhatsApp Support</span>
            </a>

            {/* Facebook Page */}
            <a href={socialLinks.facebook || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 transition-colors group">
              <div className="w-6 h-6 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                <i className="fa-brands fa-facebook-f text-xs"></i>
              </div>
              <span className="text-xs font-bold text-gray-700">Facebook Page</span>
            </a>

            {/* YouTube Channel */}
            <a href={socialLinks.youtube || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-[#FF0000]/10 hover:border-[#FF0000]/30 transition-colors group">
              <div className="w-6 h-6 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-[#FF0000] group-hover:bg-[#FF0000] group-hover:text-white transition-colors">
                <i className="fa-brands fa-youtube text-xs"></i>
              </div>
              <span className="text-xs font-bold text-gray-700">YouTube Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Report a Problem Form */}
      <div className="bg-white p-5 md:p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1 font-bree flex items-center gap-2">
          <i className="fa-solid fa-headset text-red-500"></i> Report a Problem
        </h2>
        <p className="text-xs text-gray-500 mb-5">Fill out the form below and we'll get back to you as soon as possible.</p>
        
        {submitSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Request Submitted!</h3>
            <p className="text-sm text-gray-600">We have received your message and will respond to your email shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors`}
                  placeholder="Enter your name"
                />
                {formErrors.name && <p className="text-[10px] text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2.5 bg-gray-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors`}
                  placeholder="Enter your email"
                />
                {formErrors.email && <p className="text-[10px] text-red-500 mt-1">{formErrors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Problem Category *</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      const dropdown = document.getElementById('category-dropdown');
                      if (dropdown) dropdown.classList.toggle('hidden');
                    }}
                    className={`w-full px-3 py-2.5 bg-gray-50 border ${formErrors.category ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors flex items-center justify-between text-left`}
                  >
                    <span className={formData.category ? 'text-gray-900' : 'text-gray-400'}>
                      {formData.category || "Select a category"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  <div id="category-dropdown" className="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {["Payment Issue", "Order Issue", "Account Problem", "Technical Problem", "Other"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, category: cat }));
                          if (formErrors.category) setFormErrors(prev => ({ ...prev, category: '' }));
                          document.getElementById('category-dropdown')?.classList.add('hidden');
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 hover:text-red-600 transition-colors border-b border-gray-50 last:border-0"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {formErrors.category && <p className="text-[10px] text-red-500 mt-1">{formErrors.category}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Order ID (Optional)</label>
                <input 
                  type="text" 
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                  placeholder="e.g. #1024"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Message *</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4}
                className={`w-full px-3 py-2.5 bg-gray-50 border ${formErrors.message ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors resize-none`}
                placeholder="Describe your problem in detail..."
              ></textarea>
              {formErrors.message && <p className="text-[10px] text-red-500 mt-1">{formErrors.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-yellow-800 mb-0.5">Security Notice</h4>
          <p className="text-xs text-yellow-700 leading-relaxed">
            Please contact support only through the official channels listed above to avoid scams. We will never ask for your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
