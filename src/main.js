import './nav.js';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

  async function fetchWebsiteSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}website-settings/`);
      if (response.ok) {
        const data = await response.json();
        applyWebsiteSettings(data);
      } else {
        console.warn('Failed to fetch website settings');
      }
    } catch (error) {
      console.error('Error fetching website settings:', error);
    }
  }

  window.activeSettingsData = null;
  function applyWebsiteSettings(data) {
    window.activeSettingsData = data;
    if (data.whatsapp_link) {
      document.querySelectorAll('[data-setting="whatsapp-link"]').forEach(link => {
        if (link.href && link.href.includes('?text=')) {
          const textParam = link.href.split('?text=')[1];
          link.href = `${data.whatsapp_link}?text=${textParam}`;
        } else {
          link.href = data.whatsapp_link;
        }
      });
      window.__dynamicWhatsAppLink = data.whatsapp_link;
    }

    if (data.email_address) {
      document.querySelectorAll('[data-setting="email"]').forEach(el => {
        if (el.tagName.toLowerCase() === 'a') {
          el.href = `mailto:${data.email_address}`;
          el.textContent = data.email_address;
        } else {
          el.textContent = data.email_address;
        }
      });
    }

    if (data.instagram_url) {
      document.querySelectorAll('[data-setting="instagram-link"]').forEach(link => {
        link.href = data.instagram_url;
      });
    }

    const formatAddress = (obj) => {
      if (!obj) return '';
      const parts = [];
      if (obj.address) parts.push(obj.address);
      if (obj.city) parts.push(obj.city);
      if (obj.state) parts.push(obj.state);
      let result = parts.join(', ');
      if (obj.pin) result += (result ? ' - ' : '') + obj.pin;
      return result;
    };

    if (data.marketed_by) {
      document.querySelectorAll('[data-setting="marketed-by-block"]').forEach(block => {
        const addrStr = formatAddress(data.marketed_by);
        const addrLine = addrStr ? `<br>${addrStr}` : '';
        block.innerHTML = `<strong>Marketed By:</strong><br><strong>${data.marketed_by.name}</strong>${addrLine}.<br>FSSAI Lic No.: ${data.fssai_license || '10726994000740'}`;
      });
    }

    if (data.manufactured_by) {
      document.querySelectorAll('[data-setting="manufactured-by-block"]').forEach(block => {
        const addrStr = formatAddress(data.manufactured_by);
        const addrLine = addrStr ? `<br>${addrStr}` : '';
        block.innerHTML = `<strong>Manufactured By:</strong><br><strong>${data.manufactured_by.name}</strong>${addrLine}<br>FSSAI Lic No.: 10722999001482`;
      });
    }
  }

  fetchWebsiteSettings();

  // Product Logic
  let activeProductData = null;
  let selectedVariant = null;
  let selectedOffer = null;

  async function fetchProductData() {
    try {
      const response = await fetch(`${API_BASE_URL}products/vitamin-b12-d3-powder/`);
      if (response.ok) {
        const data = await response.json();
        activeProductData = data;
        renderProductData(data);
      } else {
        console.warn('Failed to fetch product data, using hardcoded fallback.');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  function renderProductData(data) {
    // 1. Basic Info
    const nameEl = document.getElementById('dynamic-product-name');
    if (nameEl) nameEl.textContent = data.name;

    const nutritionEl = document.getElementById('dynamic-nutrition');
    if (nutritionEl && data.nutritional_information) nutritionEl.innerHTML = data.nutritional_information;

    const usageEl = document.getElementById('dynamic-usage');
    if (usageEl && data.directions_for_use) usageEl.innerHTML = data.directions_for_use;

    const ingredientsEl = document.getElementById('dynamic-ingredients');
    if (ingredientsEl && data.ingredients) ingredientsEl.innerHTML = data.ingredients;

    // 2. Render Flavors
    const flavourContainer = document.getElementById('dynamic-flavour-options');
    if (flavourContainer && data.variants && data.variants.length > 0) {
      flavourContainer.innerHTML = '';
      
      // Check URL for flavour param to sync cross-page
      const urlParams = new URLSearchParams(window.location.search);
      const urlFlavour = urlParams.get('flavour');
      
      let initialVariant = data.variants[0];
      if (urlFlavour) {
        const matched = data.variants.find(v => v.slug.toLowerCase() === urlFlavour.toLowerCase());
        if (matched) initialVariant = matched;
      }
      
      data.variants.forEach(variant => {
        const isChecked = (variant.id === initialVariant.id);
        const label = document.createElement('label');
        label.className = 'flavour-btn';
        
        let icon = '';
        if (variant.name.toLowerCase().includes('strawberry')) icon = '🍓 ';
        if (variant.name.toLowerCase().includes('orange')) icon = '🍊 ';

        label.innerHTML = `
          <input type="radio" name="b12-flavour" value="${variant.id}" ${isChecked ? 'checked' : ''} />
          <span class="flavour-text">${icon}${variant.name}</span>
        `;
        
        label.querySelector('input').addEventListener('change', () => {
          selectVariant(variant);
        });
        
        flavourContainer.appendChild(label);
      });
      
      // Initialize with first/matched variant
      selectVariant(initialVariant);
    }
  }

  function selectVariant(variant) {
    selectedVariant = variant;
    
    // Update Image
    const imgEl = document.getElementById('shop-img');
    if (imgEl && variant.image) {
      imgEl.src = variant.image;
      imgEl.alt = variant.name;
    }
    
    // Render Offers for this variant
    renderOffers(variant.offers);
  }

  function renderOffers(offers) {
    const offerContainer = document.getElementById('dynamic-pack-offers');
    if (!offerContainer || !offers || offers.length === 0) return;
    
    offerContainer.innerHTML = '';
    
    offers.forEach((offer, index) => {
      const isChecked = (index === 0);
      const label = document.createElement('label');
      label.className = 'premium-offer-radio';
      
      if (offer.name.toLowerCase().includes('buy 3') || offer.quantity === 3) {
         label.classList.add('best-value');
         label.innerHTML += `<div class="best-value-ribbon">Most Popular</div>`;
      }
      
      let packTitle = offer.name;
      let emoji = '🟢';
      let bottomText = '';
      let discountDisplay = offer.discount_label || '';
      
      if (offer.quantity === 1) {
          packTitle = '1 Pack — Trial Pack';
          emoji = '🟢';
          discountDisplay = `🏷️ ${offer.discount_label}`;
      } else if (offer.quantity === 2) {
          packTitle = '2 Packs — Value Pack';
          emoji = '🔵';
          bottomText = '💰 Save More';
          discountDisplay = `🏷️ ${offer.discount_label}`;
      } else if (offer.quantity === 3) {
          packTitle = '3 Packs — Best Value';
          emoji = '🟣';
          bottomText = '🔥 Best Value • Recommended';
          discountDisplay = 'Special offer';
      }

      label.innerHTML += `
        <input type="radio" name="b12-offer" value="${offer.id}" ${isChecked ? 'checked' : ''} />
        <div class="offer-content" style="width: 100%; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 0.25rem;">
            <span class="offer-name" style="font-size: 1.05rem;">${emoji} ${packTitle}</span>
            <span class="offer-price">₹${Math.round(offer.selling_price)}</span>
          </div>
          <div style="font-size: 0.85rem; color: #475569; font-weight: 600;">
            ${discountDisplay}
          </div>
          <div style="font-size: 0.85rem; color: #64748b; display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.2rem;">
            <span>100g &times; ${offer.quantity} Pack${offer.quantity > 1 ? 's' : ''}</span>
            <span>📅 ${offer.quantity * 20} Days Supply</span>
          </div>
          ${bottomText ? `<div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-top: 0.3rem;">${bottomText}</div>` : ''}
        </div>
      `;
      
      label.querySelector('input').addEventListener('change', () => {
        selectOffer(offer);
      });
      
      offerContainer.appendChild(label);
      
      if (isChecked) {
        selectOffer(offer);
      }
    });
  }

  function selectOffer(offer) {
    selectedOffer = offer;
    
    const saleEl = document.getElementById('pdp-sale');
    const origEl = document.getElementById('pdp-original');
    const discEl = document.getElementById('pdp-discount');
    const saveEl = document.getElementById('pdp-save-amt');
    const saveContainer = document.getElementById('pdp-save-container');
    
    const basePrice = parseFloat(offer.selling_price);
    const mrp = parseFloat(offer.mrp);
    
    // Tax Calculations
    const gstRate = window.activeSettingsData && window.activeSettingsData.gst_rate ? parseFloat(window.activeSettingsData.gst_rate) : 5.00;
    const cgstRate = window.activeSettingsData && window.activeSettingsData.cgst_rate ? parseFloat(window.activeSettingsData.cgst_rate) : 2.50;
    const sgstRate = window.activeSettingsData && window.activeSettingsData.sgst_rate ? parseFloat(window.activeSettingsData.sgst_rate) : 2.50;
    
    const totalGst = (basePrice * gstRate) / 100;
    const finalAmount = basePrice + totalGst;
    
    if (saleEl) saleEl.textContent = `₹${Math.round(basePrice)}`;
    if (origEl) {
        if (mrp && mrp > basePrice) {
            origEl.textContent = `₹${Math.round(mrp)}`;
            origEl.style.display = 'inline-block';
        } else {
            origEl.style.display = 'none';
        }
    }
    
    if (discEl) {
        if (offer.discount_label) {
            discEl.textContent = offer.discount_label;
            discEl.style.display = 'inline-block';
        } else {
            discEl.style.display = 'none';
        }
    }
    
    if (saveEl && saveContainer) {
        if (mrp && mrp > basePrice) {
            saveEl.textContent = `₹${Math.round(mrp - basePrice)}`;
            saveContainer.style.display = 'inline';
        } else {
            saveContainer.style.display = 'none';
        }
    }

    // Update Breakdown
    const basePriceEl = document.getElementById('pdp-base-price');
    const gstLabelEl = document.getElementById('pdp-gst-label');
    const gstAmtEl = document.getElementById('pdp-gst-amt');
    const totalPayableEl = document.getElementById('pdp-total-payable');
    
    if (basePriceEl) basePriceEl.textContent = `₹${basePrice.toFixed(2)}`;
    if (gstLabelEl) gstLabelEl.textContent = `GST (${gstRate}%)`;
    if (gstAmtEl) gstAmtEl.textContent = `₹${totalGst.toFixed(2)}`;
    if (totalPayableEl) totalPayableEl.textContent = `₹${finalAmount.toFixed(2)}`;
  }

  fetchProductData();

  const mobileDrawer = null;
  
  // 1. Fullscreen Loader Fade Out
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
        triggerViewportReveals();
      }, 600);
    });
    
    // Fallback
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        triggerViewportReveals();
      }
    }, 1500);
  }

  // 2. Sticky Navbar scroll handler
  const header = document.querySelector('.minimal-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 4. Mobile Drawer Menu Toggle (Removed as navigation is simplified)

  // 5. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.scroll-fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  function triggerViewportReveals() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }

  // 6. Immersive scroll effect for Hero product image
  const heroImg = document.querySelector('.hero-product-img');
  const heroGlow = document.querySelector('.hero-image-bg-glow');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroImg && scrollY < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.01}deg)`;
      if (heroGlow) {
        heroGlow.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    }
  });

  // 7. Policies Dialog Modal
  const policyDialog = document.getElementById('policy-dialog');
  const policyClose = document.getElementById('policy-dialog-close');
  const policyTitle = document.getElementById('policy-dialog-title');
  const policyContent = document.getElementById('policy-dialog-content');
  const policyTriggers = document.querySelectorAll('.policy-trigger');

  const policyData = {
    'refund': {
      title: 'Refund & Cancellation Policy',
      content: `
<p><strong>Last Updated: August 24, 2026</strong></p>
<p>Thank you for shopping with Nexus Nutraceuticals (nexusnutraceuticals.com). We are committed to providing premium quality nutraceutical and dietary supplements.</p>
<h3>1. 100% Prepaid Orders Only (No Cash on Delivery)</h3>
<ul>
<li>We operate strictly on a 100% Prepaid Order Model.</li>
<li>Accepted payment methods include:
<ul>
<li>Direct UPI QR Code Scan (via Google Pay, PhonePe, Paytm, BHIM, or any banking UPI app)</li>
<li>Direct Bank Transfer (NEFT / IMPS / RTGS to our official bank account)</li>
</ul>
</li>
<li>Cash on Delivery (COD) is currently NOT available.</li>
</ul>
<h3>2. Consumable Goods &amp; Hygiene Policy</h3>
<p>Because our products (including Vitamin B12 + D3 Water-Soluble Powder) are health and dietary supplements intended for direct human consumption, we strictly enforce a NO RETURN / NO REFUND policy once the product packaging, container, or safety seal has been opened, broken, or tampered with. This ensures maximum safety, hygiene, and product integrity for all customers.</p>
<h3>3. Eligibility for Replacement or Refund</h3>
<p>We offer a free replacement or a full refund only under the following verified circumstances:</p>
<ul>
<li><strong>Transit Damage:</strong> The product is received in a cracked, broken, crushed, or leaked condition.</li>
<li><strong>Incorrect Item / Flavor:</strong> You received an incorrect flavor (e.g., Orange instead of Strawberry) or a different product from what you ordered.</li>
<li><strong>Missing Items:</strong> Any missing item from a multi-item package.</li>
<li><strong>Expired Product:</strong> The product received has passed its expiry date at the time of delivery.</li>
</ul>
<h3>4. Claim Procedure &amp; Reporting Window</h3>
<p>To claim a replacement or refund:</p>
<ul>
<li><strong>Timeframe:</strong> You must notify our customer support team within 48 hours of delivery. Requests received after 48 hours will not be accepted.</li>
<li><strong>Required Proof:</strong> Send an email to hello.nexusnutra@gmail.com or WhatsApp us at +91 63570 02100 with:
<ol>
<li>Your Order ID and registered mobile number.</li>
<li>Payment reference / Transaction screenshot (UPI reference ID / Bank UTR number).</li>
<li>Clear unboxing photos or a video showing the outer shipping box, the courier label, the damaged/incorrect product, and the batch number on the container.</li>
</ol>
</li>
<li><strong>Verification:</strong> Our team will review and verify your request within 24 to 48 business hours. Upon approval, we will dispatch a free replacement or process your refund.</li>
</ul>
<h3>5. Order Cancellation Policy</h3>
<ul>
<li><strong>Pre-Dispatch:</strong> You may cancel your order before it has been processed and dispatched from our warehouse. Contact us immediately at +91 63570 02100 or hello.nexusnutra@gmail.com.</li>
<li><strong>Post-Dispatch:</strong> Once an order is packed, dispatched, and assigned a courier tracking number, the order cannot be cancelled.</li>
</ul>
<h3>6. Refund Processing Timelines &amp; Modes</h3>
<ul>
<li>Since all orders are prepaid via direct UPI scan or direct bank transfer, approved refunds will be credited directly to the customer's UPI ID / Google Pay / PhonePe number or Bank Account (via NEFT/IMPS).</li>
<li>We will request your verified bank details or UPI ID for processing.</li>
<li>Approved refunds are credited within 5 to 7 business days following verification.</li>
</ul>
<h3>7. Non-Refundable Circumstances</h3>
<p>Refunds or replacements will not be issued in the following cases:</p>
<ul>
<li>Incorrect or incomplete delivery address or unreachable contact number provided at checkout.</li>
<li>Failed delivery after multiple attempts by the courier partner.</li>
<li>Products returned with broken outer seals, missing original packaging, or missing scoops.</li>
<li>Personal preference regarding taste, sweetness, or individual health expectations.</li>
</ul>
<h3>8. Customer Support &amp; Contact Information</h3>
<p>For assistance with returns, refunds, or cancellations, contact our official support desk:</p>
<ul>
<li><strong>Brand:</strong> Nexus Nutraceuticals</li>
<li><strong>Marketed By:</strong> Shivay Healthcare</li>
<li><strong>Registered Address:</strong> Vastral, Ahmedabad - 382418, Gujarat, India</li>
<li><strong>FSSAI Lic. No.:</strong> 10726994000740</li>
<li><strong>Support Phone / WhatsApp:</strong> +91 63570 02100</li>
<li><strong>Official Email:</strong> hello.nexusnutra@gmail.com</li>
<li><strong>Support Hours:</strong> Monday to Saturday | 10:00 AM – 6:30 PM IST</li>
</ul>
`
    },
    'terms': {
      title: 'Terms of Service',
      content: `
<p><strong>Last Updated: August 24, 2026</strong></p>
<p>Welcome to nexusnutraceuticals.com. This website is owned and operated by Shivay Healthcare under the brand name Nexus Nutraceuticals. Throughout the site, the terms "we", "us", and "our" refer to Nexus Nutraceuticals.</p>
<p>By visiting our website and/or purchasing from us, you engage in our "Service" and agree to be bound by the following Terms of Service ("Terms"), along with our Privacy Policy, Shipping Policy, and Refund &amp; Cancellation Policy.</p>
<h3>1. Acceptance of Terms &amp; Eligibility</h3>
<ul>
<li>By using this website, you represent that you are at least 18 years of age or that you are accessing the website under the supervision of a parent or legal guardian.</li>
<li>We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion if any fraudulent or unauthorized activity is suspected.</li>
</ul>
<h3>2. Nutraceutical &amp; Health Disclaimer (FSSAI Compliance)</h3>
<ul>
<li><strong>Proprietary Dietary Supplement:</strong> Products sold on this website (including our Vitamin B12 + D3 Water-Soluble Powder) are dietary / nutraceutical supplements and are NOT FOR MEDICINAL USE.</li>
<li><strong>No Medical Claims:</strong> Our products are not intended to diagnose, treat, cure, or prevent any disease, chronic illness, or medical condition.</li>
<li><strong>Medical Consultation:</strong> The information provided on this website is for general informational and educational purposes only. Always consult a qualified physician or healthcare professional before taking any dietary supplement, particularly if you are pregnant, lactating, taking prescription medicines, or managing an existing medical condition.</li>
<li><strong>Dosage Adherence:</strong> Do not exceed the recommended daily serving size (one 5g scoop daily or as directed by a healthcare professional).</li>
</ul>
<h3>3. Product Details, Pricing &amp; Availability</h3>
<ul>
<li><strong>Pricing:</strong> All prices listed on nexusnutraceuticals.com are in Indian Rupees (INR) and are inclusive of applicable GST (MRP ₹399.00 per 100g pack).</li>
<li><strong>Product Formats:</strong> Our Vitamin B12 + D3 powder is available in Strawberry and Orange flavors.</li>
<li><strong>Modifications:</strong> We reserve the right to modify prices, discontinue products, or alter promotional offers without prior notice.</li>
</ul>
<h3>4. 100% Prepaid Payment Terms (No COD)</h3>
<ul>
<li>We operate exclusively on a 100% Prepaid Order Model.</li>
<li>Accepted payment methods include Direct UPI QR Code Scan (via Google Pay, PhonePe, Paytm, BHIM, etc.) and Direct Bank Transfer (NEFT / IMPS).</li>
<li>Cash on Delivery (COD) is not accepted.</li>
<li>Orders are confirmed and scheduled for dispatch only after payment verification via transaction reference ID or UTR number.</li>
</ul>
<h3>5. Accuracy of Billing and Shipping Information</h3>
<ul>
<li>You agree to provide complete, current, and accurate purchase, delivery address, landmark, PIN code, and active phone number details for all orders placed on our website.</li>
<li>We are not responsible for delivery failures or delays resulting from incorrect address details or unreachable contact numbers provided by the customer.</li>
</ul>
<h3>6. Consumable Goods, Returns &amp; Cancellations</h3>
<ul>
<li>Because our products are consumable dietary supplements, we strictly enforce a No Return / No Refund Policy once the safety seal or outer container has been opened.</li>
<li>Replacements or refunds are granted solely for verified transit damage, missing items, or incorrect product deliveries reported within 48 hours of delivery with unboxing video/photographic evidence.</li>
<li>For complete terms, please refer to our Refund, Return &amp; Cancellation Policy.</li>
</ul>
<h3>7. Intellectual Property Rights</h3>
<ul>
<li>All content on this website—including the brand name "Nexus Nutraceuticals", logos, slogans ("Where Better Health Starts"), product packaging designs, graphics, images, and text—is the exclusive intellectual property of Shivay Healthcare / Nexus Nutraceuticals.</li>
<li>Unauthorized copying, reproduction, redistribution, or commercial exploitation of any site content is strictly prohibited.</li>
</ul>
<h3>8. Limitation of Liability</h3>
<ul>
<li>Nexus Nutraceuticals, Shivay Healthcare, Zenics Nutraceuticals LLP, and their respective owners or affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from the improper usage or storage of our products, non-compliance with dosage guidelines, or temporary website technical disruptions.</li>
</ul>
<h3>9. Indemnification</h3>
<p>You agree to indemnify, defend, and hold harmless Nexus Nutraceuticals, Shivay Healthcare, manufacturing partner Zenics Nutraceuticals LLP, and their affiliates from any third-party claims, liabilities, damages, or costs resulting from your breach of these Terms of Service or violation of applicable laws.</p>
<h3>10. Governing Law &amp; Dispute Resolution</h3>
<ul>
<li>These Terms of Service and any transactional agreements shall be governed by and construed in accordance with the laws of India.</li>
<li>Any dispute, controversy, or claim arising out of the use of this website or purchases made through it shall be subject to the exclusive jurisdiction of the competent courts located in Ahmedabad, Gujarat, India.</li>
</ul>
<h3>11. Business &amp; Contact Information</h3>
<p>For questions regarding these Terms of Service or your orders, reach out to our official support desk:</p>
<ul>
<li><strong>Brand:</strong> Nexus Nutraceuticals</li>
<li><strong>Marketed By:</strong> Shivay Healthcare, Vastral, Ahmedabad - 382418, Gujarat, India</li>
<li><strong>FSSAI Lic. No. (Marketer):</strong> 10726994000740</li>
<li><strong>Manufactured By:</strong> Zenics Nutraceuticals LLP, 173, Sahitya Industrial Hub, Village - Bakrol, Daskroi, Ahmedabad, Gujarat - 382430</li>
<li><strong>FSSAI Lic. No. (Manufacturer):</strong> 10722999001482</li>
<li><strong>Customer Support &amp; Grievance Helpline:</strong> +91 63570 02100</li>
<li><strong>Official Email:</strong> hello.nexusnutra@gmail.com</li>
<li><strong>Operating Hours:</strong> Monday to Saturday | 10:00 AM – 6:30 PM IST</li>
</ul>
`
    },
    'privacy': {
      title: 'Privacy Policy',
      content: `
<p><strong>Last Updated: August 24, 2026</strong></p>
<p>Welcome to Nexus Nutraceuticals (accessible at nexusnutraceuticals.com). Your privacy and data security are of utmost importance to us. This Privacy Policy outlines how Nexus Nutraceuticals ("we", "our", or "us") collects, uses, stores, and protects your personal information when you browse our website, inquire about products, or purchase our health supplements.</p>
<p>By visiting or using our website, you agree to the collection and use of information in accordance with this Privacy Policy.</p>
<h3>1. Information We Collect</h3>
<p>We collect only the necessary information required to process your orders, communicate delivery updates, and provide customer support:</p>
<ul>
<li><strong>Contact &amp; Identity Details:</strong> Full name, active mobile number, and email address.</li>
<li><strong>Delivery Information:</strong> Complete shipping address, landmark, city, state, and PIN code.</li>
<li><strong>Order &amp; Transaction Details:</strong> Product selections (e.g., Vitamin B12 + D3 Water-Soluble Powder in Strawberry or Orange flavor), quantity, transaction reference numbers (UPI transaction ID / Bank UTR number), and order history.</li>
<li><strong>Technical Information:</strong> IP address, browser type, device information, operating system, and browsing activity collected automatically through standard cookies and analytics tools.</li>
</ul>
<h3>2. Payment Information &amp; Security (Direct UPI &amp; Bank Transfer)</h3>
<ul>
<li>We operate on a 100% Prepaid Model using Direct UPI QR Code Scanning and Direct Bank Transfers.</li>
<li>When making a payment, transactions occur directly through your personal UPI application (e.g., Google Pay, PhonePe, Paytm, BHIM) or bank portal.</li>
<li>We do NOT collect, store, or have access to sensitive payment credentials such as your bank account password, UPI MPIN, debit/credit card CVV, or OTPs.</li>
<li>Transaction confirmation is verified solely via the payment screenshot, UPI reference ID, or UTR number you provide.</li>
</ul>
<h3>3. How We Use Your Information</h3>
<p>We utilize the collected information strictly for legitimate business operations:</p>
<ul>
<li>To process, package, dispatch, and fulfill your dietary supplement orders.</li>
<li>To coordinate with third-party courier services for fast and safe doorstep delivery.</li>
<li>To send order confirmations, invoice receipts, and real-time shipping tracking alerts via WhatsApp, SMS, or Email.</li>
<li>To address customer queries, support requests, and process replacements or refunds where applicable.</li>
<li>To safeguard against fraud, unauthorized transactions, or misuse of our services.</li>
<li>To comply with statutory food safety regulations (FSSAI) and Indian e-commerce laws.</li>
</ul>
<h3>4. Data Sharing &amp; Third Parties</h3>
<p>We do not sell, rent, trade, or monetize your personal data with any third party. We share essential data only with trusted operational partners:</p>
<ul>
<li><strong>Logistics &amp; Courier Partners:</strong> Name, shipping address, and phone number are shared solely to ensure accurate delivery.</li>
<li><strong>Customer Support &amp; Communication Tools:</strong> To send automated shipping tracking alerts and handle customer service requests.</li>
<li><strong>Legal Authorities:</strong> Information may be disclosed if required by law, court order, or governmental authorities to prevent fraudulent activity.</li>
</ul>
<h3>5. Cookies and Web Analytics</h3>
<p>Our website uses standard cookies and tracking technologies to:</p>
<ul>
<li>Remember your cart selections and preferences.</li>
<li>Analyze overall web traffic, popular pages, and user experience.</li>
</ul>
<p>You may choose to disable cookies through your browser settings. However, doing so may impact some shopping functionalities on the website.</p>
<h3>6. Data Retention &amp; Safeguards</h3>
<ul>
<li>We implement robust technical, physical, and administrative security measures to protect your personal details against unauthorized access, loss, misuse, or alteration.</li>
<li>We retain transaction and invoicing records for the duration required by applicable Indian taxation, accounting, and consumer protection laws.</li>
</ul>
<h3>7. Marketing &amp; Communications (Opt-Out)</h3>
<p>With your consent, we may occasionally share updates on wellness tips, new product launches, or seasonal promotions. You can opt out of promotional messages at any time by contacting our support team or using the unsubscribe option. (You will continue to receive transactional order and shipping alerts).</p>
<h3>8. Grievance Redressal &amp; Contact Information</h3>
<p>In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, if you have any questions, concerns, or grievances regarding your data privacy, you may reach our designated Grievance Officer:</p>
<ul>
<li><strong>Brand Name:</strong> Nexus Nutraceuticals</li>
<li><strong>Marketed By:</strong> Shivay Healthcare</li>
<li><strong>Registered Address:</strong> Vastral, Ahmedabad - 382418, Gujarat, India</li>
<li><strong>FSSAI Lic. No.:</strong> 10726994000740</li>
<li><strong>Manufactured By:</strong> Zenics Nutraceuticals LLP, 173, Sahitya Industrial Hub, Village - Bakrol, Daskroi, Ahmedabad, Gujarat - 382430 (FSSAI Lic. No.: 10722999001482)</li>
<li><strong>Customer Support &amp; Grievance Contact:</strong> +91 63570 02100</li>
<li><strong>Official Email:</strong> hello.nexusnutra@gmail.com</li>
<li><strong>Operating Hours:</strong> Monday to Saturday | 10:00 AM – 6:30 PM IST</li>
</ul>
`
    },
    'shipping': {
      title: 'Shipping Policy',
      content: `
<p><strong>Last Updated: August 24, 2026</strong></p>
<p>At Nexus Nutraceuticals (nexusnutraceuticals.com), we aim to deliver your health and wellness supplements securely and promptly across India.</p>
<h3>1. Payment Confirmation &amp; Order Processing</h3>
<ul>
<li><strong>100% Prepaid Orders:</strong> Orders are confirmed and queued for packing immediately after payment verification via UPI QR Code Scan or Direct Bank Transfer.</li>
<li><strong>Dispatch Timeline:</strong> All orders are processed, quality-checked, and dispatched from our Ahmedabad facility within 24 to 48 business hours (excluding Sundays and national holidays).</li>
<li>Orders placed after business hours or on weekends/public holidays are processed on the next business day.</li>
</ul>
<h3>2. Estimated Delivery Timelines</h3>
<p>We ship across all serviceable PIN codes in India through trusted logistics partners (such as Delhivery, Blue Dart, DTDC, Xpressbees, and India Post):</p>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
<tbody>
<tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 0.5rem 0;"><strong>Region / Destination</strong></td><td style="text-align: right; padding: 0.5rem 0;"><strong>Estimated Delivery Time</strong></td></tr>
<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 0.5rem 0;">Gujarat &amp; Ahmedabad</td><td style="text-align: right; padding: 0.5rem 0;">2 to 3 Business Days</td></tr>
<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 0.5rem 0;">Major Metro Cities (Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Kolkata)</td><td style="text-align: right; padding: 0.5rem 0;">3 to 5 Business Days</td></tr>
<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 0.5rem 0;">Rest of India (Tier 2 / Tier 3 Towns)</td><td style="text-align: right; padding: 0.5rem 0;">4 to 7 Business Days</td></tr>
<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 0.5rem 0;">Remote, J&amp;K, and North-East Regions</td><td style="text-align: right; padding: 0.5rem 0;">6 to 9 Business Days</td></tr>
</tbody>
</table>
<p><em>Note: Delivery times are estimates and may occasionally experience minor delays due to adverse weather, local restrictions, or regional transit delays.</em></p>
<h3>3. Shipping Charges</h3>
<ul>
<li><strong>Standard Shipping:</strong> A flat shipping charge of ₹50 applies on orders below ₹499 (or specified cart threshold).</li>
<li><strong>Free Shipping:</strong> Applicable on promotional thresholds or prepaid bundle offers as displayed during checkout.</li>
<li>The applicable shipping fee is clearly communicated before final payment confirmation.</li>
</ul>
<h3>4. Shipment Tracking</h3>
<ul>
<li>Once your package is dispatched, tracking information containing the Courier Name, AWB / Tracking Number, and Tracking Link will be sent to your registered WhatsApp number, SMS, and Email.</li>
<li>You can monitor the real-time transit status of your parcel directly via the courier tracking portal.</li>
</ul>
<h3>5. Delivery Attempts &amp; Accurate Address Details</h3>
<ul>
<li><strong>Accurate Information:</strong> Please ensure your full shipping address, reachable landmark, correct PIN code, and active mobile number are provided during order placement.</li>
<li><strong>Delivery Attempts:</strong> Our courier partners attempt delivery up to 3 times. If delivery fails due to incorrect address details, customer unavailability, or non-response to courier calls, the package will be returned to our warehouse (Return to Origin - RTO). Re-shipping fees may apply for re-dispatching such parcels.</li>
</ul>
<h3>6. Damaged or Tampered Outer Packaging</h3>
<ul>
<li>If the outer delivery box is visibly damaged, crushed, open, or tampered with at the time of delivery, please:
<ul>
<li>Do not accept the parcel from the delivery agent and request them to mark it as "Refused due to damage".</li>
<li>If accepted, record a clear unboxing video before opening the outer carton seal.</li>
<li>Notify our support team within 48 hours with photos/video to claim a swift replacement.</li>
</ul>
</li>
</ul>
<h3>7. Shipping Inquiries &amp; Support</h3>
<p>For questions, address changes before dispatch, or tracking assistance, contact our dispatch desk:</p>
<ul>
<li><strong>Brand:</strong> Nexus Nutraceuticals</li>
<li><strong>Marketed By:</strong> Shivay Healthcare</li>
<li><strong>Dispatch Location:</strong> Vastral, Ahmedabad - 382418, Gujarat, India</li>
<li><strong>FSSAI Lic. No.:</strong> 10726994000740</li>
<li><strong>Support Phone / WhatsApp:</strong> +91 63570 02100</li>
<li><strong>Official Email:</strong> hello.nexusnutra@gmail.com</li>
<li><strong>Operational Hours:</strong> Monday to Saturday | 10:00 AM – 6:30 PM IST</li>
</ul>
`
    },
    'careers': {
      title: 'Careers (We are hiring!)',
      content: '<p>We are expanding our local wellness supply operations. Send your CV to hello.nexusnutra@gmail.com.</p>'
    }
  };

  policyTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const policyType = trigger.getAttribute('data-policy');
      const policyInfo = policyData[policyType];

      if (policyInfo && policyDialog && policyTitle && policyContent) {
        policyTitle.textContent = policyInfo.title;
        policyContent.innerHTML = policyInfo.content;
        policyDialog.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (policyClose && policyDialog) {
    policyClose.addEventListener('click', () => {
      policyDialog.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
    
    policyDialog.addEventListener('click', (e) => {
      if (e.target === policyDialog) {
        policyDialog.classList.remove('open');
        document.body.style.overflow = 'auto';
      }
    });
  }

    // 8. WhatsApp Ordering System
  const whatsappBtn = document.getElementById('pdp-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      if (!activeProductData || !selectedVariant || !selectedOffer) {
          // Fallback if API hasn't loaded
          const flavourEl = document.querySelector('input[name="b12-flavour"]:checked');
          const offerEl = document.querySelector('input[name="b12-offer"]:checked');
          const priceEl = document.getElementById('pdp-sale');
          const flavour = flavourEl ? flavourEl.value : 'Strawberry';
          const offerVal = offerEl ? offerEl.value : '1';
          const price = priceEl ? priceEl.textContent : '';
          
          const msg = `Hello Nexus Nutraceuticals,

I am interested in placing an order.

Product: Nexus Vitamin B12 + D3 Powder
Flavour: ${flavour}
Pack: Buy ${offerVal}
Price: ${price}

Please share the next steps for completing my order.

Thank you.`;
          
          const baseLink = window.__dynamicWhatsAppLink || 'https://wa.me/916357002100';
          const url = `${baseLink}?text=${encodeURIComponent(msg)}`;
          window.open(url, '_blank');
          return;
      }
      
      const msg = `Hello Nexus Nutraceuticals,

I am interested in placing an order.

Product: ${activeProductData.name}
Flavour: ${selectedVariant.name}
Pack: ${selectedOffer.name}
Price: ₹${Math.round(selectedOffer.selling_price)}

Please share the next steps for completing my order.

Thank you.`;
      
      const baseLink = window.__dynamicWhatsAppLink || 'https://wa.me/916357002100';
      const url = `${baseLink}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }



  // Contact Form Submission Handler
  const contactForm = document.getElementById('home-contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('contact-submit-btn');
      const originalText = submitBtn.querySelector('span').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const message = document.getElementById('contact-comment').value;

      try {
        const response = await fetch(`${API_BASE_URL}contact-enquiries/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone_number: phone,
            message: message
          })
        });

        if (response.ok) {
          contactForm.reset();
          if (contactFeedback) {
            contactFeedback.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
            contactFeedback.className = 'contact-feedback success';
            contactFeedback.classList.remove('hidden');
            contactFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              contactFeedback.classList.add('hidden');
            }, 5000);
          }
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        if (contactFeedback) {
          contactFeedback.textContent = 'An error occurred while sending your message. Please try again later or contact us directly.';
          contactFeedback.className = 'contact-feedback error';
          contactFeedback.classList.remove('hidden');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
      }
    });
  }

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all other items
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Handle Flavour Image Swapping & URL Parameter Sync
  const flavourRadios = document.querySelectorAll('input[name="b12-flavour"]');
  const shopImg = document.getElementById('shop-img');

  if (flavourRadios.length > 0) {
    flavourRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const selectedFlavour = e.target.value;
        const newSrc = selectedFlavour === 'Strawberry' ? '/b12-strawberry.jpg' : '/b12-orange.jpg';
        if (shopImg) shopImg.src = newSrc;
        if (shopImg) shopImg.alt = "Nexus Vitamin B12 " + selectedFlavour;
      });
    });

    // Check URL for pre-selected flavour
    const urlParams = new URLSearchParams(window.location.search);
    const flavourParam = urlParams.get('flavour');
    if (flavourParam) {
      const targetFlavour = flavourParam.toLowerCase() === 'orange' ? 'Orange' : 'Strawberry';
      const targetRadio = document.querySelector(`input[name="b12-flavour"][value="${targetFlavour}"]`);
      if (targetRadio) {
        targetRadio.checked = true;
        targetRadio.dispatchEvent(new Event('change'));
      }
    }
  }

  // 10. Background particles setup (Teal & Gold interactive particles)
  initMinimalParticles();
});

function initMinimalParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let ripples = [];

  // Cohesive Navy Blue & Fresh Green palette
  const colors = [
    '0, 59, 115',      // Navy Blue
    '108, 194, 74',    // Fresh Green
    '51, 144, 219',    // Light Blue
    '96, 112, 128',    // Muted Slate Accent
    '10, 25, 47'       // Dark Navy Charcoal
  ];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resize);
  resize();

  let mouse = { x: null, y: null };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (Math.random() < 0.22) {
      particles.push(new Particle(e.clientX, e.clientY, true));
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      if (Math.random() < 0.2) {
        particles.push(new Particle(touch.clientX, touch.clientY, true));
      }
    }
  });

  window.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const color = colors[Math.floor(Math.random() * colors.length)];

    ripples.push({
      x: x,
      y: y,
      radius: 0,
      opacity: 1,
      color: color
    });

    const count = window.innerWidth < 768 ? 8 : 15;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, true, true));
    }
  });

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    particles.forEach(p => {
      if (!p.isTemporary) {
        p.y -= diff * 0.15;
      }
    });

    if (Math.random() < 0.2) {
      const x = Math.random() * width;
      const y = diff > 0 ? height - 10 : 10;
      particles.push(new Particle(x, y, true));
    }
  });

  class Particle {
    constructor(x, y, isTemporary = false, isExplosion = false) {
      this.isTemporary = isTemporary;
      this.isExplosion = isExplosion;
      
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;

      if (isExplosion) {
        this.size = Math.random() * 3 + 1.5;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
      } else if (isTemporary) {
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
      } else {
        this.size = Math.random() * 10 + 3;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
      }

      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      if (isTemporary) {
        this.opacity = isExplosion ? 0.95 : 0.75;
      } else {
        this.opacity = Math.random() * 0.3 + 0.12;
      }

      this.life = 100;
    }

    update() {
      if (mouse.x != null && mouse.y != null && !this.isTemporary) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= (dx / dist) * 1.5;
          this.y -= (dy / dist) * 1.5;
        }
      }

      this.x += this.speedX;
      this.y += this.speedY;

      if (this.isTemporary) {
        this.life -= this.isExplosion ? 2.5 : 1.8;
        this.opacity = Math.max(0, (this.life / 100) * 0.85);
        if (this.isExplosion) {
          this.speedX *= 0.95;
          this.speedY *= 0.95;
        }
      } else {
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = window.innerWidth < 768 ? 20 : 45;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      let r = ripples[i];
      r.radius += 3.5;
      r.opacity -= 0.025;
      if (r.opacity <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color}, ${r.opacity * 0.45})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.draw();
      if (p.isTemporary && p.life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }

  animate();
}

  // Dynamic PDP Variant Pricing
  window.updateOfferPrice = function(sale, original, discount, save, sizeId) {
    document.getElementById('pdp-sale').textContent = `₹${sale}`;
    document.getElementById('pdp-original').textContent = `₹${original}`;
    document.getElementById('pdp-discount').textContent = discount;
    document.getElementById('pdp-save-amt').textContent = `₹${save}`;
    
    const btn = document.getElementById('pdp-add-btn');
    if(btn) btn.setAttribute('data-size', sizeId);
  };
document.addEventListener('DOMContentLoaded', () => {
});
