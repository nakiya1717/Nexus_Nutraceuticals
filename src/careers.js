import './nav.js';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

document.addEventListener('DOMContentLoaded', () => {
    const isJobDetailsPage = window.location.pathname.startsWith('/careers/');
    
    if (isJobDetailsPage) {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const slug = parts[1];
        if (slug) {
            loadJobDetails(slug);
        }
    } else {
        const jobsContainer = document.getElementById('jobs-container');
        if (jobsContainer) {
            fetchJobs();
        }
    }

    if (document.getElementById('job-application-form')) {
        setupFileUploadUI();
        setupCityDropdown();
        document.getElementById('job-application-form').addEventListener('submit', handleApplicationSubmit);
    }
});

async function fetchJobs() {
    const container = document.getElementById('jobs-container');
    try {
        const res = await fetch(`${API_BASE_URL}careers/jobs/`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const jobs = await res.json();
        
        if (jobs.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 4rem 1rem; color:#64748b;">No current openings available. Check back later.</div>';
            return;
        }

        container.innerHTML = jobs.map(job => `
            <div class="job-card">
                <span class="job-card-badge">Now Hiring</span>
                <h3>${job.title}</h3>
                <div class="department">${job.department}</div>
                
                <div class="job-meta-chips">
                    <span class="meta-pill">📍 ${job.location}</span>
                    <span class="meta-pill">💼 ${job.employment_type}</span>
                    <span class="meta-pill">🏢 ${job.workplace_type}</span>
                    <span class="meta-pill">🎯 ${job.experience_required}</span>
                </div>
                
                <p class="job-card-summary">${job.short_description}</p>
                
                <div class="role-glance">
                    <h4>Your Role at a Glance</h4>
                    <ul>
                        <li>Promote health and wellness products</li>
                        <li>Build customer and business relationships</li>
                        <li>Find new sales opportunities</li>
                        <li>Support marketing campaigns</li>
                    </ul>
                </div>
                
                <div class="job-card-actions">
                    <a href="/careers/${job.slug}" class="btn btn-outline" style="flex:1;">View Job Details →</a>
                    <a href="/careers/${job.slug}#apply" class="btn btn-primary" style="flex:1;">Apply Now</a>
                </div>
            </div>
        `).join('');

    } catch (e) {
        container.innerHTML = '<p class="error" style="text-align:center;">Failed to load current openings. Please try again later.</p>';
    }
}

async function loadJobDetails() {
    const container = document.getElementById('job-detail-main');
    let path = window.location.pathname;
    
    let slug = '';
    if (path.includes('/careers/')) {
        slug = path.split('/careers/')[1].replace('/', '');
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        slug = urlParams.get('slug') || path.replace('.html', '').replace('/', '');
    }

    if (!slug) {
        container.innerHTML = '<div class="container" style="text-align:center; padding:5rem 0;"><h2>Job Not Found</h2></div>';
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}careers/jobs/${slug}/`);
        if (!res.ok) {
            if (res.status === 404) throw new Error('Job Not Found');
            throw new Error('Error loading job');
        }
        const job = await res.json();

        // Build UI sections
        const isClosed = job.status === 'Closed';
        
        let applyHTML = isClosed 
            ? `<div class="btn btn-block" style="background:#e2e8f0;color:#64748b;cursor:not-allowed;">This Position Is Closed</div>`
            : `<button class="btn btn-primary btn-block open-apply-inline" style="padding:1rem; font-size:1.1rem;">Apply Now</button>
               <span class="hint">Takes only a few minutes to apply</span>`;

        // Map responsibilities to numbered list
        let responsibilitiesHTML = job.responsibilities.map((r, i) => `
            <li>
                <div class="num">${(i+1).toString().padStart(2, '0')}</div>
                <div class="text">${r}</div>
            </li>
        `).join('');

        // Map skills
        let skillsHTML = job.required_skills.map(s => `<span class="skill-chip">${s}</span>`).join('');
        let preferredSkillsHTML = job.preferred_skills.map(s => `<span class="skill-chip preferred">${s}</span>`).join('');

        // Map benefits
        let benefitsHTML = job.benefits.map(b => `
            <div class="benefit-card">
                <h4>${b.title}</h4>
                <p>${b.description}</p>
            </div>
        `).join('');

        const html = `
            <div class="job-breadcrumb" style="border-bottom:none; background:transparent;">
                <div class="container" style="color:#64748b;">
                    <a href="/">Home</a> <span style="margin:0 0.5rem;">/</span> <a href="/careers">Careers</a> <span style="margin:0 0.5rem;">/</span> <span style="color:var(--car-primary); font-weight:600;">${job.title}</span>
                </div>
            </div>

            <section class="job-hero" style="border-bottom:none; padding-top:2rem;">
                <div class="container">
                    <span class="job-card-badge" style="margin-bottom:1rem;">NOW HIRING</span>
                    <h1 style="font-size:2.8rem; margin:0 0 0.5rem;">${job.title}</h1>
                    <div class="subtitle" style="font-size:1.2rem; color:#475569; margin-bottom:2rem;">Help us grow a modern health & wellness brand.</div>
                    
                    <div class="job-meta-chips" style="margin-bottom:0;">
                        <span class="meta-pill">📍 ${job.location}</span>
                        <span class="meta-pill">💼 ${job.employment_type}</span>
                        <span class="meta-pill">🏢 ${job.workplace_type}</span>
                        <span class="meta-pill">🎯 Fresher / Experienced</span>
                        <span class="meta-pill" style="background:#e2fbe8; color:#166534; border-color:#bbf7d0;">💰 As per Experience + Performance-Based Incentives</span>
                    </div>
                </div>
            </section>

            <div class="job-layout" style="margin-top:2rem; padding-top:2rem; border-top:1px solid #e2e8f0;">
                <main class="job-main-content">
                    <h2>About This Opportunity</h2>
                    <div style="font-size:1.05rem; color:#475569; white-space:pre-wrap; line-height:1.7;">${job.full_description}</div>

                    <h2>What You'll Do</h2>
                    <ul class="responsibility-list">
                        ${responsibilitiesHTML}
                    </ul>

                    <h2>What We're Looking For</h2>
                    <div class="skills-container">
                        ${skillsHTML}
                    </div>

                    ${job.preferred_skills.length > 0 ? `
                        <h2 style="margin-top:2.5rem;">Great If You Also Have</h2>
                        <div class="skills-container">
                            ${preferredSkillsHTML}
                        </div>
                    ` : ''}

                    <h2>Who Can Apply?</h2>
                    <div class="benefits-grid" style="margin-bottom:2rem;">
                        <div class="benefit-card" style="border-left:4px solid var(--car-accent);">
                            <h4>Freshers</h4>
                            <p>Start your career in marketing and sales with comprehensive guidance.</p>
                        </div>
                        <div class="benefit-card" style="border-left:4px solid var(--car-primary);">
                            <h4>Experienced Candidates</h4>
                            <p>Bring your experience and help us grow faster in the local market.</p>
                        </div>
                    </div>

                    ${job.benefits.length > 0 ? `
                        <h2>Why Join Nexus?</h2>
                        <div class="benefits-grid">
                            ${benefitsHTML}
                        </div>
                    ` : ''}
                </main>

                <aside class="job-sidebar">
                    <div class="sidebar-apply-card">
                        <h3>Interested in This Opportunity?</h3>
                        <div class="sidebar-title">${job.title}</div>
                        
                        <ul class="sidebar-details">
                            <li>
                                <div class="icon">📍</div>
                                <div class="info"><span class="val">${job.location}</span></div>
                            </li>
                            <li>
                                <div class="icon">💼</div>
                                <div class="info"><span class="val">${job.employment_type}</span></div>
                            </li>
                            <li>
                                <div class="icon">🏢</div>
                                <div class="info"><span class="val">${job.workplace_type}</span></div>
                            </li>
                            <li>
                                <div class="icon">🎯</div>
                                <div class="info"><span class="val">${job.experience_required}</span></div>
                            </li>
                        </ul>

                        <div class="sidebar-highlight">
                            <h4>💰 Performance Rewards</h4>
                            <p>${job.salary_display}</p>
                        </div>

                        <div class="sidebar-footer">
                            ${applyHTML}
                        </div>
                    </div>
                </aside>
            </div>
        `;

        container.innerHTML = html;

        if (!isClosed) {
            document.querySelectorAll('.open-apply-inline').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const applySection = document.getElementById('apply-section');
                    applySection.style.display = 'block';
                    
                    // Add subtle highlight class (will define in JS or CSS later)
                    applySection.style.transition = 'background-color 1s ease';
                    applySection.style.backgroundColor = '#f0fdf4';
                    setTimeout(() => { applySection.style.backgroundColor = '#ffffff'; }, 1000);
                    
                    document.getElementById('job-application-form').dataset.slug = slug;
                    
                    // Smooth scroll accommodating sticky header
                    const headerOffset = 80;
                    const elementPosition = applySection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                });
            });
            
            if (window.location.hash === '#apply') {
                document.getElementById('apply-section').style.display = 'block';
                document.getElementById('job-application-form').dataset.slug = slug;
                setTimeout(() => {
                    document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        }
        setupFormPersistence(slug);
        setupCancelModal();

    } catch (e) {
        container.innerHTML = `<div class="container" style="text-align:center; padding:5rem 0;"><h2>${e.message}</h2><p>We couldn't load the requested job.</p></div>`;
    }
}

