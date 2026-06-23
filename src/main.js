import './style.css';

document.addEventListener('DOMContentLoaded', () => {
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

  // 3. Active Nav Link Highlight on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav);

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
      title: 'Refund Policy',
      content: '<p>If you receive a damaged jar or pouch, or if there is any transit discrepancy, please notify us within 7 days of delivery at hello.nexusnutra@gmail.com with photos. We will verify and process a replacement immediately. Sample packs and opened products are not eligible for general refunds.</p>'
    },
    'terms': {
      title: 'Terms of Service',
      content: '<p>All consumer purchases are processed directly. Online orders are dispatched within 2 business days. Invoices and tracking details will be sent directly to your WhatsApp number.</p>'
    },
    'privacy': {
      title: 'Privacy Policy',
      content: '<p>We collect your name, mobile number, address, and pincode solely for order delivery and customer service coordination. We do not sell, rent, or share your contact details with external marketing services.</p>'
    },
    'shipping': {
      title: 'Shipping Policy',
      content: '<p>Standard domestic courier delivery is 100% free across India. Dispatch is completed within 24-48 hours from Vastral, Ahmedabad. Most packages reach clients within 3 to 5 business days.</p>'
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

  // 8. D2C E-commerce Functionality
  let cart = [];

  const productCatalog = {
    'b12-100g': { name: 'Vitamin B12 Powder (100g Jar)', price: 499, image: '/b12-jar.jpg' }
  };

  // DOM Elements
  const navCartTrigger = document.getElementById('nav-cart-trigger');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartEmptyShopBtn = document.getElementById('cart-empty-shop-btn');
  
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmptyMsg = document.getElementById('cart-empty-message');
  const cartSubtotalPrice = document.getElementById('cart-subtotal');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const proceedToCheckoutBtn = document.getElementById('proceed-to-checkout-btn');

  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('checkout-modal-close');
  const checkoutForm = document.getElementById('checkout-form');
  const paymentRadios = document.getElementsByName('payment-method');
  const paymentNoteText = document.getElementById('payment-note-text');

  // Profile Drawer DOM Elements
  const profileDrawer = document.getElementById('profile-drawer');
  const profileOverlay = document.getElementById('profile-drawer-overlay');
  const profileCloseBtn = document.getElementById('profile-close-btn');
  const profileLogoutBtn = document.getElementById('profile-logout-btn');

  if (profileCloseBtn) {
    profileCloseBtn.addEventListener('click', closeProfileDrawer);
  }
  if (profileOverlay) {
    profileOverlay.addEventListener('click', closeProfileDrawer);
  }
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', () => {
      closeProfileDrawer();
      handleLogout();
    });
  }

  // Load cart from localStorage if exists
  if (localStorage.getItem('nexus_cart')) {
    try {
      cart = JSON.parse(localStorage.getItem('nexus_cart'));
      updateCartUI();
    } catch (e) {
      cart = [];
    }
  }

  // Helper to open/close cart drawer
  const openCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCart = () => {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      if (!checkoutModal.classList.contains('open') && (!mobileDrawer || !mobileDrawer.classList.contains('open'))) {
        document.body.style.overflow = 'auto';
      }
    }
  };

  // Helper to open/close checkout modal
  const openCheckout = () => {
    if (checkoutModal) {
      resetCheckoutSteps();
      checkoutModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCheckout = () => {
    if (checkoutModal) {
      checkoutModal.classList.remove('open');
      if (!cartDrawer.classList.contains('open') && (!mobileDrawer || !mobileDrawer.classList.contains('open'))) {
        document.body.style.overflow = 'auto';
      }
    }
  };

  const resetCheckoutSteps = () => {
    const deliveryStep = document.getElementById('checkout-delivery-step');
    const upiStep = document.getElementById('checkout-upi-step');
    const successStep = document.getElementById('checkout-success-step');
    
    if (deliveryStep) deliveryStep.classList.remove('hidden');
    if (upiStep) upiStep.classList.add('hidden');
    if (successStep) successStep.classList.add('hidden');
    
    if (checkoutForm) checkoutForm.reset();
    const upiForm = document.getElementById('upi-verification-form');
    if (upiForm) upiForm.reset();

    const submitBtnSpan = document.querySelector('#submit-checkout-btn span');
    if (submitBtnSpan) submitBtnSpan.textContent = "Confirm Order (COD)";
    if (paymentNoteText) paymentNoteText.textContent = "No pre-payment required. Pay when delivered.";
  };

  // Quick Add to Cart Buttons
  const quickAddBtns = document.querySelectorAll('.quick-add-btn');
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-size');
      const product = productCatalog[size];
      if (!product) return;

      const existingIndex = cart.findIndex(item => item.size === size);
      if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({
          size: size,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1
        });
      }

      saveCart();
      updateCartUI();

      // Quick feedback text
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.style.backgroundColor = 'var(--secondary)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        openCart();
      }, 500);
    });
  });

  // Navigation Cart triggers
  if (navCartTrigger) {
    navCartTrigger.addEventListener('click', openCart);
  }
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }
  if (cartEmptyShopBtn) {
    cartEmptyShopBtn.addEventListener('click', closeCart);
  }
  
  // Close links inside cart
  document.querySelectorAll('.close-cart-link').forEach(link => {
    link.addEventListener('click', closeCart);
  });

  // Save cart to local storage helper
  function saveCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
  }

  // Update Cart interface
  function updateCartUI() {
    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {
      totalItems += item.qty;
      subtotal += item.price * item.qty;
    });

    // Update badging
    if (cartBadgeCount) {
      cartBadgeCount.textContent = totalItems;
      if (totalItems > 0) {
        cartBadgeCount.style.display = 'flex';
      } else {
        cartBadgeCount.style.display = 'none';
      }
    }

    // Toggle empty/full states
    if (cart.length === 0) {
      if (cartEmptyMsg) cartEmptyMsg.classList.remove('hidden');
      if (cartItemsList) cartItemsList.classList.add('hidden');
      if (cartSubtotalPrice) cartSubtotalPrice.textContent = '₹0';
      if (proceedToCheckoutBtn) proceedToCheckoutBtn.disabled = true;
    } else {
      if (cartEmptyMsg) cartEmptyMsg.classList.add('hidden');
      if (cartItemsList) {
        cartItemsList.classList.remove('hidden');
        
        // Render rows
        cartItemsList.innerHTML = cart.map((item, index) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
              <div class="cart-item-qty-row">
                <div class="cart-qty-ctrl">
                  <button class="cart-qty-btn dec-item" data-index="${index}">&minus;</button>
                  <span class="cart-qty-num">${item.qty}</span>
                  <button class="cart-qty-btn inc-item" data-index="${index}">+</button>
                </div>
              </div>
            </div>
            <button class="cart-item-remove remove-item" data-index="${index}" aria-label="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        `).join('');

        // Attach event listeners to items in cart
        cartItemsList.querySelectorAll('.dec-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            if (cart[index].qty > 1) {
              cart[index].qty--;
            } else {
              cart.splice(index, 1);
            }
            saveCart();
            updateCartUI();
          });
        });

        cartItemsList.querySelectorAll('.inc-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            if (cart[index].qty < 99) {
              cart[index].qty++;
            }
            saveCart();
            updateCartUI();
          });
        });

        cartItemsList.querySelectorAll('.remove-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            saveCart();
            updateCartUI();
          });
        });
      }

      if (cartSubtotalPrice) {
        cartSubtotalPrice.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      }
      if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.disabled = false;
      }
    }
  }

  // Proceed to checkout opens checkout card (requires login)
  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener('click', () => {
      const token = localStorage.getItem('nexus_auth_token');
      closeCart();
      if (!token) {
        window.openCheckoutAfterLogin = true;
        setTimeout(() => {
          openAuthModal();
          showAuthFeedback('Please log in or create an account to proceed to checkout.', true);
        }, 300);
      } else {
        setTimeout(openCheckout, 300);
      }
    });
  }

  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener('click', closeCheckout);
  }
  
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        closeCheckout();
      }
    });
  }

  // Payment note text and button label toggle
  if (paymentRadios) {
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          const submitBtnSpan = document.querySelector('#submit-checkout-btn span');
          if (radio.value === 'COD') {
            paymentNoteText.textContent = "No pre-payment required. Pay when delivered.";
            if (submitBtnSpan) submitBtnSpan.textContent = "Confirm Order (COD)";
          } else {
            paymentNoteText.textContent = "UPI ID and QR code will be shown next to verify payment.";
            if (submitBtnSpan) submitBtnSpan.textContent = "Proceed to UPI Payment";
          }
        }
      });
    });
  }

  // Submit order helper function
  const submitOrderToServer = async (orderData) => {
    const submitBtn = document.getElementById('submit-checkout-btn');
    const verifyBtn = document.getElementById('confirm-payment-btn');
    if (submitBtn) submitBtn.disabled = true;
    if (verifyBtn) verifyBtn.disabled = true;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        // Render receipt details
        const receiptOrderId = document.getElementById('receipt-order-id');
        const receiptItems = document.getElementById('receipt-items');
        const receiptTotal = document.getElementById('receipt-total');
        const receiptPayment = document.getElementById('receipt-payment');
        const receiptAddress = document.getElementById('receipt-shipping-address');

        if (receiptOrderId) receiptOrderId.textContent = `#${result.order.id}`;
        if (receiptItems) {
          receiptItems.textContent = result.order.items.map(item => `${item.qty}x ${item.name}`).join(', ');
        }
        if (receiptTotal) receiptTotal.textContent = `₹${result.order.total.toLocaleString('en-IN')}`;
        if (receiptPayment) {
          receiptPayment.textContent = result.order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI / Online';
        }
        if (receiptAddress) {
          receiptAddress.textContent = `${result.order.name}, ${result.order.address} - ${result.order.pincode} (Tel: ${result.order.phone})`;
        }

        // Switch to success step
        const deliveryStep = document.getElementById('checkout-delivery-step');
        const upiStep = document.getElementById('checkout-upi-step');
        const successStep = document.getElementById('checkout-success-step');

        if (deliveryStep) deliveryStep.classList.add('hidden');
        if (upiStep) upiStep.classList.add('hidden');
        if (successStep) successStep.classList.remove('hidden');

        // Clear local cart
        cart = [];
        saveCart();
        updateCartUI();
      } else {
        alert(result.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Failed to connect to server.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (verifyBtn) verifyBtn.disabled = false;
    }
  };

  // Checkout form submission compiles details and proceeds to COD or UPI payment
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const pincode = document.getElementById('cust-pincode').value.trim();
      const address = document.getElementById('cust-address').value.trim();
      
      let selectedPayment = 'COD';
      paymentRadios.forEach(radio => {
        if (radio.checked) {
          selectedPayment = radio.value;
        }
      });

      let totalAmount = 0;
      let orderItems = [];
      cart.forEach(item => {
        totalAmount += item.price * item.qty;
        orderItems.push({
          name: item.name,
          qty: item.qty,
          price: item.price
        });
      });

      window.currentOrderData = {
        userId: localStorage.getItem('nexus_user_id') || 'guest',
        userEmail: localStorage.getItem('nexus_user_email') || '',
        name,
        phone,
        pincode,
        address,
        paymentMethod: selectedPayment,
        items: orderItems,
        total: totalAmount
      };

      if (selectedPayment === 'COD') {
        await submitOrderToServer(window.currentOrderData);
      } else {
        // Show UPI Portal
        const deliveryStep = document.getElementById('checkout-delivery-step');
        const upiStep = document.getElementById('checkout-upi-step');
        const upiAmountVal = document.getElementById('upi-amount-val');
        const qrSubtext = document.querySelector('.qr-subtext');

        if (upiAmountVal) upiAmountVal.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
        if (qrSubtext) qrSubtext.textContent = `Scan to pay ₹${totalAmount.toLocaleString('en-IN')}`;

        if (deliveryStep) deliveryStep.classList.add('hidden');
        if (upiStep) upiStep.classList.remove('hidden');
      }
    });
  }

  // UPI verification form handler
  const upiForm = document.getElementById('upi-verification-form');
  if (upiForm) {
    upiForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const utr = document.getElementById('upi-utr').value.trim();
      if (window.currentOrderData) {
        window.currentOrderData.paymentDetails = { utr };
        await submitOrderToServer(window.currentOrderData);
      }
    });
  }

  // UPI Back button handler
  const upiBackBtn = document.getElementById('upi-back-btn');
  if (upiBackBtn) {
    upiBackBtn.addEventListener('click', () => {
      const deliveryStep = document.getElementById('checkout-delivery-step');
      const upiStep = document.getElementById('checkout-upi-step');
      if (deliveryStep) deliveryStep.classList.remove('hidden');
      if (upiStep) upiStep.classList.add('hidden');
    });
  }

  // Copy UPI ID helper
  const copyUpiBtn = document.getElementById('copy-upi-btn');
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
      const upiIdElement = document.getElementById('upi-val-id');
      if (upiIdElement) {
        const upiId = upiIdElement.textContent;
        navigator.clipboard.writeText(upiId).then(() => {
          const copyStatus = document.getElementById('copy-status');
          if (copyStatus) {
            copyStatus.textContent = 'Copied!';
            setTimeout(() => {
              copyStatus.textContent = 'Copy';
            }, 2000);
          }
        });
      }
    });
  }

  // Done button handler
  const successDoneBtn = document.getElementById('success-done-btn');
  if (successDoneBtn) {
    successDoneBtn.addEventListener('click', () => {
      closeCheckout();
    });
  }

  // 9. Authentication Logic (Register / Login Modal / JWT Sessions)
  const authModal = document.getElementById('auth-modal');
  const authTrigger = document.getElementById('nav-auth-trigger');
  const authCloseBtn = document.getElementById('auth-modal-close');
  const authHeaderState = document.getElementById('auth-header-state');
  
  const authFeedback = document.getElementById('auth-feedback');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authTabBtns = document.querySelectorAll('.auth-tab-btn');
  const authForms = document.querySelectorAll('.auth-form');

  // Open / Close Modal Helpers
  const openAuthModal = () => {
    if (authModal) {
      authModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      hideAuthFeedback();
    }
  };

  const closeAuthModal = () => {
    if (authModal) {
      authModal.classList.remove('open');
      document.body.style.overflow = 'auto';
      loginForm.reset();
      registerForm.reset();
    }
  };

  const showAuthFeedback = (msg, isError = true) => {
    if (authFeedback) {
      authFeedback.textContent = msg;
      authFeedback.className = `auth-feedback ${isError ? 'error' : 'success'}`;
      authFeedback.classList.remove('hidden');
    }
  };

  const hideAuthFeedback = () => {
    if (authFeedback) {
      authFeedback.classList.add('hidden');
    }
  };

  // Attach toggle triggers
  if (authTrigger) {
    authTrigger.addEventListener('click', openAuthModal);
  }
  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', closeAuthModal);
  }
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  // Auth Tab Toggles (Sign In / Register)
  authTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      authTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${targetTab}-form`) {
          form.classList.add('active');
        }
      });

      // Update subtitle dynamically
      const subtitleEl = document.getElementById('auth-subtitle');
      if (subtitleEl) {
        if (targetTab === 'login') {
          subtitleEl.textContent = 'Sign in to manage your health journal and orders.';
        } else {
          subtitleEl.textContent = 'Join Nexus Nutraceuticals to unlock better health.';
        }
      }

      hideAuthFeedback();
    });
  });

  // Load and check active user session from LocalStorage
  function checkUserSession() {
    const token = localStorage.getItem('nexus_auth_token');
    const userName = localStorage.getItem('nexus_user_name');

    if (token && userName && authHeaderState) {
      const initial = userName.trim().charAt(0).toUpperCase();
      // Display premium logged in view (Avatar Button)
      authHeaderState.innerHTML = `
        <button class="user-profile-trigger" id="user-profile-trigger" aria-label="View Account">
          <div class="user-avatar-circle">${initial}</div>
          <span class="user-trigger-name">${userName}</span>
          <span class="user-trigger-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
      `;

      // Attach profile trigger listener
      const profileTrigger = document.getElementById('user-profile-trigger');
      if (profileTrigger) {
        profileTrigger.addEventListener('click', openProfileDrawer);
      }
    } else if (authHeaderState) {
      // Restore default login button
      authHeaderState.innerHTML = `
        <button class="nav-auth-btn" id="nav-auth-trigger" aria-label="Sign In">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="auth-btn-label">Login</span>
        </button>
      `;

      // Re-attach modal trigger
      const newTrigger = document.getElementById('nav-auth-trigger');
      if (newTrigger) {
        newTrigger.addEventListener('click', openAuthModal);
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem('nexus_auth_token');
    localStorage.removeItem('nexus_user_name');
    localStorage.removeItem('nexus_user_id');
    localStorage.removeItem('nexus_user_email');
    checkUserSession();
  }

  // Helper to open/close profile drawer
  function openProfileDrawer() {
    if (profileDrawer && profileOverlay) {
      // Close other drawers if open
      closeCart();
      
      profileDrawer.classList.add('open');
      profileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      
      // Load orders and profile info
      loadUserProfileAndOrders();
    }
  }

  function closeProfileDrawer() {
    if (profileDrawer && profileOverlay) {
      profileDrawer.classList.remove('open');
      profileOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  async function loadUserProfileAndOrders() {
    const userId = localStorage.getItem('nexus_user_id');
    const userName = localStorage.getItem('nexus_user_name') || 'User';
    const userEmail = localStorage.getItem('nexus_user_email') || 'No email provided';

    // Populate profile details
    const avatarLarge = document.getElementById('profile-avatar-large');
    const profileName = document.getElementById('profile-user-name');
    const profileEmail = document.getElementById('profile-user-email');
    const profileDate = document.getElementById('profile-meta-date');
    const profileOrdersList = document.getElementById('profile-orders-list');

    if (avatarLarge) avatarLarge.textContent = userName.trim().charAt(0).toUpperCase();
    if (profileName) profileName.textContent = userName;
    if (profileEmail) profileEmail.textContent = userEmail;
    
    if (profileDate) {
      profileDate.textContent = `Wellness Member`;
    }

    if (!profileOrdersList) return;

    // Show loading state
    profileOrdersList.innerHTML = `
      <div style="text-align: center; padding: 2rem 0; color: var(--text-muted);">
        <div class="btn-spinner" style="border-top-color: var(--primary); width: 24px; height: 24px; margin-bottom: 0.5rem;"></div>
        <p style="font-size: 0.85rem;">Retrieving order history...</p>
      </div>
    `;

    try {
      const response = await fetch(`/api/orders/user/${userId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.orders.length === 0) {
          profileOrdersList.innerHTML = `
            <div class="orders-empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-orders-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <p>No orders placed yet.</p>
              <a href="#shop" class="btn btn-primary close-profile-link" id="profile-empty-shop-btn" style="font-size: 0.85rem; padding: 0.5rem 1rem;">Shop Vitamin B12</a>
            </div>
          `;
          
          const emptyShopBtn = document.getElementById('profile-empty-shop-btn');
          if (emptyShopBtn) {
            emptyShopBtn.addEventListener('click', closeProfileDrawer);
          }
        } else {
          // Sort orders by date descending
          const sortedOrders = data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          profileOrdersList.innerHTML = sortedOrders.map(order => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const statusClass = order.status.includes('Pending') ? 'pending' : 'success';
            
            return `
              <div class="user-order-card">
                <div class="order-card-header">
                  <span class="order-card-id">${order.id}</span>
                  <span class="order-card-status-badge ${statusClass}">${order.status}</span>
                </div>
                <div class="order-card-body">
                  ${order.items.map(item => `
                    <div class="order-card-item">
                      <strong>${item.qty}x</strong> ${item.name}
                    </div>
                  `).join('')}
                </div>
                <div class="order-card-footer">
                  <span class="order-card-date">${formattedDate}</span>
                  <span class="order-card-total">₹${order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            `;
          }).join('');
        }
      } else {
        profileOrdersList.innerHTML = `<p style="color: #EF4444; font-size: 0.85rem; text-align: center;">Failed to load order history.</p>`;
      }
    } catch (err) {
      console.error(err);
      profileOrdersList.innerHTML = `<p style="color: #EF4444; font-size: 0.85rem; text-align: center;">Network error while loading orders.</p>`;
    }
  }

  // Handle Login submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const submitBtn = document.getElementById('login-submit-btn');

      if (!email || !password) {
        return showAuthFeedback('Please enter all fields.');
      }

      try {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Signing in...';

        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Login failed.');
        }

        // Save session credentials
        localStorage.setItem('nexus_auth_token', data.token);
        localStorage.setItem('nexus_user_name', data.user.name);
        localStorage.setItem('nexus_user_id', data.user.id);
        localStorage.setItem('nexus_user_email', data.user.email);

        showAuthFeedback('Logged in successfully!', false);
        checkUserSession();

        setTimeout(() => {
          closeAuthModal();
          if (window.openCheckoutAfterLogin) {
            window.openCheckoutAfterLogin = false;
            setTimeout(openCheckout, 300);
          }
        }, 1000);

      } catch (err) {
        showAuthFeedback(err.message || 'An error occurred during sign in.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Sign In';
      }
    });
  }

  // Handle Registration submission
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const submitBtn = document.getElementById('register-submit-btn');

      if (!name || !email || !password) {
        return showAuthFeedback('Please enter all fields.');
      }

      if (password.length < 6) {
        return showAuthFeedback('Password must be at least 6 characters.');
      }

      try {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Creating account...';

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed.');
        }

        // Save session credentials
        localStorage.setItem('nexus_auth_token', data.token);
        localStorage.setItem('nexus_user_name', data.user.name);
        localStorage.setItem('nexus_user_id', data.user.id);
        localStorage.setItem('nexus_user_email', data.user.email);

        showAuthFeedback('Account created successfully!', false);
        checkUserSession();

        setTimeout(() => {
          closeAuthModal();
          if (window.openCheckoutAfterLogin) {
            window.openCheckoutAfterLogin = false;
            setTimeout(openCheckout, 300);
          }
        }, 1000);

      } catch (err) {
        showAuthFeedback(err.message || 'An error occurred during account creation.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Create Account';
      }
    });
  }

  // Initialize session state check
  checkUserSession();

  // Contact Form Submission Handler
  const contactForm = document.getElementById('home-contact-form');
  const contactFeedback = document.getElementById('contact-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('contact-submit-btn');
      const originalText = submitBtn.querySelector('span').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';

      // Simulate API call and show glassmorphic success toast
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
        contactForm.reset();

        if (contactFeedback) {
          contactFeedback.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
          contactFeedback.className = 'contact-feedback success';
          contactFeedback.classList.remove('hidden');
          
          // Auto scroll to feedback message
          contactFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Auto hide after 5 seconds
          setTimeout(() => {
            contactFeedback.classList.add('hidden');
          }, 5000);
        }
      }, 1000);
    });
  }

  // B12 Wellness Blog Articles Data
  const blogArticles = {
    'article-1': `
      <span class="blog-read-category">Purity Science</span>
      <h2 class="blog-read-title">Cyanocobalamin vs. Methylcobalamin: Which B12 is Best?</h2>
      <div class="blog-read-meta">Published June 15, 2026 &bull; 5 Min Read</div>
      <div class="blog-read-content">
        <p>Vitamin B12 (Cobalamin) is a vital water-soluble nutrient required for red blood cell formation, neurological health, and DNA synthesis. When selecting a supplement, the two most common forms you will encounter are Cyanocobalamin and Methylcobalamin. But which one is truly best for your wellness routine?</p>
        
        <h4>Understanding the Chemistry</h4>
        <p><strong>Cyanocobalamin</strong> is a synthesized form of Vitamin B12 containing a cobalt molecule bound to a safe cyano group. It is the most chemically stable form, making it exceptionally resilient to heat, moisture, and oxidation. Once ingested, the body converts it into active physiological coenzymes (Methylcobalamin and Adenosylcobalamin).</p>
        
        <p><strong>Methylcobalamin</strong> is a naturally coenzymated form of B12 that contains a methyl group. While it is directly active in biological cycles (like the methylation pathway), it is highly sensitive to light and degrades rapidly when exposed to environmental elements.</p>
        
        <h4>Purity and Bioavailability Advantage</h4>
        <p>Many wellness advocates claim Methylcobalamin is superior because it does not require conversion. However, clinical studies show that Cyanocobalamin displays highly stable rates of absorption. In crystalline powder forms, raw Cyanocobalamin achieves a certified HPLC purity level of <strong>&ge;99.0%</strong>, which is unmatched in shelf-stability.</p>
        
        <blockquote>
          "Cyanocobalamin's chemical stability guarantees that you get the exact dosage labeled on the jar, preserving active potency for months without degradation."
        </blockquote>
        
        <h4>Conclusion</h4>
        <p>For daily supplementation, Cyanocobalamin raw powder provides the highest stability, long shelf-life, and precise dosing. Bypassing the binders of tablets by dissolving this pure crystalline powder in water allows your body to absorb this essential nutrient efficiently, supporting sustained energy, nerve protection, and metabolic health.</p>
      </div>
    `,
    'article-2': `
      <span class="blog-read-category">Bioavailability</span>
      <h2 class="blog-read-title">Why Water-Soluble Formula Absorbs 5x Faster Than Tablets</h2>
      <div class="blog-read-meta">Published June 12, 2026 &bull; 4 Min Read</div>
      <div class="blog-read-content">
        <p>Many consumers take daily Vitamin B12 tablets without realizing that a significant portion of the active nutrient goes to waste. The culprit? The physical structure of traditional pills and the complex path of human digestion.</p>
        
        <h4>The Problem with Compressed Tablets</h4>
        <p>To manufacture tablets, active vitamins must be combined with chemical binders, lubricants, and flow agents (such as silicon dioxide, magnesium stearate, and calcium phosphate). These compressed pills are dense and hard to dissolve. The stomach has to break down these physical binders before releasing the B12, leaving the nutrient exposed to aggressive stomach acids and digestive enzymes for extended periods.</p>
        
        <h4>The Mucosal and Sublingual Advantage</h4>
        <p>Vitamin B12 requires a special gastric protein called <i>Intrinsic Factor</i> to be absorbed in the small intestine. This pathway is easily saturated and bottlenecked. However, our water-soluble crystalline powder bypasses this limitation:</p>
        
        <ul>
          <li><strong>Instant Dissolution:</strong> Dissolving B12 crystals in liquid breaks them down to a molecular level instantly, saving your stomach the physical labor.</li>
          <li><strong>Sublingual Absorption:</strong> Taking the liquid sublingually (under the tongue) allows B12 to pass directly through the highly vascular oral mucosa, entering the bloodstream directly.</li>
          <li><strong>Bypassing GI Degradation:</strong> Mucosal absorption avoids the gut entirely, preventing degradation from gastric acids.</li>
        </ul>
        
        <h4>Scientific Verification</h4>
        <p>HPLC dissolution profiles verify that water-soluble crystalline Cyanocobalamin achieves <strong>100% molecular dissolution within 60 seconds</strong>, compared to standard tablets which take up to 30 minutes to partially dissolve. This translates to an absorption rate up to 5 times faster, meaning cellular energy pathways are activated almost instantly.</p>
      </div>
    `,
    'article-3': `
      <span class="blog-read-category">Deficiency Signs</span>
      <h2 class="blog-read-title">Top 5 Critical Signs of Vitamin B12 Deficiency</h2>
      <div class="blog-read-meta">Published June 08, 2026 &bull; 6 Min Read</div>
      <div class="blog-read-content">
        <p>Vitamin B12 plays an indispensable role in maintaining a healthy nervous system and producing red blood cells. Since our bodies cannot manufacture B12, we must obtain it from diet or supplements. Over time, inadequate B12 intake can lead to subtle but dangerous symptoms. Here are the top 5 warning signs you should watch for.</p>
        
        <h4>1. Chronic Fatigue & Low Cellular Energy</h4>
        <p>Since B12 is a key coenzyme in cellular ATP production (the energy currency of cells), deficiency directly hinders energy metabolism. You may feel chronically fatigued, sluggish, or physically weak, even after a full night's rest.</p>
        
        <h4>2. Persistent Brain Fog & Memory Issues</h4>
        <p>Low B12 levels degrade the myelin sheaths that insulate and protect nerve fibers. This neural degradation slows down signals in the brain, resulting in poor focus, short-term memory lapses, and general cognitive "fog."</p>
        
        <h4>3. Tingling Sensations in Hands and Feet</h4>
        <p>Paresthesia, commonly described as a "pins and needles" sensation in the extremities, is a classic sign of nerve damage caused by B12 depletion. Without sufficient B12, the myelin sheath breaks down, causing nerves to misfire.</p>
        
        <h4>4. Pale or Jaundiced Skin</h4>
        <p>B12 deficiency disrupts red blood cell production, causing a type of anemia called megaloblastic anemia. The body produces large, fragile red blood cells that cannot carry oxygen efficiently, leading to pale skin or a slight yellow (jaundiced) tint.</p>
        
        <h4>5. Mouth Ulcers & Tongue Inflammation (Glossitis)</h4>
        <p>Glossitis is an inflammation of the tongue that causes it to swell, turn red, and feel painful or smooth. It can be accompanied by frequent canker sores or tingling in the mouth, which are early warning indicators of Vitamin B depletion.</p>
        
        <h4>The Pure Solution</h4>
        <p>If you experience these signs, restoring B12 levels quickly is essential. Nexus Nutraceuticals Water Soluble B12 Powder delivers 100% active, crystalline Cyanocobalamin that absorbs instantly to support nerve repair, cellular energy regeneration, and red blood cell health.</p>
      </div>
    `
  };

  // Blog Modal Overlay Event Listeners
  const blogModal = document.getElementById('blog-modal');
  const blogModalBody = document.getElementById('blog-modal-body');
  const blogModalClose = document.getElementById('blog-modal-close');
  const readArticleBtns = document.querySelectorAll('.blog-read-btn');

  if (blogModal && blogModalBody) {
    readArticleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const articleId = btn.getAttribute('data-article');
        const articleHtml = blogArticles[articleId];

        if (articleHtml) {
          blogModalBody.innerHTML = articleHtml;
          blogModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeBlogModal = () => {
      blogModal.classList.remove('open');
      if (!authModal.classList.contains('open') && !checkoutModal.classList.contains('open') && (!mobileDrawer || !mobileDrawer.classList.contains('open'))) {
        document.body.style.overflow = 'auto';
      }
    };

    if (blogModalClose) {
      blogModalClose.addEventListener('click', closeBlogModal);
    }

    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) {
        closeBlogModal();
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
