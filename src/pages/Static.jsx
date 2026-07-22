import React, { useState, useEffect } from 'react';
import { Compass, Mail, Phone, MapPin, Award, CheckCircle2, ChevronDown, BookOpen, ArrowRight, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../store/slices/watchSlice';

export default function Static({ params, _onPageChange }) {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.watch.blogs || []);
  const [activeTab, setActiveTab] = useState(params?.view || 'about');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);
  
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
      a: "Every Khroniq watch purchased through our platform is backed by a 3-Year Indian Warranty from the True Knock Group. This covers any manufacturing defect or caliber calibration issues. You can register your watch through the customer profile portal."
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

  const policiesData = [
    {
      title: "1. Company Information",
      content: (
        <div className="space-y-2">
          <p><span className="font-semibold text-luxury-text">Brand:</span> KHRONIQ</p>
          <p><span className="font-semibold text-luxury-text">Owned & Marketed By:</span> True Knock Industries Private Limited</p>
          <p className="font-semibold text-luxury-text mt-1">Office Address:</p>
          <p className="pl-3 border-l border-luxury-gold-dark/30 italic text-[11px] text-luxury-muted">
            Office No. - 2, Chamber - 4,<br />
            Udaigiri Tower, Kaushambi,<br />
            Ghaziabad, Uttar Pradesh — 201010,<br />
            India
          </p>
          <p><span className="font-semibold text-luxury-text">Website:</span> <a href="https://www.khroniq.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline">www.khroniq.com</a></p>
        </div>
      )
    },
    {
      title: "2. Eligibility",
      content: "You must be at least 18 years of age or legally capable of entering into binding contracts under applicable law. By using this Website, you represent that all information provided by you is accurate and complete."
    },
    {
      title: "3. Products",
      content: "KHRONIQ designs, markets, and sells luxury wristwatches and related accessories. Product images are for illustration purposes only. Minor variations in color, texture, finish, leather grain, or packaging may occur due to lighting, manufacturing processes, or display settings and shall not be considered defects."
    },
    {
      title: "4. Pricing & Taxes",
      content: "All prices are displayed in Indian Rupees (INR) unless otherwise specified and are inclusive or exclusive of applicable taxes as indicated at checkout. Applicable GST and shipping charges shall be calculated during checkout. KHRONIQ reserves the right to modify prices without prior notice."
    },
    {
      title: "5. Orders",
      content: (
        <div className="space-y-2">
          <p>All orders are subject to verification and acceptance by the Company. KHRONIQ reserves the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Refuse or cancel any order.</li>
            <li>Limit purchase quantities.</li>
            <li>Cancel orders suspected of fraud or unauthorized transactions.</li>
            <li>Request identity verification before dispatch.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">Order confirmation does not constitute acceptance until the product has been dispatched.</p>
        </div>
      )
    },
    {
      title: "6. Payments",
      content: "Payments may be made through approved payment gateways, UPI, debit cards, credit cards, net banking, wallets, EMI, or any other payment methods made available on the Website. KHRONIQ does not store your complete payment information."
    },
    {
      title: "7. Shipping & Delivery",
      content: "Estimated delivery timelines are indicative only. Delivery delays caused by courier partners, customs authorities, weather conditions, government restrictions, strikes, pandemics, natural disasters, or other events beyond our reasonable control shall not constitute a breach of these Terms. Risk of loss transfers to the customer upon successful delivery."
    },
    {
      title: "8. Cancellation, Return & Replacement",
      content: "Orders may only be cancelled before dispatch. Returns or replacements shall be governed by our Return & Replacement Policy published separately on this Website. Products damaged due to misuse, negligence, unauthorized repairs, accidental impact, or normal wear and tear shall not qualify for return or replacement."
    },
    {
      title: "9. Warranty",
      content: (
        <div className="space-y-2">
          <p>KHRONIQ watches are covered under a Limited Warranty as specified in the Warranty Policy.</p>
          <p>The warranty covers manufacturing defects only and excludes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Glass damage</li>
            <li>Strap wear</li>
            <li>Battery depletion (unless specified)</li>
            <li>Water damage caused by improper use</li>
            <li>Accidental damage</li>
            <li>Unauthorized servicing</li>
            <li>Cosmetic wear</li>
          </ul>
          <p className="text-[11px] text-luxury-muted mt-1">Warranty claims require the original purchase invoice and warranty card.</p>
        </div>
      )
    },
    {
      title: "10. Account Responsibility",
      content: "Customers are responsible for maintaining the confidentiality of their account credentials. KHRONIQ shall not be liable for unauthorized access resulting from the customer's negligence."
    },
    {
      title: "11. Intellectual Property",
      content: "All content on this Website including but not limited to the KHRONIQ name, logos, wordmarks, product designs, dial designs, photographs, graphics, videos, packaging, QR Codes, model numbers, serial number systems, software, website design, and product descriptions are the exclusive intellectual property of True Knock Industries Private Limited and are protected under applicable intellectual property laws. No content may be copied, reproduced, modified, distributed, published, reverse engineered, or commercially exploited without prior written permission."
    },
    {
      title: "12. Trademarks",
      content: "KHRONIQ®, its logo, taglines, product names, collection names, and associated branding are trademarks or proposed trademarks of True Knock Industries Private Limited. Unauthorized use is strictly prohibited."
    },
    {
      title: "13. Product Authenticity",
      content: "Only products purchased directly from KHRONIQ or its authorized sellers are guaranteed to be genuine. KHRONIQ shall not be responsible for counterfeit or unauthorized products purchased from third parties. Customers are encouraged to verify product authenticity using official serial numbers or QR codes where applicable."
    },
    {
      title: "14. User Conduct",
      content: "Users agree not to violate any law, upload malicious software, attempt unauthorized access, use automated tools to scrape website data, misuse coupons or promotional offers, infringe intellectual property rights, or submit false information. Violation may result in suspension or permanent termination of access."
    },
    {
      title: "15. Limitation of Liability",
      content: "To the maximum extent permitted by law, KHRONIQ shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including loss of profits, goodwill, business opportunities, or data arising from the use of this Website or our products. Our total liability shall not exceed the amount actually paid for the product giving rise to the claim."
    },
    {
      title: "16. Disclaimer",
      content: "This Website and all products are provided on an \"as available\" and \"as is\" basis. While reasonable efforts are made to ensure accuracy, KHRONIQ does not warrant that the Website will always remain uninterrupted, information will always be error-free, or that every product image exactly represents the delivered product."
    },
    {
      title: "17. Force Majeure",
      content: "KHRONIQ shall not be liable for delay or failure in performance resulting from events beyond reasonable control including but not limited to pandemics, epidemics, floods, earthquakes, fires, natural disasters, wars, terrorism, riots, strikes, lockouts, curfews, government restrictions, import/export regulations, customs delays, transport disruptions, road closures, traffic restrictions, power failures, internet outages, cyber incidents, or any similar event."
    },
    {
      title: "18. Privacy",
      content: "Collection and processing of personal information shall be governed by the KHRONIQ Privacy Policy available on this Website."
    },
    {
      title: "19. Third-Party Links",
      content: "The Website may contain links to third-party websites for convenience. KHRONIQ does not endorse or control such websites and shall not be responsible for their content, policies, or services."
    },
    {
      title: "20. Modifications",
      content: "KHRONIQ reserves the right to modify these Terms & Conditions, product information, pricing, services, or Website content at any time without prior notice. Continued use of the Website after such modifications constitutes acceptance of the revised Terms."
    },
    {
      title: "21. Governing Law & Jurisdiction",
      content: "These Terms shall be governed by and interpreted in accordance with the laws of India. Any dispute arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "22. Severability",
      content: "If any provision of these Terms is declared invalid or unenforceable, the remaining provisions shall continue in full force and effect."
    },
    {
      title: "23. Entire Agreement",
      content: "These Terms & Conditions, together with the Privacy Policy, Shipping Policy, Return & Replacement Policy, Warranty Policy, and any other policies published by KHRONIQ, constitute the complete agreement between the customer and the Company regarding use of this Website."
    },
    {
      title: "24. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p className="text-[11px] text-luxury-muted italic">Born From The Movement Of Time</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-1">
            <p><span className="font-semibold text-luxury-text">Office Address:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010, India</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
        </div>
      )
    }
  ];

  const warrantyData = [
    {
      title: "1. Warranty Coverage",
      content: "Every genuine KHRONIQ watch purchased from KHRONIQ or an Authorized Dealer is covered by a Limited Warranty of Twelve (12) Months from the original date of purchase, unless otherwise specified. This warranty applies only to manufacturing defects in materials and workmanship under normal use."
    },
    {
      title: "2. What is Covered",
      content: (
        <div className="space-y-2">
          <p>The Limited Warranty covers the following components if they fail due to manufacturing defects under normal use:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Manufacturing defects in the watch movement.</li>
            <li>Defects in the dial resulting from manufacturing.</li>
            <li>Manufacturing defects in the watch hands.</li>
            <li>Defective date display mechanism.</li>
            <li>Crown malfunction due to manufacturing defect.</li>
            <li>Defective push buttons (where applicable).</li>
            <li>Manufacturing defects in the watch case.</li>
            <li>Manufacturing defects in the bracelet clasp or buckle.</li>
            <li>Defective deployment clasp due to manufacturing.</li>
            <li>Manufacturing defects affecting normal timekeeping.</li>
            <li>Loose indices or hour markers caused by manufacturing.</li>
            <li>Factory-installed components that fail due to manufacturing defects.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted">KHRONIQ reserves the right to repair, replace, or service the defective component at its sole discretion.</p>
        </div>
      )
    },
    {
      title: "3. What is Not Covered",
      content: (
        <div className="space-y-2">
          <p>This warranty does not cover:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Normal wear and tear.</li>
            <li>Scratches on crystal, case, bracelet, clasp, or buckle.</li>
            <li>Leather strap wear, fading, stretching, cracking, or discoloration.</li>
            <li>Mesh, silicone, rubber, nylon, fabric, or metal strap wear caused by normal use.</li>
            <li>Battery depletion (unless otherwise specified).</li>
            <li>Damage caused by dropping, impact, accidents, or mishandling.</li>
            <li>Water damage due to improper use beyond the stated water-resistance rating.</li>
            <li>Damage caused by chemicals, perfumes, detergents, solvents, cosmetics, or saltwater unless specifically designed for such use.</li>
            <li>Damage caused by excessive heat, fire, smoke, or extreme temperatures.</li>
            <li>Damage resulting from floods, earthquakes, storms, or other natural disasters.</li>
            <li>Damage caused by negligence, misuse, abuse, or improper storage.</li>
            <li>Unauthorized modifications or repairs.</li>
            <li>Removal or alteration of the serial number or QR code.</li>
            <li>Cosmetic changes that do not affect functionality.</li>
            <li>Damage caused during transportation after delivery.</li>
            <li>Loss or theft of the watch or accessories.</li>
          </ul>
        </div>
      )
    },
    {
      title: "4. Warranty Conditions",
      content: (
        <div className="space-y-2">
          <p>To obtain warranty service, the following conditions must be met:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The original purchase invoice must be presented.</li>
            <li>The original KHRONIQ Warranty Card must accompany the watch.</li>
            <li>The serial number must be clearly readable and unaltered.</li>
            <li>The watch must not have been opened or repaired by any unauthorized person.</li>
            <li>Warranty applies only to the original purchaser unless otherwise permitted by law.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic">Failure to satisfy these conditions may result in rejection of the warranty claim.</p>
        </div>
      )
    },
    {
      title: "5. Warranty Claim Procedure",
      content: (
        <div className="space-y-2">
          <p>To request warranty service:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Contact KHRONIQ Customer Support.</li>
            <li>Provide your Order Number or Invoice.</li>
            <li>Share the Model Number and Serial Number.</li>
            <li>Describe the issue along with clear photographs or videos, if requested.</li>
            <li>Follow the shipping instructions provided by our support team.</li>
          </ol>
          <p className="text-[11px] text-luxury-muted">KHRONIQ may inspect the product before approving the warranty claim.</p>
        </div>
      )
    },
    {
      title: "6. Repair or Replacement",
      content: "If a valid manufacturing defect is confirmed, KHRONIQ may, at its sole discretion: repair the defective watch, replace defective components, replace the watch with the same model, or replace the watch with an equivalent model if the original model has been discontinued. Repaired or replaced parts shall become the property of KHRONIQ."
    },
    {
      title: "7. Warranty Period After Repair",
      content: "Repair or replacement under warranty shall not extend or renew the original warranty period. The warranty continues only for the remaining portion of the original warranty."
    },
    {
      title: "8. Shipping for Warranty",
      content: "Where applicable, customers may be responsible for securely packaging and shipping the watch to the designated service center. KHRONIQ is not responsible for damage caused by inadequate packaging during transit. Return shipping arrangements shall be communicated after warranty approval."
    },
    {
      title: "9. Water Resistance",
      content: "Water resistance is not permanent and may diminish over time due to normal wear, aging of seals, accidental impacts, or improper handling. The warranty does not cover water damage resulting from operation of the crown or pushers while underwater, failure to properly secure the crown, use beyond the specified water-resistance rating, or damage caused after unauthorized servicing. Customers should regularly inspect water-resistant watches if frequently exposed to water."
    },
    {
      title: "10. Leather Strap Notice",
      content: "Leather is a natural material and may develop variations in texture, grain, or color over time. Such natural characteristics are not manufacturing defects and are not covered under warranty."
    },
    {
      title: "11. Battery",
      content: "Quartz watch batteries are consumable items. Battery replacement due to normal depletion is not covered unless otherwise stated in the product description."
    },
    {
      title: "12. Exclusions from Liability",
      content: "KHRONIQ shall not be liable for loss of business, loss of profits, emotional distress, indirect or consequential damages, delays caused by courier partners, or delays due to Force Majeure events."
    },
    {
      title: "13. Counterfeit Products",
      content: "This warranty applies only to genuine KHRONIQ products purchased directly from KHRONIQ or an Authorized Dealer. Counterfeit, altered, or unauthorized products are not eligible for warranty service."
    },
    {
      title: "14. Authenticity Verification",
      content: "KHRONIQ may require verification of the Serial Number, QR Code, Purchase Invoice, and Warranty Card before processing any warranty request."
    },
    {
      title: "15. Right to Refuse Warranty",
      content: "KHRONIQ reserves the right to refuse warranty service if the watch is counterfeit, the serial number has been removed or tampered with, the watch has been modified, the defect resulted from misuse or negligence, or if false or misleading information has been provided."
    },
    {
      title: "16. Force Majeure",
      content: "KHRONIQ shall not be responsible for delays in warranty service caused by events beyond its reasonable control, including pandemics, epidemics, natural disasters, floods, earthquakes, fires, wars, strikes, government restrictions, transport disruptions, customs delays, or other Force Majeure events."
    },
    {
      title: "17. Governing Law",
      content: "This Warranty Policy shall be governed by the laws of India. Any dispute arising from this Warranty Policy shall be subject to the exclusive jurisdiction of the competent courts at Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "18. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-0.5">
            <p><span className="font-semibold text-luxury-text">Office Address:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI APARTMENT, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
        </div>
      )
    }
  ];

  const privacyData = [
    {
      title: "1. Company Information",
      content: (
        <div className="space-y-2">
          <p><span className="font-semibold text-luxury-text">Brand:</span> KHRONIQ</p>
          <p><span className="font-semibold text-luxury-text">Owned & Marketed By:</span> True Knock Industries Private Limited</p>
          <p className="font-semibold text-luxury-text mt-1">Registered Office:</p>
          <p className="pl-3 border-l border-luxury-gold-dark/30 italic text-[11px] text-luxury-muted">
            Office No. - 2, Chamber - 4,<br />
            Udaigiri Tower, Kaushambi,<br />
            Ghaziabad, Uttar Pradesh — 201010,<br />
            India
          </p>
          <p><span className="font-semibold text-luxury-text">Website:</span> <a href="https://www.khroniq.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline">www.khroniq.com</a></p>
          <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
        </div>
      )
    },
    {
      title: "2. Information We Collect",
      content: (
        <div className="space-y-3">
          <p>We may collect the following categories of information:</p>
          
          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">Personal Information</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Mobile Number</li>
              <li>Shipping Address</li>
              <li>Billing Address</li>
              <li>Company Name (if applicable)</li>
              <li>GST Number (for business customers)</li>
              <li>Date of Birth (optional)</li>
              <li>Customer ID</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">Order Information</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Order Number</li>
              <li>Product Purchased</li>
              <li>Serial Number</li>
              <li>Warranty Registration Details</li>
              <li>Payment Status</li>
              <li>Shipping Information</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">Technical Information</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>IP Address</li>
              <li>Browser Type</li>
              <li>Device Information</li>
              <li>Operating System</li>
              <li>Time Zone</li>
              <li>Language Preferences</li>
              <li>Website Usage Data</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">Communication Information</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Customer Support Requests</li>
              <li>Emails</li>
              <li>Chat Messages</li>
              <li>Product Reviews</li>
              <li>Feedback</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "3. How We Use Your Information",
      content: (
        <div className="space-y-2">
          <p>Your information may be used to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill orders.</li>
            <li>Deliver products.</li>
            <li>Process payments.</li>
            <li>Provide warranty services.</li>
            <li>Register your watch warranty.</li>
            <li>Verify product authenticity.</li>
            <li>Respond to customer support requests.</li>
            <li>Improve our products and Website.</li>
            <li>Prevent fraud and unauthorized transactions.</li>
            <li>Send order updates.</li>
            <li>Notify you about promotions, launches, and offers (where permitted).</li>
            <li>Comply with legal and regulatory obligations.</li>
          </ul>
        </div>
      )
    },
    {
      title: "4. Payment Information",
      content: "Payments are processed through secure third-party payment gateways. KHRONIQ does not store your complete credit card, debit card, CVV, UPI PIN, or banking credentials on its servers. Payment processing is governed by the privacy policies of the respective payment service providers."
    },
    {
      title: "5. Cookies",
      content: "Our Website may use cookies and similar technologies to remember user preferences, improve browsing experience, analyze Website performance, maintain login sessions, measure Website traffic, and personalize content. You may disable cookies through your browser settings, although certain Website features may not function properly."
    },
    {
      title: "6. Sharing of Information",
      content: (
        <div className="space-y-2">
          <p>We do not sell your personal information. Your information may be shared only with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Courier and logistics partners</li>
            <li>Payment gateways</li>
            <li>Warranty service providers</li>
            <li>Government authorities when legally required</li>
            <li>Technology providers supporting our Website</li>
            <li>Professional advisors including auditors and legal consultants</li>
          </ul>
          <p className="text-[11px] text-luxury-muted">All such parties are expected to maintain appropriate confidentiality.</p>
        </div>
      )
    },
    {
      title: "7. Data Security",
      content: "KHRONIQ implements commercially reasonable administrative, technical, and organizational measures to protect personal information against unauthorized access, disclosure, alteration, or destruction. However, no online system can guarantee absolute security."
    },
    {
      title: "8. Data Retention",
      content: "We retain personal information only for as long as necessary to complete transactions, provide warranty services, comply with legal obligations, resolve disputes, and enforce agreements. Certain financial and tax records may be retained for the period required under applicable laws."
    },
    {
      title: "9. Marketing Communications",
      content: "With your consent or where otherwise permitted by law, we may send promotional emails, SMS, or other communications regarding new collections, exclusive launches, product updates, offers and discounts, and events. You may opt out at any time by using the unsubscribe option or contacting us."
    },
    {
      title: "10. Warranty Registration",
      content: "When registering your KHRONIQ watch, we may collect the Model Number, Serial Number, Purchase Date, Dealer Information, and Invoice Details. This information is used solely for warranty verification, authenticity confirmation, and customer support."
    },
    {
      title: "11. Product Authenticity",
      content: "To protect customers from counterfeit products, KHRONIQ may verify QR Codes, Serial Numbers, Purchase Invoices, and Dealer Information. Information submitted for authenticity verification shall be used only for verification and fraud prevention."
    },
    {
      title: "12. Children's Privacy",
      content: "Our Website is not intended for individuals under the age of 18 years. We do not knowingly collect personal information from children. If we become aware that such information has been collected, we will take reasonable steps to delete it."
    },
    {
      title: "13. Third-Party Links",
      content: "Our Website may contain links to third-party websites. KHRONIQ is not responsible for the privacy practices, content, or policies of such external websites. Users are encouraged to review the privacy policies of those websites separately."
    },
    {
      title: "14. Your Rights",
      content: "Subject to applicable law, you may have the right to access your personal information, request correction of inaccurate information, request deletion where legally permissible, withdraw marketing consent, update your contact details, or request information regarding the processing of your personal data. Requests may be submitted through our customer support email."
    },
    {
      title: "15. Fraud Prevention",
      content: "To protect our customers and business, KHRONIQ may use personal information to detect fraudulent transactions, prevent payment fraud, verify customer identity, investigate suspicious activities, or comply with law enforcement requests where legally required."
    },
    {
      title: "16. International Users",
      content: "If you access our Website from outside India, you acknowledge that your information may be transferred to, processed, and stored in India or other jurisdictions where our service providers operate, subject to applicable legal requirements."
    },
    {
      title: "17. Changes to This Policy",
      content: "KHRONIQ reserves the right to amend or update this Privacy Policy at any time. Any revised version will be published on this Website with the updated Effective Date. Continued use of the Website constitutes acceptance of the revised Privacy Policy."
    },
    {
      title: "18. Governing Law",
      content: "This Privacy Policy shall be governed by the laws of India. Any dispute arising out of or relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the competent courts at Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "19. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-0.5">
            <p><span className="font-semibold text-luxury-text">Office Address:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010, India</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
        </div>
      )
    }
  ];

  const cancellationData = [
    {
      title: "1. Company Information",
      content: (
        <div className="space-y-2">
          <p><span className="font-semibold text-luxury-text">Brand:</span> KHRONIQ</p>
          <p><span className="font-semibold text-luxury-text">Owned & Marketed By:</span> True Knock Industries Private Limited</p>
          <p className="font-semibold text-luxury-text mt-1">Registered Office:</p>
          <p className="pl-3 border-l border-luxury-gold-dark/30 italic text-[11px] text-luxury-muted">
            OFFICE NO. - 2, CHAMBER - 4,<br />
            UDAIGIRI TOWER, KAUSHAMBI,<br />
            GHAZIABAD, UTTAR PRADESH — 201010,<br />
            India
          </p>
          <p><span className="font-semibold text-luxury-text">Website:</span> <a href="https://www.khroniq.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline">www.khroniq.com</a></p>
          <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
        </div>
      )
    },
    {
      title: "2. Order Cancellation by Customer",
      content: (
        <div className="space-y-2">
          <p>Customers may request cancellation of an order only before the order has been dispatched from our warehouse.</p>
          <p>Cancellation requests should be submitted as soon as possible by contacting KHRONIQ Customer Support with the following details:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Order Number</li>
            <li>Customer Name</li>
            <li>Registered Email Address</li>
            <li>Registered Mobile Number</li>
            <li>Reason for Cancellation</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">Cancellation requests received after dispatch cannot be accepted and will be governed by the applicable Return & Refund Policy.</p>
        </div>
      )
    },
    {
      title: "3. Cancellation of Prepaid Orders",
      content: (
        <div className="space-y-2">
          <p>If a prepaid order is successfully cancelled before dispatch:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The full product amount paid by the customer will be refunded to the original payment method.</li>
            <li>Refund processing shall generally be initiated within 7–10 Business Days after cancellation approval.</li>
            <li>The actual credit timeline may vary depending on the customer's bank, card issuer, UPI provider, or payment gateway.</li>
          </ul>
        </div>
      )
    },
    {
      title: "4. Cancellation of Cash on Delivery (COD) Orders",
      content: (
        <div className="space-y-2">
          <p>Where Cash on Delivery (COD) is available:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>COD orders may be cancelled before dispatch without any cancellation charges.</li>
            <li>Repeated cancellation of COD orders may result in temporary or permanent restriction of COD services for the customer.</li>
            <li>KHRONIQ reserves the right to require prepaid payment for future orders from customers with excessive cancellations.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Orders That Cannot Be Cancelled",
      content: (
        <div className="space-y-2">
          <p>The following orders cannot be cancelled once confirmed or dispatched:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Orders already shipped.</li>
            <li>Customized or engraved watches.</li>
            <li>Personalized products.</li>
            <li>Special-order or made-to-order products.</li>
            <li>Limited Edition products specifically manufactured against customer orders.</li>
            <li>Orders already delivered.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">Such orders shall be governed by the applicable Return, Refund, Replacement, or Warranty Policies, where eligible.</p>
        </div>
      )
    },
    {
      title: "6. Cancellation by KHRONIQ",
      content: (
        <div className="space-y-2">
          <p>KHRONIQ reserves the right to cancel any order, in whole or in part, at its sole discretion, including but not limited to the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Product becomes unavailable.</li>
            <li>Pricing error.</li>
            <li>Technical error on the Website.</li>
            <li>Payment verification failure.</li>
            <li>Fraudulent or suspicious transactions.</li>
            <li>Violation of our Terms & Conditions.</li>
            <li>Incomplete or incorrect customer information.</li>
            <li>Delivery to restricted or non-serviceable locations.</li>
            <li>Regulatory or legal restrictions.</li>
            <li>Events beyond our reasonable control.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">Where payment has already been received for a cancelled order, an eligible refund shall be processed in accordance with this Policy.</p>
        </div>
      )
    },
    {
      title: "7. Price or Typographical Errors",
      content: "Despite our best efforts, pricing inaccuracies, typographical errors, incorrect product descriptions, or system errors may occasionally occur. KHRONIQ reserves the right to cancel affected orders even after order confirmation. In such cases, customers shall receive a full refund of the amount paid."
    },
    {
      title: "8. Fraud Prevention",
      content: (
        <div className="space-y-2">
          <p>KHRONIQ actively monitors transactions to prevent fraud. Orders may be cancelled where:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identity verification fails.</li>
            <li>Payment appears unauthorized.</li>
            <li>Multiple suspicious transactions are detected.</li>
            <li>False customer information is provided.</li>
            <li>Chargeback abuse is suspected.</li>
            <li>The order violates applicable laws or our policies.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">KHRONIQ may request additional verification before processing certain orders.</p>
        </div>
      )
    },
    {
      title: "9. Refund After Cancellation",
      content: (
        <div className="space-y-2">
          <p>Approved refunds shall be processed through the original payment method used during purchase.</p>
          <p>Refund timelines may vary depending on Bank processing, Card issuer processing, UPI settlement, or Payment gateway processing. KHRONIQ shall not be responsible for delays caused by financial institutions or payment service providers.</p>
        </div>
      )
    },
    {
      title: "10. Promotional Orders",
      content: "If an order placed under a promotional offer, discount campaign, coupon, cashback program, or bundle offer is cancelled, the refund amount shall be calculated based on the actual amount paid after applying the relevant discounts or promotional benefits."
    },
    {
      title: "11. Force Majeure",
      content: "KHRONIQ shall not be liable for delays in cancellation processing or refunds resulting from circumstances beyond its reasonable control, including but not limited to pandemics, floods, earthquakes, fires, natural disasters, government restrictions, curfews, wars, civil unrest, labour strikes, transport disruptions, customs delays, internet outages, cyber incidents, payment gateway failures, or any other Force Majeure event."
    },
    {
      title: "12. Policy Modifications",
      content: "KHRONIQ reserves the right to amend, modify, or update this Cancellation Policy at any time without prior notice. The latest version shall always be available on www.khroniq.com. Continued use of the Website after such modifications constitutes acceptance of the revised Policy."
    },
    {
      title: "13. Governing Law & Jurisdiction",
      content: "This Cancellation Policy shall be governed by and interpreted in accordance with the laws of India. Any dispute arising out of or relating to this Policy shall be subject to the exclusive jurisdiction of the competent courts at Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "14. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-0.5">
            <p><span className="font-semibold text-luxury-text">Registered Office:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010, India</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
          <p className="text-[11px] text-luxury-muted italic mt-2">If you wish to cancel an order or have any questions regarding this Cancellation Policy, please contact our Customer Support team before your order is dispatched. By placing an order through www.khroniq.com, you acknowledge that you have read, understood, and agreed to this Cancellation Policy.</p>
        </div>
      )
    }
  ];

  const cookieData = [
    {
      title: "1. Company Information",
      content: (
        <div className="space-y-2">
          <p><span className="font-semibold text-luxury-text">Brand:</span> KHRONIQ</p>
          <p><span className="font-semibold text-luxury-text">Owned & Marketed By:</span> True Knock Industries Private Limited</p>
          <p className="font-semibold text-luxury-text mt-1">Registered Office:</p>
          <p className="pl-3 border-l border-luxury-gold-dark/30 italic text-[11px] text-luxury-muted">
            OFFICE NO. - 2, CHAMBER - 4,<br />
            UDAIGIRI TOWER, KAUSHAMBI,<br />
            GHAZIABAD, UTTAR PRADESH — 201010,<br />
            India
          </p>
          <p><span className="font-semibold text-luxury-text">Website:</span> <a href="https://www.khroniq.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline">www.khroniq.com</a></p>
          <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
        </div>
      )
    },
    {
      title: "2. What Are Cookies?",
      content: "Cookies are small text files stored on your computer, smartphone, tablet, or other device when you visit a website. Cookies help websites recognize your device, remember your preferences, improve website performance, and provide a better browsing experience. Cookies do not normally contain information that directly identifies you; however, they may be associated with information you voluntarily provide to us."
    },
    {
      title: "3. Types of Cookies We Use",
      content: (
        <div className="space-y-3">
          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">A. Essential Cookies</p>
            <p className="mb-1">These cookies are necessary for the operation of our Website and cannot be disabled through our systems. They help us:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Enable secure browsing.</li>
              <li>Maintain login sessions.</li>
              <li>Process shopping cart functions.</li>
              <li>Complete checkout.</li>
              <li>Protect against fraudulent activity.</li>
              <li>Improve website security.</li>
            </ul>
            <p className="text-[11px] text-luxury-muted italic mt-1">Without these cookies, certain Website features may not function correctly.</p>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">B. Performance & Analytics Cookies</p>
            <p className="mb-1">These cookies help us understand how visitors interact with our Website by collecting anonymous information such as:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Pages visited</li>
              <li>Time spent on pages</li>
              <li>Website traffic</li>
              <li>Visitor behaviour</li>
              <li>Device type</li>
              <li>Browser type</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">C. Functional Cookies</p>
            <p className="mb-1">These cookies remember your preferences and settings, including:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Preferred language</li>
              <li>Country selection</li>
              <li>Currency preference (where applicable)</li>
              <li>Saved shopping cart</li>
              <li>Login preferences</li>
              <li>User interface settings</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">D. Marketing & Advertising Cookies</p>
            <p className="mb-1">With your consent, these cookies may be used to:</p>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>Display relevant advertisements.</li>
              <li>Measure advertising performance.</li>
              <li>Limit repeated advertisements.</li>
              <li>Deliver personalized marketing content.</li>
              <li>Support promotional campaigns.</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-luxury-text uppercase text-[9px] tracking-wider mb-1">E. Third-Party Cookies</p>
            <p className="mb-1">Certain features of our Website may rely on third-party services that may place cookies on your device, including but not limited to payment gateways, analytics providers, customer support platforms, social media integrations, video hosting services, and marketing tools. KHRONIQ does not control the cookies placed by third-party services.</p>
          </div>
        </div>
      )
    },
    {
      title: "4. How We Use Cookies",
      content: (
        <div className="space-y-2">
          <p>Cookies may be used to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Improve Website functionality.</li>
            <li>Remember user preferences.</li>
            <li>Process purchases securely.</li>
            <li>Maintain shopping carts.</li>
            <li>Prevent fraudulent activity.</li>
            <li>Analyze Website performance.</li>
            <li>Understand customer behaviour.</li>
            <li>Improve products and services.</li>
            <li>Enhance Website security.</li>
            <li>Deliver personalized content and promotions.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Managing Cookies",
      content: (
        <div className="space-y-2">
          <p>Most web browsers allow you to view stored cookies, delete cookies, block all cookies, block third-party cookies, or receive notifications before cookies are stored.</p>
          <p className="text-[11px] text-luxury-muted italic">Disabling cookies may affect the functionality of certain areas of the Website, including account login, shopping cart, and checkout.</p>
        </div>
      )
    },
    {
      title: "6. Third-Party Services",
      content: "KHRONIQ may use trusted third-party service providers for secure payment processing, website analytics, shipping and logistics, customer communication, marketing campaigns, and performance monitoring. These providers may use cookies in accordance with their own privacy policies."
    },
    {
      title: "7. Data Protection",
      content: "Information collected through cookies is handled in accordance with the KHRONIQ Privacy Policy and applicable data protection laws. KHRONIQ implements reasonable administrative, technical, and organizational safeguards to protect information collected through cookies."
    },
    {
      title: "8. Policy Updates",
      content: "KHRONIQ reserves the right to modify or update this Cookie Policy at any time without prior notice. The latest version will always be available on www.khroniq.com. Continued use of the Website after changes become effective constitutes acceptance of the updated Cookie Policy."
    },
    {
      title: "9. Governing Law & Jurisdiction",
      content: "This Cookie Policy shall be governed by and interpreted in accordance with the laws of India. Any dispute arising out of or relating to this Cookie Policy shall be subject to the exclusive jurisdiction of the competent courts at Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "10. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-0.5">
            <p><span className="font-semibold text-luxury-text">Registered Office:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010, India</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
          <p className="text-[11px] text-luxury-muted italic mt-2">If you have any questions regarding this Cookie Policy or how cookies are used on our Website, please contact us using the details above. By continuing to use www.khroniq.com, you acknowledge that you have read, understood, and agreed to this Cookie Policy.</p>
        </div>
      )
    }
  ];

  const codData = [
    {
      title: "1. Company Information",
      content: (
        <div className="space-y-2">
          <p><span className="font-semibold text-luxury-text">Brand:</span> KHRONIQ</p>
          <p><span className="font-semibold text-luxury-text">Owned & Marketed By:</span> True Knock Industries Private Limited</p>
          <p className="font-semibold text-luxury-text mt-1">Registered Office:</p>
          <p className="pl-3 border-l border-luxury-gold-dark/30 italic text-[11px] text-luxury-muted">
            OFFICE NO. - 2, CHAMBER - 4,<br />
            UDAIGIRI TOWER, KAUSHAMBI,<br />
            GHAZIABAD, UTTAR PRADESH — 201010,<br />
            India
          </p>
          <p><span className="font-semibold text-luxury-text">Website:</span> <a href="https://www.khroniq.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline">www.khroniq.com</a></p>
          <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
        </div>
      )
    },
    {
      title: "2. Cash on Delivery (COD)",
      content: "KHRONIQ currently does not offer Cash on Delivery (COD) as a payment option. All orders placed through our Website must be paid in full at the time of purchase using one of our supported online payment methods."
    },
    {
      title: "3. Accepted Payment Methods",
      content: (
        <div className="space-y-2">
          <p>Customers may complete their purchase using secure online payment options, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>UPI</li>
            <li>Credit Cards</li>
            <li>Debit Cards</li>
            <li>Net Banking</li>
            <li>Digital Wallets (where available)</li>
            <li>Other payment methods displayed during checkout</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">All payments are processed through secure payment gateways.</p>
        </div>
      )
    },
    {
      title: "4. Why COD is Not Available",
      content: (
        <div className="space-y-2">
          <p>To ensure a secure and efficient shopping experience, KHRONIQ operates on a 100% prepaid order model. This helps us:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verify genuine customer orders.</li>
            <li>Reduce fraudulent transactions.</li>
            <li>Ensure faster order processing and dispatch.</li>
            <li>Maintain inventory accuracy.</li>
            <li>Provide a seamless customer experience.</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Order Confirmation",
      content: "An order will be confirmed only after successful payment authorization. Customers will receive an order confirmation via email and/or SMS once payment has been successfully received."
    },
    {
      title: "6. Payment Security",
      content: "KHRONIQ does not store customers' payment card details. Payments are processed using trusted third-party payment service providers that employ industry-standard encryption and security measures."
    },
    {
      title: "7. Payment Failure",
      content: (
        <div className="space-y-2">
          <p>If a payment fails or remains incomplete:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The order will not be confirmed.</li>
            <li>Products will not be reserved indefinitely.</li>
            <li>Customers may place a new order after successful payment.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">KHRONIQ is not responsible for payment failures caused by banks, payment gateways, internet connectivity issues, or other third-party service interruptions.</p>
        </div>
      )
    },
    {
      title: "8. Refunds",
      content: "Where a refund is approved under the applicable Return & Refund Policy or Cancellation Policy, the amount will be refunded to the original payment method used during the purchase. Refund processing timelines are subject to the relevant policy and the processing time of banks or payment service providers."
    },
    {
      title: "9. Future Availability of COD",
      content: "KHRONIQ may introduce Cash on Delivery (COD) for selected products, locations, or customers in the future. If COD becomes available, the applicable terms and conditions will be published on www.khroniq.com and may vary based on order value, delivery location, customer history, or operational requirements."
    },
    {
      title: "10. Policy Modifications",
      content: "KHRONIQ reserves the right to amend, modify, suspend, or discontinue this COD Policy at any time without prior notice. The latest version will always be available on www.khroniq.com. Continued use of the Website constitutes acceptance of the updated Policy."
    },
    {
      title: "11. Governing Law & Jurisdiction",
      content: "This COD Policy shall be governed by and interpreted in accordance with the laws of India. Any dispute arising out of or relating to this Policy shall be subject to the exclusive jurisdiction of the competent courts at Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "12. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-0.5">
            <p><span className="font-semibold text-luxury-text">Registered Office:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010, India</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
          <p className="text-[11px] text-luxury-muted italic mt-2">If you have any questions regarding payment methods or this Cash on Delivery (COD) Policy, please contact our Customer Support team. By placing an order through www.khroniq.com, you acknowledge that you have read, understood, and agreed to this Cash on Delivery (COD) Policy.</p>
        </div>
      )
    }
  ];

  const disclaimerData = [
    {
      title: "1. Company Information",
      content: (
        <div className="space-y-2">
          <p><span className="font-semibold text-luxury-text">Brand:</span> KHRONIQ</p>
          <p><span className="font-semibold text-luxury-text">Owned & Marketed By:</span> True Knock Industries Private Limited</p>
          <p className="font-semibold text-luxury-text mt-1">Registered Office:</p>
          <p className="pl-3 border-l border-luxury-gold-dark/30 italic text-[11px] text-luxury-muted">
            OFFICE NO. - 2, CHAMBER - 4,<br />
            UDAIGIRI TOWER, KAUSHAMBI,<br />
            GHAZIABAD, UTTAR PRADESH — 201010,<br />
            India
          </p>
          <p><span className="font-semibold text-luxury-text">Website:</span> <a href="https://www.khroniq.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold-dark hover:underline">www.khroniq.com</a></p>
          <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
        </div>
      )
    },
    {
      title: "2. General Information",
      content: "The information provided on this Website is intended for general informational and commercial purposes only. While KHRONIQ makes reasonable efforts to ensure that the information on this Website is accurate and up to date, we do not guarantee that all content is complete, current, accurate, or free from errors."
    },
    {
      title: "3. Product Information",
      content: (
        <div className="space-y-2">
          <p>KHRONIQ strives to accurately display product specifications, descriptions, dimensions, colours, finishes, and images. However:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Product colours may vary depending on screen settings and lighting.</li>
            <li>Natural leather straps may display variations in grain, texture, and colour.</li>
            <li>Minor differences in finishing, polishing, or appearance may occur due to manufacturing processes.</li>
            <li>Product packaging may change without prior notice.</li>
            <li>Product specifications may be updated to improve quality or performance.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">Such variations shall not be considered manufacturing defects.</p>
        </div>
      )
    },
    {
      title: "4. Watch Accuracy Disclaimer",
      content: "Quartz and other watch movements may exhibit minor variations in timekeeping within industry-accepted tolerances. Such normal deviations do not constitute manufacturing defects."
    },
    {
      title: "5. Water Resistance Disclaimer",
      content: (
        <div className="space-y-2">
          <p>Water resistance ratings indicate laboratory-tested performance under controlled conditions. Water resistance is not permanent and may decrease over time due to normal wear and tear, aging of seals and gaskets, accidental impacts, improper handling, or unauthorized servicing.</p>
          <p className="text-[11px] text-luxury-muted italic">Customers should always follow the water-resistance instructions provided with the product. KHRONIQ shall not be responsible for damage resulting from improper use beyond the specified water-resistance rating.</p>
        </div>
      )
    },
    {
      title: "6. Warranty Disclaimer",
      content: "Warranty coverage is governed exclusively by the KHRONIQ Warranty Policy. This Disclaimer does not extend, modify, or replace any warranty offered by KHRONIQ."
    },
    {
      title: "7. Pricing Disclaimer",
      content: "Prices displayed on the Website are subject to change without prior notice. Despite our best efforts, pricing or typographical errors may occasionally occur. KHRONIQ reserves the right to cancel or refuse any order resulting from incorrect pricing, product descriptions, or technical errors."
    },
    {
      title: "8. Website Availability",
      content: "KHRONIQ does not guarantee uninterrupted or error-free operation of this Website. The Website may be temporarily unavailable due to scheduled maintenance, software updates, technical issues, internet outages, cybersecurity measures, or circumstances beyond our reasonable control."
    },
    {
      title: "9. Third-Party Links",
      content: "This Website may contain links to third-party websites or services. KHRONIQ does not control, endorse, or assume responsibility for the content, products, services, privacy practices, or policies of any third-party website. Users access such websites at their own risk."
    },
    {
      title: "10. Intellectual Property",
      content: "All Website content, including but not limited to KHRONIQ name, logos, product designs, watch dial designs, photographs, videos, graphics, packaging, product descriptions, QR Codes, Model Numbers, Serial Number systems, website design, software, and marketing materials is the exclusive property of True Knock Industries Private Limited and is protected by applicable intellectual property laws. Unauthorized use, reproduction, distribution, modification, or commercial exploitation is strictly prohibited."
    },
    {
      title: "11. Product Authenticity",
      content: "Only products purchased directly from KHRONIQ or its authorized dealers are guaranteed to be genuine. KHRONIQ is not responsible for counterfeit, altered, refurbished, or unauthorized products purchased from third parties. Customers are encouraged to verify authenticity using official serial numbers or QR codes, where applicable."
    },
    {
      title: "12. Limitation of Liability",
      content: (
        <div className="space-y-2">
          <p>To the fullest extent permitted by applicable law, KHRONIQ shall not be liable for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Indirect, incidental, special, or consequential damages.</li>
            <li>Loss of profits or business opportunities.</li>
            <li>Loss of goodwill or reputation.</li>
            <li>Loss of data.</li>
            <li>Delay in delivery caused by courier partners.</li>
            <li>Website interruptions or technical failures.</li>
            <li>Customer misuse of products or unauthorized repairs.</li>
          </ul>
          <p className="text-[11px] text-luxury-muted italic mt-1">KHRONIQ's total liability shall not exceed the purchase price actually paid for the product giving rise to the claim.</p>
        </div>
      )
    },
    {
      title: "13. User Responsibility",
      content: "Users are responsible for providing accurate information, maintaining account security, reviewing product specifications before purchase, following product care instructions, and using products in accordance with the User Manual and Warranty Policy. Improper use of products may void applicable warranty coverage."
    },
    {
      title: "14. Force Majeure",
      content: "KHRONIQ shall not be liable for any delay or failure in performing its obligations due to events beyond its reasonable control, including but not limited to pandemics, epidemics, floods, earthquakes, fires, natural disasters, government restrictions, curfews, transport disruptions, customs delays, power failures, internet outages, cyber incidents, war, terrorism, civil unrest, labour strikes, or lockouts."
    },
    {
      title: "15. Changes to This Disclaimer",
      content: "KHRONIQ reserves the right to amend or update this Disclaimer at any time without prior notice. The latest version shall always be available on www.khroniq.com. Continued use of the Website constitutes acceptance of the revised Disclaimer."
    },
    {
      title: "16. Governing Law & Jurisdiction",
      content: "This Disclaimer shall be governed by and interpreted in accordance with the laws of India. Any dispute arising out of or relating to this Disclaimer shall be subject to the exclusive jurisdiction of the competent courts at Lucknow, Uttar Pradesh, unless otherwise required by applicable law."
    },
    {
      title: "17. Contact Us",
      content: (
        <div className="space-y-2">
          <p className="font-bold text-luxury-text">KHRONIQ</p>
          <p>A Premium Watch Brand by True Knock Industries Private Limited</p>
          <div className="pl-3 border-l border-luxury-gold-dark/30 text-[11px] text-luxury-muted space-y-0.5">
            <p><span className="font-semibold text-luxury-text">Registered Office:</span> OFFICE NO. - 2, CHAMBER - 4, UDAIGIRI TOWER, KAUSHAMBI, GHAZIABAD, UTTAR PRADESH — 201010, India</p>
            <p><span className="font-semibold text-luxury-text">Website:</span> www.khroniq.com</p>
            <p><span className="font-semibold text-luxury-text">Email:</span> support@khroniq.com</p>
          </div>
          <p className="text-[11px] text-luxury-muted italic mt-2">If you have any questions regarding this Disclaimer or the use of this Website, please contact us using the details above. By accessing or using www.khroniq.com, you acknowledge that you have read, understood, and agreed to this Disclaimer.</p>
        </div>
      )
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
      <div className="flex flex-wrap justify-center border-b border-luxury-text/10 max-w-4xl mx-auto gap-y-1">
        {[
          { key: 'about', label: 'Our Story' },
          { key: 'contact', label: 'Boutique Contact' },
          { key: 'shipping', label: 'Shipping Policy' },
          { key: 'cancellation', label: 'Cancellation Policy' },
          { key: 'exchange', label: 'Exchange Policy' },
          { key: 'refund', label: 'Refund Policy' },
          { key: 'warranty', label: 'Warranty Policy' },
          { key: 'privacy', label: 'Privacy Policy' },
          { key: 'cookie', label: 'Cookie Policy' },
          { key: 'cod', label: 'COD Policy' },
          { key: 'disclaimer', label: 'Disclaimer' },
          { key: 'faq', label: 'Client FAQ' },
          { key: 'blogs', label: 'Blogs & Editorial' },
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

        {/* SHIPPING POLICY TAB */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Shipping Policy</h3>
            <div className="space-y-4">
              <p>
                We offer complementary insured priority shipping on all KHRONIQ acquisitions worldwide. Every shipment is carefully packaged in a secure, unbranded outer box to guarantee discretion and security.
              </p>
              <p>
                <strong>Delivery Timelines:</strong>
                <br />
                - Ready Stock: Dispatched within 24-48 hours, arriving within 3-5 business days.
                <br />
                - Bespoke / Customized Pieces: Handcrafted to order; delivery takes approximately 4-6 weeks.
              </p>
              <p>
                <strong>Secure Signature Required:</strong>
                <br />
                Due to the high value of our horological products, all shipments require a physical signature by an adult upon delivery. Packages will not be left at doorsteps or with neighbors under any circumstances.
              </p>
            </div>
          </div>
        )}

        {/* CANCELLATION POLICY TAB */}
        {activeTab === 'cancellation' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Cancellation Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {cancellationData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`cancellation-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <p className="text-[11px] text-luxury-muted italic mb-4">Effective Date: 1st July 2026</p>
                <p className="text-[11px] text-luxury-muted mb-4">
                  Welcome to KHRONIQ, a premium watch brand owned and marketed by True Knock Industries Private Limited (&quot;KHRONIQ&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This Cancellation Policy explains the terms and conditions under which an order placed through https://www.khroniq.com/ may be cancelled. By placing an order on our Website, you agree to this Cancellation Policy.
                </p>
                {cancellationData.map((item, idx) => (
                  <section key={idx} id={`cancellation-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXCHANGE POLICY TAB */}
        {activeTab === 'exchange' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Exchange Policy</h3>
            <div className="space-y-4">
              <p>
                We strive for absolute satisfaction with every purchase. If your timepiece does not fit your expectation, we accommodate sizing and model exchanges.
              </p>
              <p>
                <strong>Exchange Criteria:</strong>
                <br />
                - Ready-stock timepieces are eligible for exchange within 14 days of receipt.
                <br />
                - The watch must be unworn, unmodified, and in pristine condition with all protective seals, wrapping, and tags intact.
              </p>
              <p>
                <strong>Bespoke Exclusions:</strong>
                <br />
                Customized or engraved watches are uniquely manufactured to your specifications and are not eligible for exchanges unless a clear manufacturing defect is present.
              </p>
            </div>
          </div>
        )}

        {/* REFUND POLICY TAB */}
        {activeTab === 'refund' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Refund Policy</h3>
            <div className="space-y-4">
              <p>
                Our refund window is open for 14 days starting from the date of physical package receipt.
              </p>
              <p>
                <strong>Refund Process:</strong>
                <br />
                1. Request a return through your customer profile or contact our Concierge Desk.
                <br />
                2. Our secure courier will coordinate a complimentary pick-up from your shipping address.
                <br />
                3. Once received at our manufacture, the timepiece undergoes a rigorous inspection.
                <br />
                4. Following approval, refunds are credited back to your original payment method within 7-10 business days.
              </p>
              <p>
                <strong>Non-Refundable Items:</strong>
                <br />
                Any timepiece showing signs of wear, sizing modifications (e.g. link removal), or missing original box/papers cannot be refunded. Bespoke engraved or custom-configured watches are non-refundable.
              </p>
            </div>
          </div>
        )}

        {/* WARRANTY POLICY TAB */}
        {activeTab === 'warranty' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Warranty Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {warrantyData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`warranty-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <p className="text-[11px] text-luxury-muted italic mb-4">Effective Date: 1st July 2026</p>
                <p className="text-[11px] text-luxury-muted mb-4">
                  Welcome to KHRONIQ. Every KHRONIQ timepiece is carefully inspected and tested before dispatch. This Warranty Policy explains the scope of warranty coverage, eligibility, exclusions, and the procedure for obtaining warranty service.
                </p>
                {warrantyData.map((item, idx) => (
                  <section key={idx} id={`warranty-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY TAB */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Privacy Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {privacyData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`privacy-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <p className="text-[11px] text-luxury-muted italic mb-4">Effective Date: 1st July 2026</p>
                {privacyData.map((item, idx) => (
                  <section key={idx} id={`privacy-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COOKIE POLICY TAB */}
        {activeTab === 'cookie' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Cookie Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {cookieData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`cookie-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <p className="text-[11px] text-luxury-muted italic mb-4">Effective Date: 1st July 2026</p>
                <p className="text-[11px] text-luxury-muted mb-4">
                  Welcome to KHRONIQ, a premium watch brand owned and marketed by True Knock Industries Private Limited (&quot;KHRONIQ&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This Cookie Policy explains how we use cookies and similar technologies when you visit https://www.khroniq.com/ (&quot;Website&quot;). By accessing or using our Website, you consent to the use of cookies in accordance with this Cookie Policy.
                </p>
                {cookieData.map((item, idx) => (
                  <section key={idx} id={`cookie-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COD POLICY TAB */}
        {activeTab === 'cod' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Cash on Delivery (COD) Policy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {codData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`cod-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <p className="text-[11px] text-luxury-muted italic mb-4">Effective Date: 1st July 2026</p>
                <p className="text-[11px] text-luxury-muted mb-4">
                  Welcome to KHRONIQ, a premium watch brand owned and marketed by True Knock Industries Private Limited (&quot;KHRONIQ&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). At present, Cash on Delivery (COD) is not available for any orders placed through https://www.khroniq.com/. This Policy explains our payment terms regarding COD.
                </p>
                {codData.map((item, idx) => (
                  <section key={idx} id={`cod-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DISCLAIMER TAB */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Disclaimer & Legal Notice</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {disclaimerData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`disclaimer-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <p className="text-[11px] text-luxury-muted italic mb-4">Effective Date: 1st July 2026</p>
                <p className="text-[11px] text-luxury-muted mb-4">
                  Welcome to KHRONIQ, a premium watch brand owned and marketed by True Knock Industries Private Limited (&quot;KHRONIQ&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This Disclaimer governs your use of https://www.khroniq.com/ (&quot;Website&quot;). By accessing or using this Website, you acknowledge that you have read, understood, and agreed to this Disclaimer.
                </p>
                {disclaimerData.map((item, idx) => (
                  <section key={idx} id={`disclaimer-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
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

        {/* BLOGS & EDITORIAL TAB */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Blogs & Editorial</h3>
            
            {blogs.length === 0 ? (
              <p className="text-luxury-muted text-xs italic text-center p-6 border border-dashed border-luxury-text/10 rounded">No editorial posts available at this time.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <div key={blog.id || blog._id} className="group border border-luxury-text/10 hover:border-luxury-gold-dark/40 rounded overflow-hidden flex flex-col bg-luxury-bg/5 transition duration-300">
                    <div className="h-44 overflow-hidden relative bg-black">
                      <img 
                        src={blog.image || '/assets/media__1782899491225.jpg'} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-bold text-luxury-gold-dark uppercase tracking-wider">
                          <span>{blog.category}</span>
                          <span className="text-luxury-muted/70">{blog.date}</span>
                        </div>
                        <h4 className="text-luxury-text font-serif font-bold text-base leading-snug group-hover:text-luxury-gold-dark transition">{blog.title}</h4>
                        <p className="text-luxury-muted text-[11px] font-light leading-relaxed line-clamp-3">{blog.content}</p>
                      </div>
                      <button
                        onClick={() => setSelectedBlog(blog)}
                        className="text-[10px] font-bold text-luxury-gold-dark hover:text-luxury-text transition tracking-widest uppercase flex items-center gap-1 cursor-pointer self-start"
                      >
                        Read Article <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Read Blog Overlay Modal */}
            {selectedBlog && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white border border-luxury-text/10 p-6 sm:p-8 rounded-md w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto relative">
                  <button 
                    onClick={() => setSelectedBlog(null)} 
                    className="absolute top-4 right-4 text-luxury-muted hover:text-luxury-text p-1 cursor-pointer transition"
                  >
                    <X size={20} />
                  </button>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-luxury-gold-dark uppercase tracking-widest">
                      <span>{selectedBlog.category}</span>
                      <span>·</span>
                      <span className="text-luxury-muted/70">By {selectedBlog.author}</span>
                      <span>·</span>
                      <span className="text-luxury-muted/70">{selectedBlog.date}</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-text leading-tight">{selectedBlog.title}</h2>
                    <div className="w-12 h-[2px] bg-luxury-gold-dark mt-2" />

                    {selectedBlog.image && (
                      <div className="h-64 sm:h-80 w-full overflow-hidden rounded bg-black">
                        <img 
                          src={selectedBlog.image} 
                          alt={selectedBlog.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <p className="text-luxury-muted text-xs leading-relaxed font-light whitespace-pre-wrap pt-2 font-sans">
                      {selectedBlog.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEGAL POLICIES TAB */}
        {activeTab === 'policies' && (
          <div className="space-y-6 text-xs text-luxury-muted leading-relaxed font-light">
            <h3 className="text-lg font-bold text-luxury-text font-serif uppercase tracking-wide">Terms, Privacy & Policies</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
              {/* Sticky Sidebar Table of Contents */}
              <div className="md:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-2 border-r border-luxury-text/10 sticky top-24 hidden md:block">
                <p className="text-[10px] font-bold text-luxury-text uppercase tracking-widest mb-3">Table of Contents</p>
                {policiesData.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(`policy-section-${idx}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="block text-left w-full text-[10px] py-1.5 px-2 hover:bg-luxury-gold-dark/5 hover:text-luxury-gold-dark transition rounded font-medium truncate cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              {/* Scrollable Policy Text */}
              <div className="md:col-span-8 space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {policiesData.map((item, idx) => (
                  <section key={idx} id={`policy-section-${idx}`} className="space-y-2 scroll-mt-24 pb-4 border-b border-luxury-text/5 last:border-b-0">
                    <h4 className="font-bold text-luxury-text uppercase text-[10px] tracking-wider">{item.title}</h4>
                    <div className="text-[11px] font-light text-luxury-muted leading-relaxed">
                      {item.content}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