function setupCancelModal() {
    const clearBtn = document.getElementById('clear-form-btn');
    const cancelModal = document.getElementById('cancel-modal');
    const continueBtn = document.getElementById('cancel-continue-btn');
    const discardBtn = document.getElementById('cancel-discard-btn');
    
    if (!clearBtn || !cancelModal) return;
    
    clearBtn.addEventListener('click', () => {
        cancelModal.classList.remove('hidden');
    });
    
    continueBtn.addEventListener('click', () => {
        cancelModal.classList.add('hidden');
    });
    
    discardBtn.addEventListener('click', () => {
        const form = document.getElementById('job-application-form');
        form.reset();
        
        // Clear session storage
        const slug = form.dataset.slug;
        if(slug) sessionStorage.removeItem(`draft_${slug}`);
        
        // Hide form and modal
        cancelModal.classList.add('hidden');
        document.getElementById('apply-section').style.display = 'none';
        
        // Scroll back to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function setupFormPersistence(slug) {
    const form = document.getElementById('job-application-form');
    if(!form) return;
    
    const draftKey = `draft_${slug}`;
    const savedDraft = sessionStorage.getItem(draftKey);
    
    if (savedDraft) {
        try {
            const data = JSON.parse(savedDraft);
            Object.keys(data).forEach(key => {
                const input = form.elements[key];
                if(input) {
                    if(input.type === 'radio' || input.type === 'checkbox') {
                        // Check nodes with multiple radios
                        if(input.length !== undefined && !input.tagName) {
                            Array.from(input).forEach(r => {
                                if(r.value === data[key]) r.checked = true;
                            });
                        } else {
                            input.checked = data[key];
                        }
                    } else if(input.type !== 'file') {
                        input.value = data[key];
                    }
                }
            });
        } catch(e) {}
    }
    
    form.addEventListener('input', (e) => {
        if(e.target.type === 'file' || e.target.type === 'password') return;
        
        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((val, key) => {
            if(key !== 'resume') dataObj[key] = val;
        });
        sessionStorage.setItem(draftKey, JSON.stringify(dataObj));
    });
}

function setupFileUploadUI() {
    const area = document.getElementById('file-upload-area');
    const input = document.getElementById('resume-input');
    const info = document.getElementById('file-selected-info');
    const display = document.getElementById('file-name-display');
    const removeBtn = document.getElementById('remove-file-btn');
    
    if(!area || !input) return;
    
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const VALID_EXTENSIONS = ['.pdf', '.doc', '.docx'];

    function validateFile(file) {
        // Clear previous error if any
        const existingError = area.parentNode.querySelector('.error-text');
        if(existingError) existingError.remove();
        area.classList.remove('is-invalid');
        
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if(!VALID_EXTENSIONS.includes(ext)) {
            showFieldError(input, "Unsupported file type. Please upload a PDF, DOC, or DOCX resume.");
            input.value = '';
            return false;
        }
        if(file.size > MAX_SIZE) {
            showFieldError(input, "This file is too large. Please upload a file smaller than 5 MB.");
            input.value = '';
            return false;
        }
        
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        let previewHTML = '';
        if(ext === '.pdf') {
            const fileURL = URL.createObjectURL(file);
            input.dataset.previewUrl = fileURL;
            previewHTML = `<a href="${fileURL}" target="_blank" style="color:#166534; text-decoration:underline; font-size:0.9rem; margin-right:1rem;">Preview / Open</a>`;
        }
        
        display.innerHTML = `<strong>📄 ${file.name}</strong><br><span style="font-size:0.85rem;">${ext.toUpperCase().substring(1)} • ${sizeMB} MB</span>`;
        if (previewHTML) {
            display.innerHTML += `<br>${previewHTML}`;
        }
        
        area.style.display = 'none';
        info.style.display = 'flex';
        return true;
    }

    input.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            validateFile(e.target.files[0]);
        }
    });
    
    area.addEventListener('click', () => {
        input.click();
    });
    
    removeBtn.addEventListener('click', () => {
        if (input.dataset.previewUrl) {
            URL.revokeObjectURL(input.dataset.previewUrl);
            input.dataset.previewUrl = '';
        }
        input.value = '';
        info.style.display = 'none';
        area.style.display = 'block';
    });
    
    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('dragover');
        area.querySelector('.file-upload-text').innerText = "Drop file here";
    });
    
    area.addEventListener('dragleave', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        area.querySelector('.file-upload-text').innerText = "Drag & drop or click to upload";
    });
    
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('dragover');
        area.querySelector('.file-upload-text').innerText = "Drag & drop or click to upload";
        
        if (e.dataTransfer.files.length > 0) {
            input.files = e.dataTransfer.files;
            if(input.files.length > 0) {
                validateFile(input.files[0]);
            }
        }
    });
}

