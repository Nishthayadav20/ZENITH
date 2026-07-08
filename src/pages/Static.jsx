import React, { useState, useEffect } from 'react';
import { Compass, Mail, Phone, MapPin, Award, CheckCircle2, ChevronDown } from 'lucide-react';

export default function Static({ params, _onPageChange }) {
  const [activeTab, setActiveTab] = useState(params?.view || 'about');
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // Form state for Contact Us
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    if (params?.view) {
      setActiveTab(params.view);
    }
  }, [params]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const faqData = [
    {
      q: "What warranty comes with my Khroniq timepiece?",
      a: "Every Khroniq watch purchased through our platform is backed by a 3-Year International Swiss Warranty. This covers any manufacturing defect or caliber calibration issues. You can register your watch through the customer profile portal."
    },
    {
      q: "How does priority secure shipping operate?",
      a: "We ship all timepieces via armored, fully insured priority express delivery (typically DHL Express or FedEx Priority). Every shipment requires a physical signature by an adult and is packaged in an unbranded outer box for discretion."
    },
    {
      q: "What is your return policy?",
      a: "We offer a complementary 14-day return window for unworn timepieces in original condition, with security tags intact and original protective coatings in place. A courier will collect the package from your address directly."
    },
    {
      q: "How can I verify the authenticity of my watch?",
      a: "All shipments contain a digital Certificate of Authenticity embedded with an encrypted NFC chip. Scan the card with your smartphone or visit an authorized boutique to verify serial credentials directly on the blockchain ledger."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="border-b border-luxury-text/10 pb-6 text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] text-luxury-gold-dark font-bold tracking-widest uppercase">Client Services</span>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-luxury-text">Khroniq Concierge</h1>
        <div className="w-12 h-[2px] bg-luxury-gold-dark mx-auto mt-3" />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center border-b border-luxury-text/10 max-w-4xl mx-auto">
        {[
          { key: 'about', label: 'Our Story' },
          { key: 'contact', label: 'Boutique Contact' },
          { key: 'faq', label: 'Client FAQ' },
          { key: 'policies', label: 'Legal Policies' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-4 sm:px-8 text-[11px] font-bold tracking-widest uppercase border-b-2 cursor-pointer transition ${
              activeTab === tab.key 
                ? 'border-luxury-gold-dark text-luxury-gold-dark font-extrabold' 
                : 'border-transparent text-luxury-muted hover:text-luxury-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Render */}
      <div className="max-w-4xl mx-auto bg-white border border-luxury-text/5 rounded-md p-6 sm:p-10 shadow-sm min-h-[400px]">
        
        {/* OUR STORY TAB */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-[9px] text-luxury-gold-dark font-bold tracking-widest uppercase">LAUNCH EDITION</span>
                <h2 className="text-2xl font-serif font-bold text-luxury-text uppercase">The Dawn of Modern Indian Luxury</h2>
                <p className="text-luxury-muted text-xs leading-relaxed font-light">
                  Khroniq was born from a bold vision: to establish a world-class luxury horology house in India. Merging traditional styling with cutting-edge micro-engineering, we design timepieces that redefine elegance and stand as a symbol of modern Indian precision.
                </p>
                <p className="text-luxury-muted text-xs leading-relaxed font-light">
                  From our state-of-the-art assembly headquarters, our designers and engineers push technical limits. We craft robust calibers and elegant designs tailored for individuals who demand sophistication, reliability, and distinction.
                </p>
              </div>
              <div className="h-64 bg-luxury-bg border border-luxury-text/10 rounded flex items-center justify-center p-6 relative overflow-hidden">
                <Compass className="absolute text-luxury-gold-dark/5 w-80 h-80 -right-20 -bottom-20 rotate-12" />
                <img
                  src="/assets/media__1782899491320.jpg"
                  alt="Swiss manufacture"
                  className="max-h-full max-w-full object-contain relative z-10 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>

            <div className="border-t border-luxury-text/10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Award className="mx-auto text-luxury-gold-dark" size={24} />
                <h4 className="text-xs font-bold text-luxury-text uppercase tracking-wider">PRESTIGE DESIGN</h4>
                <p className="text-[11px] text-luxury-muted leading-relaxed font-light">Every caliber is meticulously engineered and assembled by master craftsmen at our state-of-the-art facilities.</p>
              </div>
              <div className="space-y-2">
                <Compass className="mx-auto text-luxury-gold-dark" size={24} />
                <h4 className="text-xs font-bold text-luxury-text uppercase tracking-wider">HOROLOGICAL SPEED</h4>
                <p className="text-[11px] text-luxury-muted leading-relaxed font-light">High-frequency movements vibrating at 36,000 VpH, enabling 1/10th of a second precision.</p>
              </div>
              <div className="space-y-2">
                <CheckCircle2 className="mx-auto text-luxury-gold-dark" size={24} />
                <h4 className="text-xs font-bold text-luxury-text uppercase tracking-wider">CHRONOMETER PRIZES</h4>
                <p className="text-[11px] text-luxury-muted leading-relaxed font-light">Over 2,300 first-place chronometry awards secured since foundation.</p>
              </div>
            </div>
          </div>
        )}

        {/* BOUTIQUE CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">concierge Inquiry</h3>
              {contactSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>Your message has been safely received. A concierge will reply within 12 hours.</span>
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-luxury-muted font-bold uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Georges Favre"
                      className="w-full bg-luxury-bg border border-luxury-text/10 rounded text-luxury-text text-xs p-3 focus:outline-none focus:border-luxury-gold-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-luxury-muted font-bold uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="georges@locle.ch"
                      className="w-full bg-luxury-bg border border-luxury-text/10 rounded text-luxury-text text-xs p-3 focus:outline-none focus:border-luxury-gold-dark"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] text-luxury-muted font-bold uppercase tracking-widest">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Boutique Appointment Inquiry"
                    className="w-full bg-luxury-bg border border-luxury-text/10 rounded text-luxury-text text-xs p-3 focus:outline-none focus:border-luxury-gold-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-luxury-muted font-bold uppercase tracking-widest">Inquiry Details</label>
                  <textarea
                    required
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Detail your inquiry regarding custom engravings, custom straps or private concierge bookings..."
                    className="w-full bg-luxury-bg border border-luxury-text/10 rounded text-luxury-text text-xs p-3 focus:outline-none focus:border-luxury-gold-dark"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-luxury-gold-dark text-white text-xs font-bold tracking-widest uppercase hover:bg-luxury-gold transition cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-luxury-text/10 lg:pl-10">
              <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Boutique HQ</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-luxury-gold-dark mt-0.5" />
                  <div>
                    <h5 className="font-bold text-luxury-text uppercase">La Manufacture Khroniq</h5>
                    <p className="text-luxury-muted font-light leading-relaxed">Rue des Billodes 34,<br />2400 Le Locle, Switzerland</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone size={16} className="text-luxury-gold-dark mt-0.5" />
                  <div>
                    <h5 className="font-bold text-luxury-text uppercase">Concierge Desk</h5>
                    <p className="text-luxury-muted font-light">+41 (0) 32 930 65 00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail size={16} className="text-luxury-gold-dark mt-0.5" />
                  <div>
                    <h5 className="font-bold text-luxury-text uppercase">Boutique Email</h5>
                    <p className="text-luxury-muted font-light">concierge@khroniq-watches.com</p>
                  </div>
                </div>
              </div>

              <div className="border border-luxury-text/10 rounded p-4 bg-luxury-bg text-center space-y-2">
                <Award className="mx-auto text-luxury-gold-dark" size={20} />
                <h5 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Boutique Appointments</h5>
                <p className="text-[10px] text-luxury-muted leading-relaxed font-light">
                  Reserve a personalized viewing session at our international salons located in Paris, Geneva, Tokyo, and New York.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CLIENT FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqData.map((faq, idx) => (
                <div key={idx} className="border border-luxury-text/10 rounded overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left bg-luxury-bg/30 hover:bg-luxury-bg/60 transition duration-200 cursor-pointer text-xs font-bold uppercase tracking-wider text-luxury-text"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={14} className={`text-luxury-gold-dark transform transition-transform duration-200 ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === idx && (
                    <div className="p-4 bg-white text-xs text-luxury-muted leading-relaxed font-light border-t border-luxury-text/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEGAL POLICIES TAB */}
        {activeTab === 'policies' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Terms, Privacy & Policies</h3>
            
            <div className="space-y-4">
              <section className="space-y-2">
                <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">1. Privacy and Data Protection</h4>
                <p>
                  At KHRONIQ Watches, we are dedicated to protecting your client profile data. Any personal details, address books, and purchase order invoices collected are managed under strict Indian data protection laws and international General Data Protection Regulation (GDPR) guidelines. We enforce SSL encryption blocks on all security gateways.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">2. Terms of Online Acquisition</h4>
                <p>
                  Transactions executed on this boutique portal represent an authorization of secure funds. Your payment ledger status will show as "Paid". Once order packaging passes the manufacture verification seals, priority shipping tracking labels will emit. Cancellation is strictly prohibited after the status alters to "Shipped".
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">3. Cookie & Preference Rules</h4>
                <p>
                  We utilize functional cache bindings and cookies to persist your shopping bag, saved wishlists, and session profiles locally (Local Storage data bindings). No tracking metrics are shared with foreign ad brokers. By browsing, you consent to our security cookie preferences.
                </p>
              </section>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
