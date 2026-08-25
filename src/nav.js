// 3. Robust Navigation Active State System
const allNavLinks = document.querySelectorAll('.nav-link, .drawer-menu-link');
const currentPath = window.location.pathname.toLowerCase();

const setActiveNav = (navName) => {
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if (link.getAttribute('data-nav') === navName) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
};

// Handle initial active state based on URL
let basePathNav = 'home';
if (currentPath.includes('shop')) basePathNav = 'shop';
else if (currentPath.includes('benefits')) basePathNav = 'benefits';
else if (currentPath.includes('about')) basePathNav = 'about';
else if (currentPath.includes('contact')) basePathNav = 'contact';
else if (currentPath.includes('blog') || currentPath.includes('article')) basePathNav = 'blog';
else if (currentPath.includes('certificate')) basePathNav = 'certificates';
else if (currentPath.includes('career')) basePathNav = 'careers';
else if (currentPath.includes('polic') || currentPath.includes('terms')) basePathNav = '';

// If we have a hash on load, use that instead for the home page
const hash = window.location.hash.replace('#', '');
if ((currentPath === '/' || currentPath === '/index.html' || currentPath === '') && hash) {
    if (['benefits', 'shop', 'about', 'contact', 'blog'].includes(hash)) {
        basePathNav = hash;
    }
}

if (basePathNav) setActiveNav(basePathNav);

// Smooth scroll interceptor
const headerOffset = 90; // Height of the sticky header

allNavLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if link is an anchor on the same page
    const isHomePage = currentPath === '/' || currentPath === '/index.html' || currentPath === '';
    const isTargetHomePage = href.startsWith('/') || href.startsWith('/index.html') || href.startsWith('#');
    const targetHash = href.includes('#') ? href.split('#')[1] : null;

    if (isHomePage && isTargetHomePage && targetHash) {
      const targetSection = document.getElementById(targetHash);
      if (targetSection) {
        e.preventDefault();
        
        // Immediately set active state
        setActiveNav(link.getAttribute('data-nav'));
        
        // Update URL hash without jumping
        history.pushState(null, null, '#' + targetHash);
        
        // Calculate position and scroll
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (isHomePage && (href === '/' || href === '/index.html')) {
        // Clicking "Home" on the home page
        e.preventDefault();
        setActiveNav('home');
        history.pushState(null, null, '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

// Scroll Spy for Home Page
if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
  // Grab ALL sections on the home page in order
  const allSections = document.querySelectorAll('section');
  
  if (allSections.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSection = null;
      // The detection line is slightly below the sticky header
      const scrollPosition = window.scrollY + headerOffset + 150; 
      
      allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        // Check if the detection line is within this section
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });
      
      // If we are at the very bottom of the page, forcefully activate the last relevant section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
         currentSection = 'faqs'; // FAQS is the very last section physically
      }
      
      // Map non-navigation sections to their parent/logical equivalent
      if (currentSection === 'nutrition') {
        currentSection = 'shop';
      } else if (currentSection === 'faqs') {
        currentSection = 'blog';
      }
      
      // Only set active if we found a valid mapping
      if (currentSection && ['home', 'benefits', 'shop', 'about', 'contact', 'blog'].includes(currentSection)) {
        setActiveNav(currentSection);
      }
    }, { passive: true });
    
    // Dispatch a scroll event immediately to set correct initial state
    window.dispatchEvent(new Event('scroll'));
  }
  
  // Handle initial hash scroll if arriving from another page
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const targetHash = window.location.hash.substring(1);
      const targetSection = document.getElementById(targetHash);
      if (targetSection) {
        setTimeout(() => {
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });
}

// Mobile Menu Logic
const hamburger = document.querySelector('.nav-hamburger');
const drawer = document.querySelector('.mobile-drawer-menu');
const overlay = document.querySelector('.mobile-drawer-overlay');
const closeBtn = document.querySelector('.drawer-menu-close');
const drawerLinks = document.querySelectorAll('.drawer-menu-link');

if (hamburger && drawer && overlay) {
  function openMenu() {
    drawer.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
