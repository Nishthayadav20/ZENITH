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
          { key: 'exchange', label: 'Exchange Policy' },
          { key: 'refund', label: 'Refund Policy' },
          { key: 'warranty', label: 'Warranty Policy' },
          { key: 'privacy', label: 'Privacy Policy' },
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
