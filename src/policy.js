import './nav.js';
document.addEventListener('DOMContentLoaded', async () => {
    // Determine slug from URL
    let path = window.location.pathname;
    let slug = path.replace('.html', '').replace('/', '');
    
    // Default fallback if loading root or unknown
    if (!slug || slug === 'policy') {
        slug = 'privacy-policy'; 
    }

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/';

    try {
        const response = await fetch(`${API_BASE_URL}policies/${slug}/`);
        if (!response.ok) throw new Error('Policy not found');
        const policyData = await response.json();
        
        renderPolicy(policyData);
        setupScrollSpy();
    } catch (error) {
        console.error('Error fetching policy:', error);
        document.getElementById('policy-main-content').innerHTML = `
            <div class="policy-section">
                <h2>Policy Not Found</h2>
                <p>We couldn't load the requested policy. Please try again later or contact support.</p>
            </div>
        `;
        document.getElementById('policy-hero-content').innerHTML = `
            <h1 class="policy-title">Error</h1>
        `;
    }
});

function renderPolicy(data) {
    // 1. Update Head
    document.title = `${data.title} - Nexus Nutraceuticals`;
    
    // 2. Render Hero
    const dateObj = new Date(data.last_updated_at);
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    document.getElementById('policy-hero-content').innerHTML = `
        <div class="policy-title">${data.title}</div>
        <div class="policy-short-desc">${data.short_description || ''}</div>
        <div class="policy-last-updated">Last Updated: ${formattedDate}</div>
    `;
    
    // 3. Render Breadcrumb
    document.getElementById('policy-breadcrumb').innerHTML = `
        <a href="/">Home</a> / <a href="#">Policies</a> / ${data.title}
    `;
    
    // 4. Render TOC and Main Content
    const tocEl = document.getElementById('policy-toc');
    const mainEl = document.getElementById('policy-main-content');
    
    tocEl.innerHTML = '';
    mainEl.innerHTML = '';
    
    data.sections.forEach((section, index) => {
        const sectionId = `section-${index + 1}`;
        
        // TOC Link
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${sectionId}" class="toc-link" data-target="${sectionId}">${section.title}</a>`;
        tocEl.appendChild(li);
        
        // Main Content Section
        const sectionEl = document.createElement('section');
        sectionEl.className = 'policy-section';
        sectionEl.id = sectionId;
        
        let sectionHTML = `
            <div class="section-header">
                <span class="section-number">0${index + 1}.</span>
                <h2 class="section-title">${section.title}</h2>
            </div>
            <div class="section-body">
        `;
        
        section.items.forEach(item => {
            sectionHTML += renderContentItem(item);
        });
        
        sectionHTML += `</div>`;
        sectionEl.innerHTML = sectionHTML;
        mainEl.appendChild(sectionEl);
    });
    
    // 5. Render Contact Card at bottom
    if (data.contact_info) {
        const contactEl = document.createElement('div');
        contactEl.className = 'policy-contact-card';
        contactEl.innerHTML = `
            <h3>Have Questions?</h3>
            <p>If you have any questions regarding this policy, our team is here to help.</p>
            <p><strong>${data.contact_info.company_name}</strong><br>
            Email: ${data.contact_info.support_email}<br>
            Phone: ${data.contact_info.support_phone}</p>
            <a href="/index.html#contact" class="contact-btn">Contact Us</a>
        `;
        mainEl.appendChild(contactEl);
    }
}

function renderContentItem(item) {
    let content = item.content || '';
    switch(item.item_type) {
        case 'paragraph':
            return `<div class="content-item">${content}</div>`;
        case 'bullet_list':
        case 'numbered_list':
            return `<div class="content-item">${content}</div>`;
        case 'information_card':
            return `<div class="content-item info-card">${content}</div>`;
        case 'warning_card':
            return `<div class="content-item warning-card">${content}</div>`;
        case 'important_notice':
            return `<div class="content-item important-notice">${content}</div>`;
        case 'eligibility_card':
            return `<div class="content-item eligibility-card">${content}</div>`;
        case 'delivery_card':
            return `<div class="content-item delivery-card">${content}</div>`;
        case 'timeline_step':
            return `<div class="content-item timeline-step">${content}</div>`;
        case 'contact_card':
            return `<div class="content-item info-card">${content}</div>`;
        default:
            return `<div class="content-item">${content}</div>`;
    }
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('.policy-section');
    const navLinks = document.querySelectorAll('.toc-link');
    
    // Mobile TOC Toggle
    const tocWrapper = document.querySelector('.toc-sticky-wrapper');
    const tocHeader = tocWrapper ? tocWrapper.querySelector('h3') : null;
    if (tocHeader) {
        tocHeader.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                tocWrapper.classList.toggle('open');
            }
        });
    }

    // Smooth scroll for TOC links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu on click
            if (window.innerWidth <= 768 && tocWrapper) {
                tocWrapper.classList.remove('open');
            }
            
            const targetId = link.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if(targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Intersection Observer for scroll spy
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px', // Trigger near top
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(sec => observer.observe(sec));
}
