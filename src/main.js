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

    // 8. WhatsApp Ordering System
  const whatsappBtn = document.getElementById('pdp-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const flavourEl = document.querySelector('input[name="b12-flavour"]:checked');
      const offerEl = document.querySelector('input[name="b12-offer"]:checked');
      const priceEl = document.getElementById('pdp-sale');
      
      const flavour = flavourEl ? flavourEl.value : 'Strawberry';
      const offerVal = offerEl ? offerEl.value : '1';
      const price = priceEl ? priceEl.textContent : '';
      
      const msg = `Hello Nexus Nutraceuticals,\n\nI am interested in placing an order.\n\nProduct: Nexus Vitamin B12 + D3 Powder\nFlavour: ${flavour}\nPack: Buy ${offerVal}\nPrice: ${price}\n\nPlease share the next steps for completing my order.\n\nThank you.`;
      
      const url = `https://wa.me/916357002100?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }

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