async function handleApplicationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const slug = form.dataset.slug;
    const errorDiv = document.getElementById('form-error');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Clear all previous errors
    clearAllErrors(form);
    
    // Frontend Validation
    let isValid = true;
    let firstInvalid = null;
    
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        if(field.type === 'radio' || field.type === 'checkbox') {
            if(field.type === 'radio') {
                const checked = form.querySelector(`input[name="${field.name}"]:checked`);
                if(!checked) {
                    isValid = false;
                    const group = field.closest('.segmented-control') || field.parentElement;
                    showFieldError(group, "Please select an option.");
                    if(!firstInvalid) firstInvalid = group;
                }
            } else if(field.type === 'checkbox' && !field.checked) {
                isValid = false;
                showFieldError(field.parentElement, "You must accept to proceed.");
                if(!firstInvalid) firstInvalid = field.parentElement;
            }
        } else if(!field.value || !field.value.trim()) {
            isValid = false;
            let msg = "This field is required.";
            if(field.name === 'full_name') msg = "Please enter your full name.";
            else if(field.name === 'mobile_number') msg = "Please enter a valid 10-digit Indian mobile number.";
            else if(field.name === 'email') msg = "Please enter a valid email address.";
            else if(field.type === 'file') msg = "Please upload a valid PDF, DOC, or DOCX resume.";
            
            showFieldError(field, msg);
            if(!firstInvalid) firstInvalid = field;
        } else {
            // Further specific validation
            if(field.name === 'full_name') {
                if(field.value.trim().length < 3 || /\d/.test(field.value)) {
                    isValid = false;
                    showFieldError(field, "Please enter a valid full name (no numbers).");
                    if(!firstInvalid) firstInvalid = field;
                } else {
                    markValid(field);
                }
            } else if(field.name === 'mobile_number') {
                if(!/^[6-9][0-9]{9}$/.test(field.value)) {
                    isValid = false;
                    showFieldError(field, "Please enter a valid 10-digit Indian mobile number.");
                    if(!firstInvalid) firstInvalid = field;
                } else {
                    markValid(field);
                }
            } else if(field.name === 'email') {
                if(!/^[\w\.\+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/.test(field.value)) {
                    isValid = false;
                    showFieldError(field, "Please enter a valid email address.");
                    if(!firstInvalid) firstInvalid = field;
                } else {
                    markValid(field);
                }
            } else if(field.type !== 'file') {
                markValid(field);
            }
        }
    });

    if(!isValid) {
        errorDiv.innerText = "Please correct the highlighted fields before submitting your application.";
        if(firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if(firstInvalid.focus) firstInvalid.focus();
        }
        return;
    }

    // Add simple loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Submitting Your Application... <span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span>';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    
    // Override city if 'Other' was selected
    if(formData.get('current_city') === 'Other') {
        formData.set('current_city', formData.get('current_city_other'));
    }

    try {
        const res = await fetch(`${API_BASE_URL}careers/jobs/${slug}/apply/`, {
            method: 'POST',
            body: formData 
        });

        const data = await res.json();

        if (res.ok) {
            // Success
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('application-success').classList.remove('hidden');
            
            // If API returned an ID
            const idToDisplay = data.id || data.application_id || Math.floor(Math.random() * 90000) + 10000;
            const successText = document.getElementById('application-success').querySelector('p');
            if (successText) {
                successText.innerHTML += `<br><br><strong>Application ID:</strong> NEX-${idToDisplay}`;
            }

            // Clear draft
            sessionStorage.removeItem(`draft_${slug}`);
            form.reset();

            // Scroll to success message
            const successEl = document.getElementById('application-success');
            const headerOffset = 80;
            window.scrollTo({
                top: successEl.getBoundingClientRect().top + window.pageYOffset - headerOffset,
                behavior: 'smooth'
            });

        } else {
            let errorMsg = '';
            for (const [key, value] of Object.entries(data)) {
                errorMsg += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
                const field = form.querySelector(`[name="${key}"]`);
                if(field) showFieldError(field, Array.isArray(value) ? value[0] : value);
            }
            errorDiv.innerText = "Please correct the highlighted fields before submitting your application.";
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Scroll to error
            errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch (e) {
        errorDiv.textContent = 'A network error occurred. Please try again.';
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

function showFieldError(element, message) {
    if(!element) return;
    const isFile = element.type === 'file';
    const target = isFile ? document.getElementById('file-upload-area') : element;
    
    target.classList.remove('is-valid');
    target.classList.add('is-invalid');
    
    const parent = isFile ? target.parentNode : target.closest('.form-group') || target.parentElement;
    let err = parent.querySelector('.error-text');
    if(!err) {
        err = document.createElement('div');
        err.className = 'error-text';
        parent.appendChild(err);
    }
    err.innerText = message;
}

function markValid(element) {
    if(!element) return;
    element.classList.remove('is-invalid');
    element.classList.add('is-valid');
    const parent = element.closest('.form-group') || element.parentElement;
    const err = parent.querySelector('.error-text');
    if(err) err.remove();
}

function clearAllErrors(form) {
    document.getElementById('form-error').textContent = '';
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    form.querySelectorAll('.error-text').forEach(el => el.remove());
}

function setupCityDropdown() {
    const citySelect = document.querySelector('select[name="current_city"]');
    const otherGroup = document.getElementById('other-city-group');
    const otherInput = document.getElementById('current_city_other');
    
    if(!citySelect) return;
    
    citySelect.addEventListener('change', (e) => {
        if(e.target.value === 'Other') {
            otherGroup.style.display = 'flex';
            otherInput.setAttribute('required', 'true');
        } else {
            otherGroup.style.display = 'none';
            otherInput.removeAttribute('required');
            otherInput.value = '';
        }
    });
}
