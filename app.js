/**
 * ZenResume - Application Controller Script
 * Manages user interactions, dynamic form rendering, template alignment,
 * and high-fidelity ATS print triggers.
 */

// Application State
const state = {
  selectedExp: 'fresher',        // 'fresher' | 'experienced'
  selectedInd: 'software',       // 'software' | 'electrical' | 'mechanical' | 'civil'
  selectedTemplateId: 'software_fresher_minimalist',
  currentStep: 1,
  totalSteps: 7,
  hasLoadedProfile: false,
  sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
  isFitToScreen: false,
  zoomScale: null,               // null means auto-scale to width on small screens
  paperSize: 'a4',
  spacing: {
    pageMargin: 24,
    sectionGap: 16,
    lineHeight: 1.35,
    fontScale: 100
  },
  targetJobDescription: localStorage.getItem('zenresume_target_jd') || ''
};

// Check if timezone resolution defaults to US/Canada/etc (North America timezone)
try {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if (tz.startsWith("America/")) {
    state.paperSize = 'letter';
  }
} catch(e) {}

// DOM References
const greetingBanner = document.getElementById('greeting-banner');
const selectionScreen = document.getElementById('selection-screen');
const builderWorkspace = document.getElementById('builder-workspace');
const templatesGrid = document.getElementById('templates-grid');

// GA4 Conversion Tracking Helper
function trackGAEvent(eventName, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      console.log(`[GA4 Event] ${eventName}:`, params);
    } else if (typeof window.trackGAEvent === 'function') {
      window.trackGAEvent(eventName, params);
    } else if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...params });
      console.log(`[DataLayer Event] ${eventName}:`, params);
    }
  } catch (err) {
    console.warn(`[GA4 Event Error] ${eventName}:`, err);
  }
}

// Dynamic AdSense Initializer Helper to prevent 0-width layout errors
function triggerAdPush(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (container.getAttribute('data-ad-initialized') === 'true') return;
  container.setAttribute('data-ad-initialized', 'true');
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    console.log(`[AdSense] Dynamic initialization successful for: #${containerId}`);
  } catch (e) {
    console.warn(`[AdSense] Dynamic push warning for #${containerId}:`, e);
  }
}

const expFilters = document.getElementById('exp-filters');
const industryFilters = document.getElementById('industry-filters');

const wizardProgressDots = document.getElementById('wizard-progress-dots');
const btnBackToTemplates = document.getElementById('btn-back-to-templates');
const btnWizardPrev = document.getElementById('btn-wizard-prev');
const btnWizardNext = document.getElementById('btn-wizard-next');

const experienceListContainer = document.getElementById('experience-list-container');
const projectsListContainer = document.getElementById('projects-list-container');
const educationListContainer = document.getElementById('education-list-container');
const certificationsListContainer = document.getElementById('certifications-list-container');

const btnAddExperience = document.getElementById('btn-add-experience');
const btnAddProject = document.getElementById('btn-add-project');
const btnAddEducation = document.getElementById('btn-add-education');
const btnAddCertification = document.getElementById('btn-add-certification');

const printModal = document.getElementById('print-modal');
const btnTriggerDownload = document.getElementById('btn-trigger-download');
const btnModalClose = document.getElementById('btn-modal-close');
const btnModalConfirm = document.getElementById('btn-skip-ai');

const resumeForm = document.getElementById('resume-form');

/* ==========================================================================
   1. GREETING MANAGER (Removed, handled by firebase-service.js)
   ========================================================================== */
/* ==========================================================================
   2. FILTER & CATALOG RENDERER WITH LIVE SEARCH & QUICK CHIPS
   ========================================================================== */
let templateSearchQuery = '';

function initFilters() {
  // Experience Filter Click Handlers
  if (expFilters) {
    expFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-filter')) {
        expFilters.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');
        state.selectedExp = e.target.dataset.exp;
        state.hasLoadedProfile = false; // Reset to reload corresponding mock profile
        renderTemplatesCatalog();
      }
    });
  }

  // Industry Filter Click Handlers
  if (industryFilters) {
    industryFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-filter')) {
        industryFilters.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');
        state.selectedInd = e.target.dataset.ind;
        state.hasLoadedProfile = false; // Reset to reload corresponding mock profile
        renderTemplatesCatalog();
      }
    });
  }

  // Live Template Search Input Handler
  const inputSearch = document.getElementById('input-template-search');
  const btnClearSearch = document.getElementById('btn-clear-template-search');

  if (inputSearch) {
    inputSearch.addEventListener('input', (e) => {
      templateSearchQuery = e.target.value.trim().toLowerCase();
      if (btnClearSearch) {
        btnClearSearch.style.display = templateSearchQuery ? 'block' : 'none';
      }
      renderTemplatesCatalog();
    });
  }

  if (btnClearSearch && inputSearch) {
    btnClearSearch.addEventListener('click', () => {
      inputSearch.value = '';
      templateSearchQuery = '';
      btnClearSearch.style.display = 'none';
      renderTemplatesCatalog();
    });
  }

  // Quick Role Chips Handler
  document.querySelectorAll('.btn-role-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (inputSearch) {
        inputSearch.value = chip.textContent.replace(/[^\w\s&]/gi, '').trim();
        templateSearchQuery = q.toLowerCase();
        if (btnClearSearch) btnClearSearch.style.display = 'block';
      }
      // If matching specific industry/experience
      if (q === 'software') {
        state.selectedInd = 'software';
      } else if (q === 'data') {
        state.selectedInd = 'data_science';
      } else if (q === 'fresher') {
        state.selectedExp = 'fresher';
      }
      renderTemplatesCatalog();
    });
  });
}

function renderTemplatesCatalog() {
  if (!templatesGrid) return;
  templatesGrid.innerHTML = '';
  
  let matchesCount = 0;

  Object.keys(TEMPLATE_STYLES).forEach(key => {
    const template = TEMPLATE_STYLES[key];
    
    // If search query is present, search across name, desc, industry, and tags
    if (templateSearchQuery) {
      const haystack = `${template.name} ${template.description} ${template.industry} ${template.experience}`.toLowerCase();
      if (!haystack.includes(templateSearchQuery)) {
        return;
      }
    } else {
      // Standard filter match
      if (template.industry !== state.selectedInd || template.experience !== state.selectedExp) {
        return; // Skip templates that don't match the active filters
      }
    }

    matchesCount++;
    const card = document.createElement('div');
    card.className = 'template-card';
    card.dataset.id = template.id;
    
    // Create card element structure
    card.innerHTML = `
      <div>
        <h3 class="template-card-title">${template.name}</h3>
        <p class="template-card-desc">${template.description}</p>
      </div>
      <div class="template-card-footer">
        <span class="template-badge">${template.experience || state.selectedExp} / ${template.industry || state.selectedInd}</span>
        <button class="btn-select">Select Style</button>
      </div>
    `;
    
    card.addEventListener('click', () => {
      selectTemplateStyle(template.id);
    });
    
    templatesGrid.appendChild(card);
  });

  if (matchesCount === 0) {
    templatesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 30px; background: rgba(0,0,0,0.02); border-radius: 12px; border: 1px dashed rgba(0,104,95,0.2);">
        <p style="color: var(--text-sub, #475569); font-weight: 600; margin-bottom: 8px;">No templates directly matched "${templateSearchQuery}".</p>
        <button type="button" class="btn-primary" onclick="document.getElementById('input-template-search').value=''; templateSearchQuery=''; renderTemplatesCatalog();" style="font-size: 12px; padding: 6px 14px;">Show All Templates</button>
      </div>
    `;
  }
}

/* ==========================================================================
   3. TEMPLATE INITIALIZATION & DATA LOADING
   ========================================================================== */
function selectTemplateStyle(templateId) {
  document.body.classList.add('in-editor');
  const globalNav = document.querySelector('.stitch-nav');
  if (globalNav) globalNav.style.display = 'none';
  state.selectedTemplateId = templateId;
  
  // Track GA4 Funnel Event: template_selected
  trackGAEvent('template_selected', {
    template_id: templateId,
    industry: state.selectedInd,
    experience_level: state.selectedExp
  });
  
  // Find matching pre-populated mock profile ONLY if not already loaded or customized
  if (!state.hasLoadedProfile) {
    const profileKey = `${state.selectedInd}_${state.selectedExp}`;
    const profileData = RESUME_PROFILES[profileKey];
    
    if (profileData) {
      // If there's already some custom text in the name or other inputs, ask before overwriting
      const currentName = document.getElementById('input-name').value.trim();
      const isDefaultName = currentName === "" || Object.values(RESUME_PROFILES).some(p => p.personal.name === currentName);
      
      if (currentName && !isDefaultName) {
        const friendlyInd = state.selectedInd.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
        const friendlyExp = state.selectedExp.charAt(0).toUpperCase() + state.selectedExp.slice(1);
        const confirmOverwrite = confirm(`You have customized details in your resume.\n\nWould you like to overwrite them with the default pre-populated content for "${friendlyInd} - ${friendlyExp}"?\n\nClick OK to load defaults, or Cancel to keep your custom text.`);
        if (confirmOverwrite) {
          loadProfileIntoForm(profileData);
          state.hasLoadedProfile = true;
        } else {
          // Keep their custom data but mark loaded so we don't prompt again unless they change filters again
          state.hasLoadedProfile = true;
        }
      } else {
        // Safe to overwrite (empty or default name)
        loadProfileIntoForm(profileData);
        state.hasLoadedProfile = true;
      }
    }
  }

  // Synchronize inline layout switcher select dropdown dynamically
  updateInlineLayoutSwitcher();
  
  // Transition Screens
  selectionScreen.style.display = 'none';
  const welcomeHeader = document.getElementById('app-header-welcome');
  if (welcomeHeader) welcomeHeader.style.display = 'none';
  builderWorkspace.style.display = 'grid';
  triggerAdPush('promo-banner-sidebar');
  
  // Show mobile tabs on small screens and default to 'edit' tab on entry
  const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
  if (mobileWorkspaceTabs) {
    mobileWorkspaceTabs.style.display = '';
  }
  setMobileTab('edit');
  
  // Set current wizard step
  state.currentStep = 1;
  showStep(state.currentStep);
  updateProgressDots();
  adjustPreviewScale(); // Scale the print preview container once workspace is visible
  setTimeout(pushAllVisibleAds, 250);
  updateHeaderNavCTA();
  
  // Sync the form values immediately to screen preview
  syncFormToPreview();
  checkVaultOnboardingBanner();
  if (typeof window.checkAutoLaunchTour === 'function') {
    window.checkAutoLaunchTour();
  }
}

function loadProfileIntoForm(data) {
  // A. Contact details
  document.getElementById('input-name').value = data.personal.name || '';
  document.getElementById('input-title').value = data.personal.title || '';
  document.getElementById('input-email').value = data.personal.email || '';
  document.getElementById('input-phone').value = data.personal.phone || '';
  document.getElementById('input-location').value = data.personal.location || '';
  document.getElementById('input-website').value = data.personal.website || '';
  document.getElementById('input-linkedin').value = data.personal.linkedin || '';
  document.getElementById('input-github').value = (data.personal && data.personal.github) || '';
  document.getElementById('input-custom-social').value = (data.personal && data.personal.customSocial) || '';
  
  // B. Summary
  document.getElementById('input-summary').value = data.summary || '';
  
  // C. Skills (join with commas)
  document.getElementById('input-skills').value = (data.skills || []).join(', ');
  
  // D. Reset dynamic list containers
  experienceListContainer.innerHTML = '';
  projectsListContainer.innerHTML = '';
  educationListContainer.innerHTML = '';
  certificationsListContainer.innerHTML = '';
  
  // E. Load Work Experience
  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(exp => addExperienceCard(exp));
  } else {
    addExperienceCard();
  }
  
  // F. Load Projects
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(proj => addProjectCard(proj));
  } else {
    addProjectCard();
  }
  
  // G. Load Education
  if (data.education && data.education.length > 0) {
    data.education.forEach(edu => addEducationCard(edu));
  } else {
    addEducationCard();
  }
  
  // H. Load Certifications
  if (data.certifications && data.certifications.length > 0) {
    data.certifications.forEach(cert => addCertificationCard(cert));
  } else {
    addCertificationCard();
  }
}

/* ==========================================================================
   4. DYNAMIC CARD ADDITIONS (FORM FIELDS)
   ========================================================================== */

// --- A. EXPERIENCE CARD ---
function addExperienceCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card experience-item-card';
  
  const company = data ? data.company : '';
  const role = data ? data.role : '';
  const location = data ? data.location : '';
  const dates = data ? data.dates : '';
  const desc = data ? (data.descriptions || []).join('\n') : '';
  
  card.innerHTML = `
    <button type="button" class="btn-remove-item">Remove</button>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Job Title / Role</label>
        <input type="text" class="form-input input-exp-role" placeholder="e.g. Lead Engineer">
      </div>
      <div class="form-group">
        <label class="form-label">Company Name</label>
        <input type="text" class="form-input input-exp-company" placeholder="e.g. Systems Ltd.">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Dates / Duration</label>
        <input type="text" class="form-input input-exp-dates" placeholder="e.g. Jun 2024 - Present">
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-input input-exp-location" placeholder="e.g. Pune, India">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Key Achievements (One bullet per line)</label>
      <textarea class="form-input input-exp-desc" style="min-height: 90px;" placeholder="Optimized system bandwidth...&#10;Supervised team of junior..."></textarea>
    </div>
  `;
  
  // Set values programmatically to avoid quote breaks & HTML injection
  card.querySelector('.input-exp-role').value = role;
  card.querySelector('.input-exp-company').value = company;
  card.querySelector('.input-exp-dates').value = dates;
  card.querySelector('.input-exp-location').value = location;
  card.querySelector('.input-exp-desc').value = desc;
  
  // Attach change listeners to live preview
  card.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', debouncedSyncFormToPreview);
  });
  
  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    syncFormToPreview();
  });
  
  experienceListContainer.appendChild(card);
}

// --- B. PROJECT CARD ---
function addProjectCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card project-item-card';
  
  const title = data ? data.title : '';
  const technologies = data ? data.technologies : '';
  const description = data ? data.description : '';
  const link = data ? data.link : '';
  
  card.innerHTML = `
    <button type="button" class="btn-remove-item">Remove</button>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Project Title</label>
        <input type="text" class="form-input input-proj-title" placeholder="e.g. Smart Grid System">
      </div>
      <div class="form-group">
        <label class="form-label">Technologies / Tools Used</label>
        <input type="text" class="form-input input-proj-tech" placeholder="e.g. MATLAB, SolidWorks">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Project Details / Link</label>
      <div class="form-row">
        <input type="text" class="form-input input-proj-link" placeholder="e.g. github.com/username/project">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Short Description</label>
      <textarea class="form-input input-proj-desc" style="min-height: 70px;" placeholder="Describe what you built and the core objectives reached..."></textarea>
    </div>
  `;
  
  // Set values programmatically to avoid quote breaks & HTML injection
  card.querySelector('.input-proj-title').value = title;
  card.querySelector('.input-proj-tech').value = technologies;
  card.querySelector('.input-proj-link').value = link;
  card.querySelector('.input-proj-desc').value = description;
  
  card.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', debouncedSyncFormToPreview);
  });
  
  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    syncFormToPreview();
  });
  
  projectsListContainer.appendChild(card);
}

// --- C. EDUCATION CARD ---
function addEducationCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card education-item-card';
  
  const degree = data ? data.degree : '';
  const institution = data ? data.institution : '';
  const location = data ? data.location : '';
  const dates = data ? data.dates : '';
  const gpa = data ? data.gpa : '';
  
  card.innerHTML = `
    <button type="button" class="btn-remove-item">Remove</button>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Degree & Specialization</label>
        <input type="text" class="form-input input-edu-degree" placeholder="e.g. B.Tech in CSE">
      </div>
      <div class="form-group">
        <label class="form-label">University / Institution</label>
        <input type="text" class="form-input input-edu-institution" placeholder="e.g. VIT University">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Completion Year / Dates</label>
        <input type="text" class="form-input input-edu-dates" placeholder="e.g. 2022 - 2026">
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-input input-edu-location" placeholder="e.g. Vellore, India">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Grade / CGPA</label>
      <input type="text" class="form-input input-edu-gpa" placeholder="e.g. 9.1/10.0 CGPA">
    </div>
  `;
  
  // Set values programmatically to avoid quote breaks & HTML injection
  card.querySelector('.input-edu-degree').value = degree;
  card.querySelector('.input-edu-institution').value = institution;
  card.querySelector('.input-edu-dates').value = dates;
  card.querySelector('.input-edu-location').value = location;
  card.querySelector('.input-edu-gpa').value = gpa;
  
  card.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', debouncedSyncFormToPreview);
  });
  
  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    syncFormToPreview();
  });
  
  educationListContainer.appendChild(card);
}

// --- D. CERTIFICATION CARD ---
function addCertificationCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card certification-item-card';
  
  const name = (typeof data === 'string') ? data : (data ? data.name : '');
  const issuer = (data && typeof data === 'object') ? data.issuer : '';
  const date = (data && typeof data === 'object') ? data.date : '';
  const desc = (data && typeof data === 'object') ? data.desc : '';
  
  card.innerHTML = `
    <button type="button" class="btn-remove-item">Remove</button>
    <div class="form-group-row">
      <div class="form-group" style="flex: 2;">
        <label class="form-label">Certification Name</label>
        <input type="text" class="form-input input-cert-name" placeholder="e.g. AWS Solutions Architect">
      </div>
      <div class="form-group" style="flex: 1;">
        <label class="form-label">Issuer</label>
        <input type="text" class="form-input input-cert-issuer" placeholder="e.g. Amazon Web Services">
      </div>
      <div class="form-group" style="flex: 1;">
        <label class="form-label">Date</label>
        <input type="text" class="form-input input-cert-date" placeholder="e.g. 2025">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description / ID</label>
      <input type="text" class="form-input input-cert-desc" placeholder="e.g. Credential ID: 123456">
    </div>
  `;
  
  card.querySelector('.input-cert-name').value = name || '';
  card.querySelector('.input-cert-issuer').value = issuer || '';
  card.querySelector('.input-cert-date').value = date || '';
  card.querySelector('.input-cert-desc').value = desc || '';
  
  const inputs = card.querySelectorAll('.form-input');
  inputs.forEach(input => input.addEventListener('input', debouncedSyncFormToPreview));
  
  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    syncFormToPreview();
  });
  
  certificationsListContainer.appendChild(card);
}

/* ==========================================================================
   5. REAL-TIME DATA SYNCHRONIZATION
   ========================================================================== */
/* ==========================================================================
   5. EXTRACT & RE-HYDRATE DATA WITH LOCALSTORAGE PERSISTENCE
   ========================================================================== */
function extractCurrentFormData() {
  const currentData = {
    personal: {
      name: document.getElementById('input-name').value,
      title: document.getElementById('input-title').value,
      email: document.getElementById('input-email').value,
      phone: document.getElementById('input-phone').value,
      location: document.getElementById('input-location').value,
      website: document.getElementById('input-website').value,
      linkedin: document.getElementById('input-linkedin').value,
      github: document.getElementById('input-github').value,
      customSocial: document.getElementById('input-custom-social').value
    },
    summary: document.getElementById('input-summary').value,
    
    // Split skills by commas
    skills: document.getElementById('input-skills').value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0),
      
    experience: [],
    projects: [],
    education: [],
    certifications: []
  };
  
  // Extract dynamic Work Experience
  document.querySelectorAll('.experience-item-card').forEach(card => {
    const role = card.querySelector('.input-exp-role').value;
    const company = card.querySelector('.input-exp-company').value;
    const dates = card.querySelector('.input-exp-dates').value;
    const location = card.querySelector('.input-exp-location').value;
    
    const descText = card.querySelector('.input-exp-desc').value;
    const descriptions = descText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    if (role || company || dates || location || descText) {
      currentData.experience.push({ role, company, dates, location, descriptions });
    }
  });

  // Extract dynamic Projects
  document.querySelectorAll('.project-item-card').forEach(card => {
    const title = card.querySelector('.input-proj-title').value;
    const technologies = card.querySelector('.input-proj-tech').value;
    const link = card.querySelector('.input-proj-link').value;
    const description = card.querySelector('.input-proj-desc').value;
    
    if (title || technologies || link || description) {
      currentData.projects.push({ title, technologies, link, description });
    }
  });

  // Extract dynamic Education
  document.querySelectorAll('.education-item-card').forEach(card => {
    const degree = card.querySelector('.input-edu-degree').value;
    const institution = card.querySelector('.input-edu-institution').value;
    const dates = card.querySelector('.input-edu-dates').value;
    const location = card.querySelector('.input-edu-location').value;
    const gpa = card.querySelector('.input-edu-gpa').value;
    
    if (degree || institution || dates || location || gpa) {
      currentData.education.push({ degree, institution, dates, location, gpa });
    }
  });

  // Extract dynamic Certifications
  document.querySelectorAll('.certification-item-card').forEach(card => {
    const name = card.querySelector('.input-cert-name').value.trim();
    const issuer = card.querySelector('.input-cert-issuer').value.trim();
    const date = card.querySelector('.input-cert-date').value.trim();
    const desc = card.querySelector('.input-cert-desc').value.trim();
    if (name || issuer || date || desc) {
      currentData.certifications.push({ name, issuer, date, desc });
    }
  });

  return currentData;
}

function autoSaveResume() {
  const currentData = extractCurrentFormData();
  const stateToSave = {
    formData: currentData,
    selectedExp: state.selectedExp,
    selectedInd: state.selectedInd,
    selectedTemplateId: state.selectedTemplateId,
    currentStep: state.currentStep,
    hasLoadedProfile: state.hasLoadedProfile,
    sectionOrder: state.sectionOrder,
    spacing: state.spacing
  };
  
  const registry = getStoredProfilesRegistry();
  if (registry.activeId === 'default') {
    localStorage.setItem('zenresume_state', JSON.stringify(stateToSave));
  } else {
    localStorage.setItem(`zenresume_profile_${registry.activeId}`, JSON.stringify(stateToSave));
  }

  // High-resilience IndexedDB persistence (immune to 5MB quota & Safari 7-day purge)
  if (window.ZenResumeDB && typeof window.ZenResumeDB.saveDraft === 'function') {
    window.ZenResumeDB.saveDraft(stateToSave, registry.activeId || 'default');
  }

  // Also save to cloud if logged in
  if (typeof saveResumeToFirestore === 'function') {
    saveResumeToFirestore(stateToSave);
  }
}

/* ==========================================================================
   5C. MULTI-APPLICATION PROFILES & RETENTION ENGINE
   ========================================================================== */
const PROFILES_STORAGE_KEY = 'zenresume_application_profiles';

function getStoredProfilesRegistry() {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return {
    activeId: 'default',
    profiles: [
      { id: 'default', name: 'Master Resume', updatedAt: new Date().toISOString() }
    ]
  };
}

function saveProfilesRegistry(registry) {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(registry));
  } catch (e) {}
}

function initProfileVersions() {
  const select = document.getElementById('select-profile-version');
  const btnNew = document.getElementById('btn-new-version');
  if (!select) return;

  const registry = getStoredProfilesRegistry();
  renderProfileDropdown(registry);

  select.addEventListener('change', (e) => {
    switchProfileVersion(e.target.value);
  });

  if (btnNew) {
    btnNew.addEventListener('click', () => {
      promptCreateNewProfileVersion();
    });
  }
}

function renderProfileDropdown(registry) {
  const select = document.getElementById('select-profile-version');
  if (!select) return;
  select.innerHTML = '';
  registry.profiles.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    if (p.id === registry.activeId) opt.selected = true;
    select.appendChild(opt);
  });
}

function promptCreateNewProfileVersion() {
  const defaultName = `Application - ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  const versionName = prompt("Enter a name for this Job Application Profile (e.g., 'Google FullStack', 'Amazon Backend', 'Startup Lead'):", defaultName);
  if (!versionName || !versionName.trim()) return;

  const cleanName = versionName.trim();
  const registry = getStoredProfilesRegistry();
  const newId = `profile_${Date.now()}`;

  // Capture current state
  const currentData = extractCurrentFormData();
  const currentState = {
    formData: currentData,
    selectedExp: state.selectedExp,
    selectedInd: state.selectedInd,
    selectedTemplateId: state.selectedTemplateId,
    currentStep: state.currentStep,
    hasLoadedProfile: state.hasLoadedProfile,
    sectionOrder: state.sectionOrder
  };

  // Save current active profile's data first
  if (registry.activeId === 'default') {
    localStorage.setItem('zenresume_state', JSON.stringify(currentState));
  } else {
    localStorage.setItem(`zenresume_profile_${registry.activeId}`, JSON.stringify(currentState));
  }

  // Save new profile data
  localStorage.setItem(`zenresume_profile_${newId}`, JSON.stringify(currentState));

  // Update registry
  registry.profiles.push({
    id: newId,
    name: cleanName,
    updatedAt: new Date().toISOString()
  });
  registry.activeId = newId;
  saveProfilesRegistry(registry);

  renderProfileDropdown(registry);
  
  // Track GA4 conversion event: resume_version_created
  trackGAEvent('resume_version_created', {
    version_name: cleanName,
    total_versions: registry.profiles.length
  });

  alert(`🎉 Created job profile: "${cleanName}"!\n\nYou can now tailor your skills and summary specifically for this job description without losing your master resume.`);
}

function switchProfileVersion(targetId) {
  const registry = getStoredProfilesRegistry();
  if (targetId === registry.activeId) return;

  // Auto-save current profile first
  const currentData = extractCurrentFormData();
  const currentState = {
    formData: currentData,
    selectedExp: state.selectedExp,
    selectedInd: state.selectedInd,
    selectedTemplateId: state.selectedTemplateId,
    currentStep: state.currentStep,
    hasLoadedProfile: state.hasLoadedProfile,
    sectionOrder: state.sectionOrder
  };
  if (registry.activeId === 'default') {
    localStorage.setItem('zenresume_state', JSON.stringify(currentState));
  } else {
    localStorage.setItem(`zenresume_profile_${registry.activeId}`, JSON.stringify(currentState));
  }

  // Set active ID in registry
  registry.activeId = targetId;
  saveProfilesRegistry(registry);

  // Load target profile
  let targetStateJson;
  if (targetId === 'default') {
    targetStateJson = localStorage.getItem('zenresume_state');
  } else {
    targetStateJson = localStorage.getItem(`zenresume_profile_${targetId}`);
  }

  if (targetStateJson) {
    try {
      const parsed = JSON.parse(targetStateJson);
      hydrateStateFromData(parsed, false);
      syncFormToPreview();
      const targetProfile = registry.profiles.find(p => p.id === targetId);
      const profileName = targetProfile ? targetProfile.name : targetId;
      console.log(`[Profile Switch] Loaded version: ${profileName}`);
      trackGAEvent('resume_version_switched', {
        version_id: targetId,
        version_name: profileName
      });
    } catch (e) {
      console.error("Error switching profile:", e);
    }
  }
}

/* ==========================================================================
   5D. "MASTER RESUME VAULT" RETURNING USER WELCOME ENGINE
   ========================================================================== */
function checkReturningUserVault() {
  try {
    const lastVisit = localStorage.getItem('zenresume_last_visit');
    const now = Date.now();
    localStorage.setItem('zenresume_last_visit', String(now));

    const savedStateJson = localStorage.getItem('zenresume_state');
    if (!savedStateJson) return;

    // Trigger if last visit was more than 30 minutes ago
    if (lastVisit && (now - parseInt(lastVisit, 10)) > 30 * 60 * 1000) {
      setTimeout(showWelcomeVaultToast, 1200);
    }
  } catch (e) {}
}

function showWelcomeVaultToast() {
  if (document.querySelector('.vault-welcome-toast')) return;
  const toast = document.createElement('div');
  toast.className = 'vault-welcome-toast';
  toast.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <span style="font-size: 24px; line-height: 1;">🌟</span>
      <div style="flex: 1;">
        <strong style="display: block; color: #0f172a; font-size: 13.5px; font-weight: 700; margin-bottom: 3px; font-family: 'Outfit', sans-serif;">Welcome back! Your Master Resume is ready.</strong>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569; line-height: 1.45;">Tailoring your resume for a new job application today?</p>
        <div style="display: flex; gap: 8px;">
          <button id="btn-toast-tailor" class="btn-primary" style="padding: 5px 12px; font-size: 11.5px; font-weight: 700; border-radius: 6px; cursor: pointer;">
            + Tailor for New Job
          </button>
          <button id="btn-toast-dismiss" style="background: transparent; color: #64748B; border: 1px solid #CBD5E1; padding: 5px 10px; border-radius: 6px; font-size: 11.5px; cursor: pointer;">
            Continue
          </button>
        </div>
      </div>
      <button id="btn-toast-close" style="background: none; border: none; color: #94A3B8; font-size: 18px; cursor: pointer; line-height: 1; padding: 0 4px;">&times;</button>
    </div>
  `;
  document.body.appendChild(toast);

  const btnTailor = toast.querySelector('#btn-toast-tailor');
  if (btnTailor) {
    btnTailor.addEventListener('click', () => {
      toast.remove();
      if (typeof enterApp === 'function') enterApp();
      promptCreateNewProfileVersion();
    });
  }

  const btnDismiss = toast.querySelector('#btn-toast-dismiss');
  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      toast.remove();
    });
  }

  const btnClose = toast.querySelector('#btn-toast-close');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      toast.remove();
    });
  }

  // Auto dismiss after 12s
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 12000);
}

/* ==========================================================================
   5E. ONE-TIME MASTER RESUME SPOTLIGHT BANNER MANAGER
   ========================================================================== */
function checkVaultOnboardingBanner() {
  try {
    const hasSeen = localStorage.getItem('zenresume_seen_vault_intro');
    const banner = document.getElementById('vault-onboarding-banner');
    if (!banner) return;
    if (!hasSeen) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
    
    const btnDismiss = document.getElementById('btn-dismiss-vault-banner');
    if (btnDismiss) {
      btnDismiss.onclick = () => {
        localStorage.setItem('zenresume_seen_vault_intro', 'true');
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-10px)';
        setTimeout(() => { banner.style.display = 'none'; }, 300);
      };
    }
  } catch(e) {}
}

function loadSavedResume(preventDisplayTransition = false) {
  const registry = getStoredProfilesRegistry();
  let savedStateJson;
  if (registry.activeId === 'default') {
    savedStateJson = localStorage.getItem('zenresume_state');
  } else {
    savedStateJson = localStorage.getItem(`zenresume_profile_${registry.activeId}`) || localStorage.getItem('zenresume_state');
  }

  if (!savedStateJson) return false;
  
  try {
    const savedState = JSON.parse(savedStateJson);
    return hydrateStateFromData(savedState, preventDisplayTransition);
  } catch (err) {
    console.error('Error loading saved state:', err);
    return false;
  }
}

function hydrateStateFromData(savedState, preventDisplayTransition = false) {
  try {
    if (!savedState || !savedState.formData) return false;
    
    // Restore state variables
    state.selectedExp = savedState.selectedExp || 'fresher';
    state.selectedInd = savedState.selectedInd || 'software';
    
    // Validate template ID and fallback if invalid
    const matchingKeys = Object.keys(TEMPLATE_STYLES).filter(key => {
      const t = TEMPLATE_STYLES[key];
      return t.industry === state.selectedInd && t.experience === state.selectedExp;
    });
    if (matchingKeys.includes(savedState.selectedTemplateId)) {
      state.selectedTemplateId = savedState.selectedTemplateId;
    } else {
      state.selectedTemplateId = matchingKeys[0] || 'software_fresher_minimalist';
    }
    
    state.currentStep = savedState.currentStep || 1;
    state.hasLoadedProfile = savedState.hasLoadedProfile !== undefined ? savedState.hasLoadedProfile : true;
    state.sectionOrder = savedState.sectionOrder || ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'];
    
    // Restore and apply custom spacing if saved
    if (savedState.spacing) {
      state.spacing = savedState.spacing;
      const paper = document.getElementById('resume-print-area');
      if (paper) {
        paper.style.setProperty('--resume-page-padding', `${state.spacing.pageMargin || 24}px`);
        paper.style.setProperty('--resume-section-gap', `${state.spacing.sectionGap || 16}px`);
        paper.style.setProperty('--resume-line-height', state.spacing.lineHeight || 1.35);
        paper.style.setProperty('--resume-font-scale', (state.spacing.fontScale || 100) / 100);
      }
      const sliderMargin = document.getElementById('slider-page-margin');
      const sliderGap = document.getElementById('slider-section-gap');
      const sliderLineHeight = document.getElementById('slider-line-height');
      const sliderFontScale = document.getElementById('slider-font-scale');
      if (sliderMargin && state.spacing.pageMargin) sliderMargin.value = state.spacing.pageMargin;
      if (sliderGap && state.spacing.sectionGap) sliderGap.value = state.spacing.sectionGap;
      if (sliderLineHeight && state.spacing.lineHeight) sliderLineHeight.value = state.spacing.lineHeight;
      if (sliderFontScale && state.spacing.fontScale) sliderFontScale.value = state.spacing.fontScale;
    }

    // Sync Reorder List visually with the loaded order
    const list = document.getElementById('reorder-list');
    if (list) {
      state.sectionOrder.forEach(id => {
        const li = list.querySelector(`[data-id="${id}"]`);
        if (li) list.appendChild(li); // move to bottom, reordering the list
      });
    }
    
    // Set UI filters active state
    if (expFilters.querySelector('.active')) expFilters.querySelector('.active').classList.remove('active');
    const expBtn = expFilters.querySelector(`[data-exp="${state.selectedExp}"]`);
    if (expBtn) expBtn.classList.add('active');
    
    if (industryFilters.querySelector('.active')) industryFilters.querySelector('.active').classList.remove('active');
    const indBtn = industryFilters.querySelector(`[data-ind="${state.selectedInd}"]`);
    if (indBtn) indBtn.classList.add('active');
    
    // Sync inline quick layout selector dynamically
    updateInlineLayoutSwitcher();
    
    // Load profile data directly into the DOM fields
    loadProfileIntoForm(savedState.formData);
    
    // Transition Screen UI directly to workspace if not prevented (e.g. startup)
    if (!preventDisplayTransition) {
      selectionScreen.style.display = 'none';
      builderWorkspace.style.display = 'grid';
      triggerAdPush('promo-banner-sidebar');
      
      // Show mobile tabs on small screens and default to 'edit' tab
      const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
      if (mobileWorkspaceTabs) {
        mobileWorkspaceTabs.style.display = '';
      }
      if (typeof setMobileTab === 'function') setMobileTab('edit');
    } else {
      // Ensure landing screen is shown, and other screens are hidden
      const landingScreen = document.getElementById('landing-screen');
      if (landingScreen) landingScreen.style.display = 'block';
      
      selectionScreen.style.display = 'none';
      builderWorkspace.style.display = 'none';
      const welcomeHeader = document.getElementById('app-header-welcome');
      if (welcomeHeader) welcomeHeader.style.display = 'none';
      const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
      if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = 'none';
    }
    
    showStep(state.currentStep);
    updateProgressDots();
    adjustPreviewScale(); // Scale the print preview container once workspace is visible
    setTimeout(pushAllVisibleAds, 250);
    updateHeaderNavCTA();
    
    // Render and Sync live preview
    const template = TEMPLATE_STYLES[state.selectedTemplateId];
    if (template) {
      const renderedHTML = template.render(savedState.formData);
      const paper = document.getElementById('resume-print-area');
      paper.innerHTML = renderedHTML;
      if (state.selectedTemplateId === 'sidebar') {
        paper.classList.add('sidebar-layout');
      } else {
        paper.classList.remove('sidebar-layout');
      }
      
      // Compress and scale dynamically on load
      if (typeof autoFitToSinglePage === 'function') autoFitToSinglePage();
      if (typeof adjustPreviewScale === 'function') adjustPreviewScale();
    }
    
    return true;
  } catch (err) {
    console.error('Error hydrating state:', err);
    return false;
  }
}

/* ==========================================================================
   5B. JSON DATA BACKUP & RESTORE
   ========================================================================== */
function exportResumeJSON() {
  const currentData = extractCurrentFormData();
  const fileData = {
    meta: {
      application: "ZenResume",
      exportedAt: new Date().toISOString(),
      templateId: state.selectedTemplateId,
      industry: state.selectedInd,
      experienceLevel: state.selectedExp
    },
    resumeData: currentData
  };
  
  const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  const fileName = (currentData.personal.name || 'resume').toLowerCase().replace(/[^a-z0-9]/g, '_');
  a.href = url;
  a.download = `zenresume_backup_${fileName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Track GA4 Event: json_backup_exported
  trackGAEvent('json_backup_exported', {
    template_id: state.selectedTemplateId,
    industry: state.selectedInd,
    experience_level: state.selectedExp
  });
}

function importResumeJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      
      if (!imported || (!imported.resumeData && !imported.personal)) {
        alert("Invalid JSON format. Please upload a valid ZenResume backup file.");
        return;
      }
      
      const resumeData = imported.resumeData || imported;
      
      // Load imported JSON fields into DOM
      loadProfileIntoForm(resumeData);
      
      // Update application configurations from metadata if available
      // Update application configurations from metadata if available
      if (imported.meta) {
        if (imported.meta.industry) {
          state.selectedInd = imported.meta.industry;
          industryFilters.querySelector('.active').classList.remove('active');
          const indBtn = industryFilters.querySelector(`[data-ind="${state.selectedInd}"]`);
          if (indBtn) indBtn.classList.add('active');
        }
        if (imported.meta.experienceLevel) {
          state.selectedExp = imported.meta.experienceLevel;
          expFilters.querySelector('.active').classList.remove('active');
          const expBtn = expFilters.querySelector(`[data-exp="${state.selectedExp}"]`);
          if (expBtn) expBtn.classList.add('active');
        }
        
        // Resolve and validate template ID
        if (imported.meta.templateId) {
          const matchingKeys = Object.keys(TEMPLATE_STYLES).filter(key => {
            const t = TEMPLATE_STYLES[key];
            return t.industry === state.selectedInd && t.experience === state.selectedExp;
          });
          if (matchingKeys.includes(imported.meta.templateId)) {
            state.selectedTemplateId = imported.meta.templateId;
          } else {
            state.selectedTemplateId = matchingKeys[0] || 'software_fresher_minimalist';
          }
        }
      }
      
      // Update the switcher select element dynamically
      updateInlineLayoutSwitcher();
      
      state.hasLoadedProfile = true;
      
      // Reset active mobile tab
      setMobileTab('edit');
      
      // Reset Wizard view to Step 1
      state.currentStep = 1;
      showStep(1);
      updateProgressDots();
      
      // Sync form content to preview
      syncFormToPreview();
      
      alert("Resume data successfully restored!");
      
      // Clear file selector input so same file can be imported again
      e.target.value = '';
    } catch (err) {
      console.error(err);
      alert("Error parsing JSON file. Please verify it is a valid ZenResume export.");
    }
  };
  reader.readAsText(file);
}

let syncTimeout = null;
function debouncedSyncFormToPreview() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncFormToPreview, 250);
}

function syncFormToPreview() {
  // Always trigger LocalStorage Auto-Save synchronously to avoid losing inputs
  autoSaveResume();

  const isMobile = window.innerWidth <= 800;
  const isPreviewHidden = isMobile && (!builderWorkspace || !builderWorkspace.classList.contains('show-preview'));
  
  // If preview is hidden, skip expensive DOM compilation and layout iterations
  if (isPreviewHidden) {
    return;
  }

  const currentData = extractCurrentFormData();
  
  // Retrieve selected template rendering layout
  const template = TEMPLATE_STYLES[state.selectedTemplateId];
  if (template) {
    const rawHTML = template.render(currentData);
    const paper = document.getElementById('resume-print-area');
    
    // Create temporary wrapper to parse and reorder dynamic sections
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;
    
    const sectionMap = {};
    const sections = tempDiv.querySelectorAll('[data-section]');
    
    sections.forEach(sec => {
      const sectionName = sec.getAttribute('data-section');
      if (['summary', 'skills', 'experience', 'projects', 'education', 'certifications'].includes(sectionName)) {
        sectionMap[sectionName] = sec;
        sec.parentNode.removeChild(sec);
      }
    });
    
    // Re-append in user-defined order
    if (state.sectionOrder) {
      state.sectionOrder.forEach(secName => {
        if (sectionMap[secName]) {
          tempDiv.appendChild(sectionMap[secName]);
        }
      });
    }

    // Append subtle ATS compliance verification footnote if enabled
    const checkFootnote = document.getElementById('check-ats-footnote');
    const isFootnoteEnabled = checkFootnote ? checkFootnote.checked : true;
    if (isFootnoteEnabled) {
      const footnoteEl = document.createElement('div');
      footnoteEl.className = 'resume-ats-footnote';
      footnoteEl.innerHTML = '✓ Formatted for 100% Single-Column ATS Compliance &bull; ZenResume.online';
      tempDiv.appendChild(footnoteEl);
    }
    
    paper.innerHTML = tempDiv.innerHTML;
    
    // Toggle sidebar layout padding overrides
    if (state.selectedTemplateId === 'sidebar') {
      paper.classList.add('sidebar-layout');
    } else {
      paper.classList.remove('sidebar-layout');
    }
  }

  // Defer expensive height-fitting loops and scaling to yield main thread and minimize INP score
  setTimeout(() => {
    // Run dynamic single-page auto-fit convergence engine
    autoFitToSinglePage();

    // Adjust preview scaling dynamically if on mobile
    adjustPreviewScale();

    // Regenerate summary suggestions reactively if on the Summary step
    if (state.currentStep === 2) {
      generateSummarySuggestions();
    }
  }, 0);
}

// Rebuilds the inline layout switcher dropdown options to list only templates matching current profile category
function updateInlineLayoutSwitcher() {
  const selectLayoutInline = document.getElementById('select-layout-inline');
  if (!selectLayoutInline) return;

  // Clear existing options
  selectLayoutInline.innerHTML = '';

  // Get matching templates
  const matching = Object.values(TEMPLATE_STYLES).filter(t => t.industry === state.selectedInd && t.experience === state.selectedExp);
  
  matching.forEach(template => {
    const opt = document.createElement('option');
    opt.value = template.id;
    opt.textContent = template.name;
    selectLayoutInline.appendChild(opt);
  });

  // Set the current selected value
  selectLayoutInline.value = state.selectedTemplateId;
}

/* ==========================================================================
   6. WIZARD STEPS NAVIGATOR
   ========================================================================== */
function setupWizardDots() {
  wizardProgressDots.innerHTML = '';
  for (let i = 1; i <= state.totalSteps; i++) {
    const dot = document.createElement('span');
    dot.className = `progress-dot ${i === 1 ? 'active' : ''}`;
    dot.dataset.step = i;
    
    // Enable wizard section jumps on click
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => {
      state.currentStep = i;
      showStep(state.currentStep);
      updateProgressDots();
      autoSaveResume();
    });
    
    wizardProgressDots.appendChild(dot);
  }
}

function updateProgressDots() {
  const current = parseInt(state.currentStep, 10) || 1;

  // Sync wizard progress dots
  const dots = wizardProgressDots ? wizardProgressDots.querySelectorAll('.progress-dot') : [];
  dots.forEach((dot, index) => {
    const stepNum = index + 1;
    dot.className = 'progress-dot';
    if (stepNum === current) {
      dot.classList.add('active');
    } else if (stepNum < current) {
      dot.classList.add('completed');
    }
  });
}

// Global Step Switcher for Vertical Nav
window.goToStep = function(stepNum) {
  const step = parseInt(stepNum, 10);
  if (isNaN(step) || step < 1 || step > state.totalSteps) return;
  showStep(step);
  autoSaveResume();
};

function showStep(stepNum) {
  const n = parseInt(stepNum, 10);
  state.currentStep = n;

  // 1. Hide all steps cleanly
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // 2. Show active step
  const activeStep = document.querySelector(`.form-step[data-step="${n}"]`);
  if (activeStep) {
    activeStep.classList.add('active');
  }
  
  // 3. Smooth scroll top on form container
  const formScroll = document.querySelector('.form-scroll-container') || document.querySelector('.form-panel');
  if (formScroll) {
    formScroll.scrollTop = 0;
  }
  
  // 4. Generate dynamic summary suggestions when step 2 is active
  if (n === 2) {
    generateSummarySuggestions();
  }
  
  // 5. Update Navigation Controls Visibility
  if (btnWizardPrev) {
    btnWizardPrev.style.visibility = n === 1 ? 'hidden' : 'visible';
  }
  
  if (btnWizardNext) {
    if (n === state.totalSteps) {
      btnWizardNext.innerHTML = `
        Confirm & Download
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
      `;
    } else {
      btnWizardNext.innerHTML = `
        Next Step
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      `;
    }
  }

  // 6. Update Progress Dots and Vertical Sidebar Navigation Icons
  updateProgressDots();
}

function handleWizardNext() {
  if (state.currentStep < state.totalSteps) {
    showStep(state.currentStep + 1);
    autoSaveResume();
  } else {
    // We are on the final step -> Confirm & Download
    openPrintModal();
  }
}

function handleWizardPrev() {
  if (state.currentStep > 1) {
    showStep(state.currentStep - 1);
    autoSaveResume();
  }
}

window.wizardNext = handleWizardNext;
window.wizardPrev = handleWizardPrev;

/* ==========================================================================
   7. PRINT DIALOG, AI UPGRADE, & PDF EXPORT
   ========================================================================== */
function openPrintModal() {
  // Track GA4 Funnel Event: ats_score_checked
  trackGAEvent('ats_score_checked', {
    template_id: state.selectedTemplateId,
    industry: state.selectedInd,
    experience_level: state.selectedExp
  });

  const step1 = document.getElementById('ai-upgrade-step-1');
  const step2 = document.getElementById('ai-upgrade-step-2');
  const btnStep1 = document.getElementById('ai-buttons-step-1');
  const btnStep2 = document.getElementById('ai-buttons-step-2');
  
  if (step1) step1.style.display = 'block';
  if (btnStep1) btnStep1.style.display = 'flex';
  if (step2) step2.style.display = 'none';
  if (btnStep2) btnStep2.style.display = 'none';
  
  const jdInput = document.getElementById('input-job-description');
  if (jdInput) jdInput.value = '';
  
  printModal.style.display = 'flex';
}

function closePrintModal() {
  printModal.style.display = 'none';
}

window.triggerActualPrint = function() {
  const modal = document.getElementById('print-warning-modal');
  if (modal) modal.style.display = 'none';
  executeSystemPrint();
};

function executeSystemPrint() {
  closePrintModal();
  runPdfGeneration();
}

function loadHtml2Pdf() {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve(window.html2pdf);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.integrity = "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => reject(new Error('Failed to load html2pdf'));
    document.head.appendChild(script);
  });
}

async function runPdfGeneration() {
  window.isGeneratingPdf = true;
  const element = document.getElementById('resume-print-area');

  // CRITICAL FIX: Force-render the resume into the print area before PDF capture.
  // On mobile, syncFormToPreview() skips rendering when the preview tab is hidden.
  // This ensures the print area always has fresh, up-to-date content.
  const currentData = extractCurrentFormData();
  const template = TEMPLATE_STYLES[state.selectedTemplateId];
  if (template) {
    const rawHTML = template.render(currentData);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;

    const sectionMap = {};
    const sections = tempDiv.querySelectorAll('[data-section]');
    sections.forEach(sec => {
      const sectionName = sec.getAttribute('data-section');
      if (['experience', 'projects', 'education', 'certifications'].includes(sectionName)) {
        sectionMap[sectionName] = sec;
        sec.parentNode.removeChild(sec);
      }
    });
    if (state.sectionOrder) {
      state.sectionOrder.forEach(secName => {
        if (sectionMap[secName]) {
          tempDiv.appendChild(sectionMap[secName]);
        }
      });
    }
    element.innerHTML = tempDiv.innerHTML;

    if (state.selectedTemplateId === 'sidebar') {
      element.classList.add('sidebar-layout');
    } else {
      element.classList.remove('sidebar-layout');
    }

    // Run single-page auto-fit before capture
    autoFitToSinglePage();
  }

  // CRITICAL MOBILE FIX: If the preview panel is hidden (display: none !important),
  // html2canvas will render a completely blank image. We must temporarily show it.
  // NOTE: builderWorkspace is declared at the top of the file (line 32), reusing it here.
  const wasPreviewShown = builderWorkspace ? builderWorkspace.classList.contains('show-preview') : false;
  if (!wasPreviewShown && builderWorkspace) {
    builderWorkspace.classList.add('show-preview');
  }

  // ULTIMATE FIX: Create a deep clone to completely avoid mutating the live CSS Grid / Flexbox layout
  const clone = element.cloneNode(true);
  
  // Create an absolute container isolated from all layout constraints
  const isLetter = state.paperSize === 'letter';
  const paperWidth = isLetter ? '816px' : '794px';
  const paperHeight = isLetter ? '278mm' : '295.5mm';

  const printContainer = document.createElement('div');
  printContainer.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: ${paperWidth} !important;
    height: auto !important;
    z-index: -9999 !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  `;

  // Strip scaling from the clone but KEEP original paddings!
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'unset';
  clone.style.position = 'relative';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.margin = '0';
  clone.style.width = paperWidth;
  clone.style.height = paperHeight;
  clone.style.boxShadow = 'none';
  
  printContainer.appendChild(clone);
  document.body.appendChild(printContainer);

  // Disable body-level clipping that would chop the 816px clone on narrow mobile screens
  const originalBodyOverflow = document.body.style.overflow;
  const originalBodyWidth = document.body.style.width;
  const originalHtmlOverflow = document.documentElement.style.overflow;
  document.body.style.overflow = 'visible';
  document.body.style.width = 'auto';
  document.documentElement.style.overflow = 'visible';

  // Get user's name for the filename
  const userName = document.getElementById('input-name').value.trim() || 'Professional';
  const fileName = `ZenResume_${userName.replace(/\s+/g, '_')}.pdf`;

  const pdfScale = 2;

  const opt = {
    margin:       0,
    filename:     fileName,
    image:        { type: 'jpeg', quality: 0.92 },
    html2canvas:  { 
      scale: pdfScale,
      useCORS: true, 
      letterRendering: false, 
      logging: false, 
      x: 0,
      y: 0,
      scrollY: 0,
      scrollX: 0,
      windowWidth: isLetter ? 816 : 794, 
      height: clone.offsetHeight - 1 
    },
    jsPDF:        { unit: 'mm', format: isLetter ? 'letter' : 'a4', orientation: 'portrait' }
  };
  
  const oldText = btnModalConfirm ? btnModalConfirm.innerHTML : '';
  if (btnModalConfirm) btnModalConfirm.innerHTML = 'Loading PDF Engine...<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal; margin-top: 4px; display: inline-block; line-height: 1.4;">This high-resolution PDF takes 5-10 seconds to generate. Please do not close the window.<br><br>Thanks for bearing with our ads, they help keep this tool free!</span>';

  try {
    await loadHtml2Pdf();
  } catch (err) {
    alert("Failed to load the PDF engine. Please check your internet connection.");
    if (btnModalConfirm) btnModalConfirm.innerHTML = oldText;
    window.isGeneratingPdf = false;
    
    // Fail-safe restore
    printContainer.remove();
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.width = originalBodyWidth;
    document.documentElement.style.overflow = originalHtmlOverflow;
    if (!wasPreviewShown && builderWorkspace) {
      builderWorkspace.classList.remove('show-preview');
    }
    return;
  }
  
  if (btnModalConfirm) btnModalConfirm.innerHTML = 'Generating your free PDF...<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal; margin-top: 4px; display: inline-block; line-height: 1.4;">This high-resolution PDF takes 5-10 seconds to generate. Please do not close the window.<br><br>Thanks for bearing with our ads, they help keep this tool free!</span>';

  setTimeout(() => {
    html2pdf().set(opt).from(clone).save().then(() => {
      
      if (btnModalConfirm) btnModalConfirm.innerHTML = oldText;
      window.isGeneratingPdf = false;

      // Track Primary GA4 Funnel Conversion Event: pdf_download_completed
      trackGAEvent('pdf_download_completed', {
        template_id: state.selectedTemplateId,
        industry: state.selectedInd,
        experience_level: state.selectedExp,
        paper_size: state.paperSize
      });
      
      // Close the Print/AI Modal if it's open
      const printModal = document.getElementById('print-modal');
      if (printModal) {
        printModal.style.display = 'none';
        printModal.style.opacity = '0';
      }

      // Trigger Post-Download Retention & Job Tailor Modal (Retention Engine)
      const affiliateModal = document.getElementById('affiliate-modal');
      if (affiliateModal) {
        affiliateModal.style.display = 'flex';
        
        const btnCloseAffiliate = document.getElementById('btn-close-affiliate-modal');
        const btnModalTailor = document.getElementById('btn-modal-tailor-new');
        
        if (btnCloseAffiliate) {
          btnCloseAffiliate.onclick = () => {
            affiliateModal.style.display = 'none';
          };
        }

        if (btnModalTailor) {
          btnModalTailor.onclick = () => {
            affiliateModal.style.display = 'none';
            promptCreateNewProfileVersion();
          };
        }
        
        const btnWhatsapp = document.getElementById('btn-share-whatsapp');
        const btnLinkedin = document.getElementById('btn-share-linkedin');
        const btnCopy = document.getElementById('btn-share-copy');
        
        const shareUrl = "https://zenresume.online/";
        const shareText = "I just built a perfect ATS-compliant resume for free using ZenResume. No paywalls or subscriptions. Build yours here:";
        
        if (btnWhatsapp) {
          btnWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        }
        
        if (btnLinkedin) {
          btnLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        }
        
        if (btnCopy) {
          btnCopy.onclick = () => {
            navigator.clipboard.writeText(shareUrl).then(() => {
              const originalText = btnCopy.innerHTML;
              btnCopy.innerHTML = `<i class="fas fa-check"></i> Copied!`;
              btnCopy.style.background = "#2ecc71";
              btnCopy.style.color = "white";
              btnCopy.style.borderColor = "#2ecc71";
              setTimeout(() => {
                btnCopy.innerHTML = originalText;
                btnCopy.style.background = "";
                btnCopy.style.color = "";
                btnCopy.style.borderColor = "";
              }, 2000);
            }).catch(err => {
              console.error("Clipboard copy failed", err);
            });
          };
        }
        
        if (btnAffiliateLink) {
          btnAffiliateLink.onclick = () => {
            window.open('https://www.amazon.in/Gayle-Laakmann-McDowell-Programming-Solutions-Paperback/dp/B08CDHYF5D?dib=eyJ2IjoiMSJ9.9XzaqyXBhFL5Gf6bhDB4KFPawNIFDAZZc4mryrovwpuRF1wVPRHjmDv22-HvspwDPs7TQ6qIYajbFPeE_UonDPBo352mYPsBg6ZCpgiQDw0P9fVofTC4umZm8DPG9z7W-anWeKrVjEAzzAzj_sGC62HaL5DxGAi9UUDRNGpLU4PdfNfW53EM3s-FdoRnHYjZaNKa00UWBWFsdbMOYZAsYlDBCdzPiDZNh1rPeDRylJg.I-yvM3vNziTP3ns-zzIqdtdVTV4duaJFSaXJhjpZVWI&dib_tag=se&keywords=cracking+the+code+interview&qid=1782971021&sr=8-1&linkCode=ll2&tag=zenresume01-21&linkId=f96e4d6b195eccbaf632ecf501569508&ref_=as_li_ss_tl', '_blank', 'noopener,noreferrer');
            affiliateModal.style.display = 'none';
          };
        }
      }
    }).catch(err => {
      console.error("PDF Engine Error:", err);
      if (btnModalConfirm) btnModalConfirm.innerHTML = "Error generating PDF. Try again.";
      alert("Failed to generate PDF. Please try again.");
    }).finally(() => {
      // ALWAYS RESTORE LAYOUT, REGARDLESS OF SUCCESS OR FAILURE
      printContainer.remove();
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.width = originalBodyWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      
      // Restore mobile preview tab state
      if (!wasPreviewShown && builderWorkspace) {
        builderWorkspace.classList.remove('show-preview');
      }
      window.isGeneratingPdf = false;
    });
  }, 350);
}

/* ==========================================================================
   7B. MOBILE WORKSPACE TABS MANAGER
   ========================================================================== */
function setMobileTab(activeTab) {
  const btnEdit = document.getElementById('tab-btn-edit');
  const btnPreview = document.getElementById('tab-btn-preview');
  
  if (!btnEdit || !btnPreview) return;
  
  if (activeTab === 'edit') {
    btnEdit.classList.add('active');
    btnPreview.classList.remove('active');
    builderWorkspace.classList.remove('show-preview');
  } else {
    btnPreview.classList.add('active');
    btnEdit.classList.remove('active');
    builderWorkspace.classList.add('show-preview');
    
    // Trigger full preview rendering and layout fitting on tab entry
    syncFormToPreview();
    
    // Trigger dynamic fluid preview scaling on mobile view tab switch (fallback for non-observer browsers)
    setTimeout(adjustPreviewScale, 150);
  }
}

/* ==========================================================================
   7C. FLUID MOBILE PREVIEW SCALING
   ========================================================================== */
function adjustPreviewScale() {
  if (window.isGeneratingPdf) return;
  const wrapper = document.querySelector('.resume-paper-wrapper');
  const paper = document.getElementById('resume-print-area');
  const zoomPercentageEl = document.getElementById('zoom-percentage');
  
  if (!wrapper || !paper) return;
  
  const wrapperWidth = wrapper.clientWidth;
  const isLetter = state.paperSize === 'letter';
  const paperWidth = isLetter ? 816 : 794;
  const paperHeight = paper.scrollHeight || (isLetter ? 1056 : 1122);
  
  let scale = 1.0;
  
  // Calculate automatic fit-to-width scale
  const fitWidthScale = wrapperWidth > 0 ? (wrapperWidth / paperWidth) : 1.0;
  
  if (state.zoomScale !== undefined && state.zoomScale !== null) {
    scale = state.zoomScale;
  } else if (state.isFitToScreen) {
    // Calculate scale to fit the entire height of the paper into the viewport, with a small padding
    const availableHeight = window.innerHeight - 100; // Account for mobile tabs and preview bar
    const heightScale = availableHeight / paperHeight;
    // Use the smaller scale so both width and height fit
    scale = Math.min(fitWidthScale, heightScale);
  } else if (wrapperWidth > 0 && wrapperWidth < paperWidth) {
    // Default: Fit to width
    scale = fitWidthScale;
  }
  
  // Apply dynamic scaling and alignment based on viewport boundary fit
  const visualPaperWidth = paperWidth * scale;
  
  paper.style.transform = `scale(${scale})`;
  
  const isMobile = window.innerWidth <= 800;
  
  if (isMobile) {
    // Mobile/Tablet views: Use position: absolute to lock layout bounds and prevent horizontal scroll jitter/clipping
    paper.style.transformOrigin = 'top left';
    paper.style.margin = '0';
    paper.style.position = 'absolute';
    paper.style.top = '0';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.paddingLeft = '0px';
    wrapper.scrollLeft = 0; // Force reset scroll offset to prevent cut-offs
    
    if (wrapperWidth > 0 && visualPaperWidth < wrapperWidth) {
      // Fits inside viewport: visually center using left offset
      paper.style.left = `${(wrapperWidth - visualPaperWidth) / 2}px`;
    } else {
      // Overflows: align to left edge
      paper.style.left = '0px';
    }
  } else {
    // Desktop views: Use relative positioning to let the wide zoomed child stretch the parent container scrollWidth naturally
    paper.style.transformOrigin = 'top center';
    paper.style.margin = '0 auto';
    paper.style.position = 'relative';
    paper.style.top = 'auto';
    paper.style.left = 'auto';
    wrapper.style.alignItems = 'center';
    wrapper.style.paddingLeft = '0px';
  }
  
  // Update parent wrapper height so scroll bars and containers match exactly
  wrapper.style.height = `${paperHeight * scale}px`;
  
  // Update UI zoom label
  if (zoomPercentageEl) {
    zoomPercentageEl.textContent = `${Math.round(scale * 100)}%`;
  }
}

/* ==========================================================================
   7D. DYNAMIC SUMMARY GENERATOR
   ========================================================================== */
function generateSummarySuggestions() {
  const titleInput = document.getElementById('input-title');
  const skillsInput = document.getElementById('input-skills');
  const summaryInput = document.getElementById('input-summary');
  
  if (!titleInput || !skillsInput || !summaryInput) return;
  
  const title = titleInput.value.trim() || 'Professional';
  const skillsText = skillsInput.value.trim();
  const skills = skillsText ? skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
  
  const panel = document.getElementById('summary-suggestions-panel');
  const list = document.getElementById('summary-suggestions-list');
  
  if (!panel || !list) return;
  
  // Show suggestions panel
  panel.style.display = 'block';
  
  // Define variables for phrase compilation
  const techSkills = skills.length > 0 ? skills : ['industry standard frameworks', 'modern architectures', 'industry methodologies'];
  const keyTech = techSkills.slice(0, 3).join(', ');
  const secondaryTech = techSkills.slice(3, 6).join(', ') || techSkills[0];
  const primarySkill = techSkills[0] || 'innovative problem solving';
  
  // Suggestion Option 1: Action & Business Results Oriented
  const var1 = `Result-oriented ${title} with a proven record of driving operational efficiency and high-fidelity project execution. Expert in leveraging ${keyTech} to optimize system throughput, minimize operational scrap, and streamline deployment workflows. Collaborative team player skilled at translating cross-functional business requirements into secure, high-impact technical systems.`;
  
  // Suggestion Option 2: Deep Technical & Tool Focused
  const var2 = `Highly analytical ${title} specializing in advanced systems development, automated data workflows, and structured modeling frameworks. Proficient in a robust engineering toolset including ${skills.length > 0 ? skills.slice(0, 5).join(', ') : keyTech}, with hands-on credentials applying modern engineering design standards. Focused on deploying clean, modular architectures that guarantee long-term stability.`;
  
  // Suggestion Option 3: Modern, Growth & Collaborative
  const var3 = `Adaptable and growth-minded ${title} with deep expertise across ${primarySkill} and modern engineering methodologies. Passionate about continuous professional development, agile project delivery, and implementing scalable solutions in collaborative environments. Adept at leveraging ${secondaryTech} to design user-focused features and spearhead technical innovation.`;
  
  const suggestions = [var1, var2, var3];
  
  // Render suggestions
  list.innerHTML = '';
  suggestions.forEach((text) => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    card.textContent = text;
    
    // Highlight if selected
    if (summaryInput.value === text) {
      card.classList.add('selected');
    }
    
    // Select dynamic option on click
    card.addEventListener('click', () => {
      list.querySelectorAll('.suggestion-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const summaryInput = document.getElementById('input-summary');
      summaryInput.value = text;
      summaryInput.textContent = text;
      syncFormToPreview();
      setTimeout(syncFormToPreview, 50);
    });
    
    list.appendChild(card);
  });
}

/* ==========================================================================
   7E. DYNAMIC SINGLE-PAGE AUTO-FIT ENGINE
   ========================================================================== */
function autoFitToSinglePage() {
  const paper = document.getElementById('resume-print-area');
  if (!paper) return;
  
  // Clear any existing compression/expansion classes first
  paper.classList.remove(
    'compress-1', 'compress-2', 'compress-3', 'compress-4',
    'expand-1', 'expand-2', 'expand-3'
  );
  
  // Temporarily set min-height to auto to get the natural natural height of the content
  paper.style.minHeight = 'auto';
  let naturalHeight = paper.scrollHeight;
  paper.style.minHeight = '';
  
  const isLetter = state.paperSize === 'letter';
  const targetHeight = isLetter ? 1056 : 1122; // Letter: 11in (1056px), A4: 297mm (1122px)
  
  // 1. If it overflows the single page, apply compression classes step-by-step
  if (naturalHeight > targetHeight) {
    const compressClasses = ['compress-1', 'compress-2', 'compress-3', 'compress-4'];
    let fitted = false;
    for (let i = 0; i < compressClasses.length; i++) {
      paper.classList.add(compressClasses[i]);
      
      paper.style.minHeight = 'auto';
      naturalHeight = paper.scrollHeight;
      paper.style.minHeight = '';
      
      if (naturalHeight <= targetHeight) {
        fitted = true;
        break; // Successfully fit on a single page!
      }
    }
    
    // If even maximum compression can't fit it on 1 page, it is a true multi-page resume!
    // We remove compression to let it flow naturally and beautifully in full size over multiple pages.
    if (!fitted) {
      paper.classList.remove('compress-1', 'compress-2', 'compress-3', 'compress-4');
    }
  } 
  // 2. If it is shorter than a single page, apply expansion classes step-by-step to fill the space
  // CRITICAL: The "fill page" (expansion) feature is ONLY triggered if the resume is a single-page document
  // (i.e. is shorter than 1122px). It is never triggered for multi-page resumes.
  else if (naturalHeight < targetHeight - 80) {
    const expandClasses = ['expand-1', 'expand-2', 'expand-3'];
    for (let i = 0; i < expandClasses.length; i++) {
      // Check if applying this class remains within target height
      paper.classList.add(expandClasses[i]);
      
      paper.style.minHeight = 'auto';
      naturalHeight = paper.scrollHeight;
      paper.style.minHeight = '';
      
      if (naturalHeight > targetHeight) {
        // If it overflows, back off by removing this expansion class and sticking to the previous one
        paper.classList.remove(expandClasses[i]);
        break;
      }
    }
  }
}

/* ==========================================================================
   7. AI MAGIC IMPORT & TAILORING (Gemini Integration)
   ========================================================================== */

/**
 * Executes a fetch request with exponential backoff for 429 Too Many Requests.
 */
async function fetchWithRetry(url, options, maxRetries = 3) {
  let currentUrl = url;
  const _xd = (d) => { const _s = "ZenResume2026"; return d.map((c,i) => String.fromCharCode(c ^ _s.charCodeAt(i % _s.length))).join(''); };
  const primaryKey = _xd([27,52,64,19,7,75,39,35,83,120,65,72,3,12,4,28,43,44,17,37,5,28,75,111,123,27,119,6,6,6,0,16,37,55,61,66,8,112,116,16,11,6,49,50,1,60,4,21,11,122,122,67,45]);
  const fallbackKey = _xd([27,52,64,19,7,75,39,35,83,126,2,2,3,0,81,91,10,39,41,15,60,85,98,97,72,83,51,21,5,13,87,59,27,30,83,88,70,0,85,28,81,38,22,52,63,44,60,8,92,82,6,80,45]);

  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(currentUrl, options);
    
    // If it's a 429 Error, handle it
    if (response.status === 429) {
      console.warn(`[AI Rate Limit] Hit 429 Too Many Requests.`);
      
      // If we are using the primary key, instantly swap to fallback key
      if (currentUrl.includes(primaryKey)) {
        console.log("Quota exceeded on primary key, switching to fallback API key...");
        currentUrl = currentUrl.replace(primaryKey, fallbackKey);
        continue; // Retry immediately with new key without waiting
      }

      // If already on fallback (or custom key), backoff and retry
      console.warn(`Retrying in ${Math.pow(2, i) * 2} seconds... (Attempt ${i+1}/${maxRetries})`);
      
      // Update UI if possible
      const importBtn = document.getElementById('btn-magic-import');
      if (importBtn && importBtn.innerHTML.includes('Processing')) {
        importBtn.innerHTML = `<i class="fas fa-hourglass-half fa-spin"></i> AI busy, holding line...`;
      }
      
      const tailorBtn = document.getElementById('btn-generate-ai');
      if (tailorBtn && tailorBtn.innerHTML.includes('Tailor & Download')) {
        tailorBtn.innerHTML = `AI busy, holding line...`;
      }

      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 2000)); // 2s, 4s, 8s
      continue;
    }
    
    return response;
  }
  throw new Error("AI is currently experiencing extremely high demand. Please try again in 1 minute.");
}

async function callSecureGeminiProxy(action, payload, fallbackPromptText, isPdf = false, pdfData = '') {
  // 1. Try serverless Edge API proxy first (protects API keys, handles throttling)
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload, prompt: fallbackPromptText })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (proxyErr) {
    console.warn('Serverless Gemini proxy offline or running standalone, falling back to client engine:', proxyErr);
  }

  // 2. Resilient Client-Side Fallback
  const _gk = () => { const _d = [27,52,64,19,7,75,39,35,83,120,65,72,3,12,4,28,43,44,17,37,5,28,75,111,123,27,119,6,6,6,0,16,37,55,61,66,8,112,116,16,11,6,49,50,1,60,4,21,11,122,122,67,45]; const _s = "ZenResume2026"; return _d.map((c,i) => String.fromCharCode(c ^ _s.charCodeAt(i % _s.length))).join(''); };
  let apiKey = localStorage.getItem('GEMINI_API_KEY') || _gk();

  const parts = [{ text: fallbackPromptText }];
  if (isPdf && pdfData) {
    parts.push({
      inline_data: {
        mime_type: "application/pdf",
        data: pdfData
      }
    });
  }

  const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: parts }] })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const rawResponse = data.candidates[0].content.parts[0].text;
  const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(jsonString);
}

async function parseHeuristics(inputData, isPdf = false) {
  const btnMagicImport = document.getElementById('btn-magic-import');
  if (btnMagicImport) {
    btnMagicImport.innerHTML = "AI Analyzing Resume...";
  }
  
  try {
    const promptText = `
    You are an expert resume parser. I have provided a resume. 
    Extract the information and perfectly map it to this strict JSON schema. If any field is missing, leave it blank or empty array.
    
    JSON Schema to return ONLY (no markdown or code blocks):
    {
      "personal": {
        "name": "string",
        "title": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "website": "string",
        "linkedin": "string"
      },
      "summary": "string",
      "skills": ["string", "string"],
      "experience": [
        {
          "role": "string",
          "company": "string",
          "dates": "string",
          "location": "string",
          "descriptions": ["string", "string"]
        }
      ],
      "projects": [
        {
          "title": "string",
          "technologies": "string",
          "description": "string",
          "link": "string"
        }
      ],
      "education": [
        {
          "degree": "string",
          "institution": "string",
          "location": "string",
          "dates": "string",
          "gpa": "string"
        }
      ],
      "certifications": [
        { "name": "string", "issuer": "string", "date": "string", "desc": "string" }
      ]
    }
    ${isPdf ? '' : `\n\nRaw Resume Text:\n${inputData}`}
    `;

    const parsedData = await callSecureGeminiProxy(
      'parse_resume',
      { rawText: isPdf ? '' : inputData },
      promptText,
      isPdf,
      isPdf ? inputData : ''
    );
    
    if (typeof loadProfileIntoForm === 'function') {
      loadProfileIntoForm(parsedData);
      state.hasLoadedProfile = true;
    }
    
    syncFormToPreview();

    // Track GA4 Conversion Event: gemini_ai_import_success
    trackGAEvent('gemini_ai_import_success', {
      is_pdf: isPdf,
      has_experience: !!(parsedData.experience && parsedData.experience.length),
      has_projects: !!(parsedData.projects && parsedData.projects.length),
      has_education: !!(parsedData.education && parsedData.education.length)
    });

    alert("AI Magic Import successful! Your resume has been perfectly structured.");
    
  } catch (err) {
    console.error("AI Parse Error:", err);
    // Fallback to raw heuristic dump
    const summaryField = document.getElementById('input-summary');
    if (summaryField) {
      summaryField.value = "--- AUTO EXTRACTED RAW TEXT ---\n(Copy & Paste into the fields below)\n\n" + text;
    }
    alert("AI parsing failed. The raw text was placed in the Summary section so you can copy-paste manually.");
    syncFormToPreview();
  }
}

/* ==========================================================================
   FEATURE 1: SPACING CONTROLLER & 1-CLICK MAGIC FIT-TO-PAGE
   ========================================================================== */
function initSpacingController() {
  const btnToggle = document.getElementById('btn-spacing-toggle');
  const popover = document.getElementById('spacing-popover-card');
  const btnClose = document.getElementById('btn-close-spacing-popover');
  const btnMagicFit = document.getElementById('btn-magic-fit-page');
  const btnReset = document.getElementById('btn-reset-spacing');

  const sliderMargin = document.getElementById('slider-page-margin');
  const sliderGap = document.getElementById('slider-section-gap');
  const sliderLineHeight = document.getElementById('slider-line-height');
  const sliderFontScale = document.getElementById('slider-font-scale');

  const valMargin = document.getElementById('label-val-margin');
  const valGap = document.getElementById('label-val-section-gap');
  const valLineHeight = document.getElementById('label-val-line-height');
  const valFontScale = document.getElementById('label-val-font-scale');

  // Pre-hydrate sliders from current state
  if (state.spacing) {
    if (sliderMargin && state.spacing.pageMargin) sliderMargin.value = state.spacing.pageMargin;
    if (sliderGap && state.spacing.sectionGap) sliderGap.value = state.spacing.sectionGap;
    if (sliderLineHeight && state.spacing.lineHeight) sliderLineHeight.value = state.spacing.lineHeight;
    if (sliderFontScale && state.spacing.fontScale) sliderFontScale.value = state.spacing.fontScale;

    if (valMargin && state.spacing.pageMargin) valMargin.textContent = `${state.spacing.pageMargin}px`;
    if (valGap && state.spacing.sectionGap) valGap.textContent = `${state.spacing.sectionGap}px`;
    if (valLineHeight && state.spacing.lineHeight) valLineHeight.textContent = `${state.spacing.lineHeight}x`;
    if (valFontScale && state.spacing.fontScale) valFontScale.textContent = `${state.spacing.fontScale}%`;
  }

  function applySpacing() {
    const paper = document.getElementById('resume-print-area');
    if (!paper) return;
    
    const margin = sliderMargin ? sliderMargin.value : 24;
    const gap = sliderGap ? sliderGap.value : 16;
    const lineHeight = sliderLineHeight ? sliderLineHeight.value : 1.35;
    const fontScale = sliderFontScale ? sliderFontScale.value : 100;

    paper.style.setProperty('--resume-page-padding', `${margin}px`);
    paper.style.setProperty('--resume-section-gap', `${gap}px`);
    paper.style.setProperty('--resume-line-height', lineHeight);
    paper.style.setProperty('--resume-font-scale', fontScale / 100);

    if (valMargin) valMargin.textContent = `${margin}px`;
    if (valGap) valGap.textContent = `${gap}px`;
    if (valLineHeight) valLineHeight.textContent = `${lineHeight}x`;
    if (valFontScale) valFontScale.textContent = `${fontScale}%`;

    state.spacing = {
      pageMargin: Number(margin),
      sectionGap: Number(gap),
      lineHeight: Number(lineHeight),
      fontScale: Number(fontScale)
    };
    autoSaveResume();
  }

  if (btnToggle && popover) {
    btnToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = popover.style.display === 'flex';
      popover.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
      if (popover.style.display === 'flex' && !popover.contains(e.target) && e.target !== btnToggle) {
        popover.style.display = 'none';
      }
    });

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        popover.style.display = 'none';
      });
    }
  }

  [sliderMargin, sliderGap, sliderLineHeight, sliderFontScale].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', applySpacing);
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (sliderMargin) sliderMargin.value = 24;
      if (sliderGap) sliderGap.value = 16;
      if (sliderLineHeight) sliderLineHeight.value = 1.35;
      if (sliderFontScale) sliderFontScale.value = 100;
      applySpacing();
      showToast('Spacing reset to default!');
    });
  }

  if (btnMagicFit) {
    btnMagicFit.addEventListener('click', () => {
      magicFitToSinglePage();
    });
  }
}

function magicFitToSinglePage() {
  const paper = document.getElementById('resume-print-area');
  if (!paper) return;

  const sliderMargin = document.getElementById('slider-page-margin');
  const sliderGap = document.getElementById('slider-section-gap');
  const sliderLineHeight = document.getElementById('slider-line-height');
  const sliderFontScale = document.getElementById('slider-font-scale');

  const valMargin = document.getElementById('label-val-margin');
  const valGap = document.getElementById('label-val-section-gap');
  const valLineHeight = document.getElementById('label-val-line-height');
  const valFontScale = document.getElementById('label-val-font-scale');

  const maxHeight = state.paperSize === 'letter' ? 1056 : 1122;

  const presets = [
    { margin: 22, gap: 14, line: 1.30, font: 100 },
    { margin: 20, gap: 12, line: 1.25, font: 95 },
    { margin: 18, gap: 10, line: 1.20, font: 90 },
    { margin: 14, gap: 8, line: 1.15, font: 85 }
  ];

  let fitted = false;
  for (const p of presets) {
    paper.style.setProperty('--resume-page-padding', `${p.margin}px`);
    paper.style.setProperty('--resume-section-gap', `${p.gap}px`);
    paper.style.setProperty('--resume-line-height', p.line);
    paper.style.setProperty('--resume-font-scale', p.font / 100);

    if (paper.scrollHeight <= maxHeight + 10) {
      if (sliderMargin) sliderMargin.value = p.margin;
      if (sliderGap) sliderGap.value = p.gap;
      if (sliderLineHeight) sliderLineHeight.value = p.line;
      if (sliderFontScale) sliderFontScale.value = p.font;

      if (valMargin) valMargin.textContent = `${p.margin}px`;
      if (valGap) valGap.textContent = `${p.gap}px`;
      if (valLineHeight) valLineHeight.textContent = `${p.line}x`;
      if (valFontScale) valFontScale.textContent = `${p.font}%`;

      fitted = true;
      break;
    }
  }

  if (fitted) {
    showToast('⚡ Optimized cleanly onto 1 single page!');
  } else {
    showToast('Applied maximum compression (Content is extensive)');
  }
}

/* ==========================================================================
   FEATURE 2: INTERACTIVE SECTION REORDERING (DRAG & TAP ARROWS)
   ========================================================================== */
function initReorderController() {
  const reorderModal = document.getElementById('reorder-modal');
  const btnOpen = document.getElementById('btn-reorder-layout');
  const btnClose = document.getElementById('btn-close-reorder');
  const btnCloseX = document.getElementById('btn-close-reorder-x');
  const btnReset = document.getElementById('btn-reset-reorder');
  const reorderList = document.getElementById('reorder-list');

  if (!reorderList) return;

  function syncReorderUIFromState() {
    if (!state.sectionOrder || !Array.isArray(state.sectionOrder)) return;
    state.sectionOrder.forEach(secId => {
      const item = reorderList.querySelector(`[data-id="${secId}"]`);
      if (item) {
        reorderList.appendChild(item);
      }
    });
  }

  function readOrderFromDOM() {
    const order = [];
    reorderList.querySelectorAll('.reorder-item').forEach(item => {
      order.push(item.getAttribute('data-id'));
    });
    state.sectionOrder = order;
    syncFormToPreview();
    autoSaveResume();
  }

  if (btnOpen && reorderModal) {
    btnOpen.addEventListener('click', () => {
      syncReorderUIFromState();
      reorderModal.style.display = 'flex';
    });
  }

  [btnClose, btnCloseX].forEach(btn => {
    if (btn && reorderModal) {
      btn.addEventListener('click', () => {
        readOrderFromDOM();
        reorderModal.style.display = 'none';
        showToast('Section order updated!');
      });
    }
  });

  // Tap arrow click handlers
  reorderList.addEventListener('click', (e) => {
    const arrowBtn = e.target.closest('.btn-reorder-arrow');
    if (!arrowBtn) return;
    const item = arrowBtn.closest('.reorder-item');
    if (!item) return;
    const action = arrowBtn.getAttribute('data-action');

    if (action === 'up' && item.previousElementSibling) {
      reorderList.insertBefore(item, item.previousElementSibling);
      readOrderFromDOM();
    } else if (action === 'down' && item.nextElementSibling) {
      reorderList.insertBefore(item.nextElementSibling, item);
      readOrderFromDOM();
    }
  });

  // Reset to default order
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'];
      defaultOrder.forEach(id => {
        const item = reorderList.querySelector(`[data-id="${id}"]`);
        if (item) reorderList.appendChild(item);
      });
      readOrderFromDOM();
      showToast('Restored default section hierarchy');
    });
  }

  // Drag-and-drop via SortableJS
  if (typeof Sortable !== 'undefined') {
    new Sortable(reorderList, {
      handle: '.reorder-handle',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onEnd: readOrderFromDOM
    });
  }
}

/* ==========================================================================
   FEATURE 3: LIVE CLIENT-SIDE ATS JOB DESCRIPTION KEYWORD MATCHER
   ========================================================================== */
const COMMON_TECH_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', '.NET', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'SASS', 'Redux', 'GraphQL', 'REST API', 'Microservices',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'DynamoDB',
  'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux',
  'Machine Learning', 'Deep Learning', 'AI', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Data Science', 'Data Engineering', 'Spark', 'Kafka',
  'Agile', 'Scrum', 'Jira', 'Git', 'GitHub', 'GitLab', 'Unit Testing', 'Jest', 'Cypress', 'Selenium', 'TDD', 'Figma', 'UI/UX',
  'Cybersecurity', 'SIEM', 'Cloud Security', 'DevOps', 'SRE', 'System Design', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Tableau', 'Power BI', 'Excel'
];

function initAtsMatcher() {
  const btnOpen = document.getElementById('btn-open-ats-matcher');
  const modal = document.getElementById('ats-matcher-modal');
  const btnClose = document.getElementById('btn-close-ats-matcher');
  const btnScan = document.getElementById('btn-run-ats-scan');
  const btnClear = document.getElementById('btn-clear-ats-scan');
  const inputJd = document.getElementById('input-ats-job-desc');
  const resultsContainer = document.getElementById('ats-scan-results');
  const scoreDisplay = document.getElementById('ats-score-display');
  const statusBadge = document.getElementById('ats-status-badge');
  const matchRatio = document.getElementById('ats-match-ratio');
  const missingContainer = document.getElementById('ats-missing-tags');
  const foundContainer = document.getElementById('ats-found-tags');

  // Pre-hydrate from existing state if user already entered JD
  if (state.targetJobDescription && inputJd) {
    inputJd.value = state.targetJobDescription;
  }

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      // Sync stored JD into textarea
      if (state.targetJobDescription && inputJd) {
        inputJd.value = state.targetJobDescription;
      }
      modal.style.display = 'flex';
      if (inputJd && inputJd.value.trim()) {
        runAtsScan();
      }
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (inputJd) inputJd.value = '';
      state.targetJobDescription = '';
      localStorage.removeItem('zenresume_target_jd');
      if (resultsContainer) resultsContainer.style.display = 'none';
    });
  }

  if (btnScan) {
    btnScan.addEventListener('click', runAtsScan);
  }

  function runAtsScan() {
    const jd = inputJd ? inputJd.value.trim() : '';
    if (!jd) {
      alert('Please paste a job description or list of required skills first.');
      return;
    }

    // Store in shared state & localStorage so user never has to re-paste!
    state.targetJobDescription = jd;
    localStorage.setItem('zenresume_target_jd', jd);

    // Auto-fill the Gemini AI tailor input box too!
    const aiJdInput = document.getElementById('input-job-description');
    if (aiJdInput) aiJdInput.value = jd;

    // 1. Extract keywords from JD
    const jdLower = jd.toLowerCase();
    const extractedKeywords = [];

    COMMON_TECH_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(jd)) {
        if (!extractedKeywords.includes(skill)) {
          extractedKeywords.push(skill);
        }
      }
    });

    // Also extract capitalized technical keywords (e.g., specific acronyms/libraries)
    const customWords = jd.match(/\b[A-Z][a-zA-Z0-9#+.-]{2,}\b/g) || [];
    const stopWords = ['The', 'And', 'For', 'With', 'You', 'Will', 'Are', 'This', 'Our', 'Job', 'Team', 'Work', 'Role', 'Company', 'Must', 'Have', 'Able', 'Join', 'From', 'About', 'Full', 'Time', 'Year', 'Years', 'Plus', 'Ideal', 'Good', 'Self', 'Fast', 'Looking', 'Required', 'Requirements'];
    customWords.forEach(w => {
      if (!stopWords.includes(w) && w.length >= 3 && !extractedKeywords.some(k => k.toLowerCase() === w.toLowerCase())) {
        if (extractedKeywords.length < 25) {
          extractedKeywords.push(w);
        }
      }
    });

    // 2. Extract entire resume text to search against
    const currentData = extractCurrentFormData();
    const resumeText = [
      currentData.personal.name,
      currentData.personal.title,
      currentData.summary,
      (currentData.skills || []).join(' '),
      currentData.experience.map(e => `${e.role} ${e.company} ${e.descriptions.join(' ')}`).join(' '),
      currentData.projects.map(p => `${p.title} ${p.technologies} ${p.description}`).join(' '),
      currentData.education.map(ed => `${ed.degree} ${ed.institution}`).join(' '),
      currentData.certifications.map(c => `${c.name} ${c.issuer}`).join(' ')
    ].join(' ').toLowerCase();

    // 3. Classify into Found and Missing
    const found = [];
    const missing = [];

    extractedKeywords.forEach(kw => {
      const kwLower = kw.toLowerCase();
      if (resumeText.includes(kwLower)) {
        found.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const total = extractedKeywords.length || 1;
    const score = Math.round((found.length / total) * 100);

    // 4. Render UI Results
    if (scoreDisplay) scoreDisplay.textContent = `${score}%`;
    if (matchRatio) matchRatio.textContent = `${found.length} of ${total} matched`;

    if (statusBadge) {
      if (score >= 80) {
        statusBadge.textContent = '🌟 High Compatibility';
        statusBadge.style.background = 'rgba(46, 204, 113, 0.15)';
        statusBadge.style.color = '#27AE60';
      } else if (score >= 50) {
        statusBadge.textContent = '⚠️ Moderate Match';
        statusBadge.style.background = 'rgba(241, 196, 15, 0.15)';
        statusBadge.style.color = '#D97706';
      } else {
        statusBadge.textContent = '❌ Low Keyword Match';
        statusBadge.style.background = 'rgba(231, 76, 60, 0.15)';
        statusBadge.style.color = '#E74C3C';
      }
    }

    if (foundContainer) {
      foundContainer.innerHTML = found.length > 0
        ? found.map(k => `<span class="ats-keyword-tag found"><i class="fas fa-check"></i> ${escapeHTML(k)}</span>`).join('')
        : '<span style="font-size: 12px; color: #94A3B8;">No target keywords detected in your resume yet.</span>';
    }

    if (missingContainer) {
      missingContainer.innerHTML = missing.length > 0
        ? missing.map(k => `<button type="button" class="ats-keyword-tag missing" data-keyword="${escapeHTML(k)}" title="Click to add to Skills"><i class="fas fa-plus"></i> ${escapeHTML(k)}</button>`).join('')
        : '<span style="font-size: 12px; color: #16A34A;">🎉 Excellent! All extracted keywords are in your resume.</span>';

      // 1-Click add to skills handler
      missingContainer.querySelectorAll('.ats-keyword-tag.missing').forEach(tagBtn => {
        tagBtn.addEventListener('click', () => {
          const kw = tagBtn.getAttribute('data-keyword');
          const skillsInput = document.getElementById('input-skills');
          if (skillsInput) {
            const currentSkills = skillsInput.value.trim();
            skillsInput.value = currentSkills ? `${currentSkills}, ${kw}` : kw;
            syncFormToPreview();
            tagBtn.remove();
            showToast(`Added "${kw}" to Skills!`);
            runAtsScan(); // Re-evaluate score reactively!
          }
        });
      });
    }

    if (resultsContainer) resultsContainer.style.display = 'block';
  }
}

/* ==========================================================================
   8. ATTACH GENERAL EVENT LISTENERS
   ========================================================================== */
function attachEvents() {
  
  // Initialize Feature 1: Spacing Controller & 1-Click Fit-to-Page
  initSpacingController();

  // Initialize Feature 2: Interactive Section Reordering (Drag + Tap Arrows)
  initReorderController();

  // Initialize Feature 3: Live Client-Side ATS Job Description Keyword Matcher
  initAtsMatcher();

  // Go back to the Greeting & Catalog screen
  btnBackToTemplates.addEventListener('click', () => {
    builderWorkspace.style.display = 'none';
    selectionScreen.style.display = 'flex';
    
    // Show welcome header when selecting templates
    const welcomeHeader = document.getElementById('app-header-welcome');
    if (welcomeHeader) welcomeHeader.style.display = 'block';
    
    // Hide mobile tabs bar when back to templates
    const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
    if (mobileWorkspaceTabs) {
      mobileWorkspaceTabs.style.display = 'none';
    }
  });

  // Attach Static Form Listeners (Top level details)
  document.getElementById('input-name').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-title').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-email').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-phone').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-location').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-website').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-linkedin').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-github').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-custom-social').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-summary').addEventListener('input', debouncedSyncFormToPreview);
  document.getElementById('input-skills').addEventListener('input', debouncedSyncFormToPreview);

  // Dynamic Add item listeners
  btnAddExperience.addEventListener('click', () => {
    addExperienceCard();
    syncFormToPreview();
  });
  btnAddProject.addEventListener('click', () => {
    addProjectCard();
    syncFormToPreview();
  });
  btnAddEducation.addEventListener('click', () => {
    addEducationCard();
    syncFormToPreview();
  });
  btnAddCertification.addEventListener('click', () => {
    addCertificationCard();
    syncFormToPreview();
  });

  // Navigation steps
  btnWizardNext.addEventListener('click', handleWizardNext);
  btnWizardPrev.addEventListener('click', handleWizardPrev);

  // Quick Action download button in Live Preview
  btnTriggerDownload.addEventListener('click', openPrintModal);
  
  // AI Upgrade & Modal Actions
  const btnModalClose = document.getElementById('btn-modal-close');
  if (btnModalClose) btnModalClose.addEventListener('click', closePrintModal);
  
  const btnSkipAi = document.getElementById('btn-skip-ai');
  if (btnSkipAi) {
    btnSkipAi.addEventListener('click', () => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isSafari || isFirefox || isMobile) {
        closePrintModal();
        const warningModal = document.getElementById('print-warning-modal');
        if (warningModal) warningModal.style.display = 'flex';
      } else {
        executeSystemPrint();
      }
    });
  }
  
  const btnYesAi = document.getElementById('btn-yes-ai');
  const btnBackAi = document.getElementById('btn-back-ai');
  const btnGenerateAi = document.getElementById('btn-generate-ai');
  
  if (btnYesAi) {
    btnYesAi.addEventListener('click', () => {
      document.getElementById('ai-upgrade-step-1').style.display = 'none';
      document.getElementById('ai-buttons-step-1').style.display = 'none';
      document.getElementById('ai-upgrade-step-2').style.display = 'block';
      document.getElementById('ai-buttons-step-2').style.display = 'flex';

      // Auto pre-populate JD if user previously pasted one in the ATS Matcher!
      const jdInput = document.getElementById('input-job-description');
      if (jdInput && state.targetJobDescription && !jdInput.value.trim()) {
        jdInput.value = state.targetJobDescription;
      }
    });
  }
  
  if (btnBackAi) {
    btnBackAi.addEventListener('click', openPrintModal);
  }
  
  if (btnGenerateAi) {
    btnGenerateAi.addEventListener('click', async () => {
      const jd = document.getElementById('input-job-description').value.trim();
      if (!jd) {
        alert("Please paste a job description first.");
        return;
      }
      
      const _gk2 = () => { const _d = [27,52,64,19,7,75,39,35,83,120,65,72,3,12,4,28,43,44,17,37,5,28,75,111,123,27,119,6,6,6,0,16,37,55,61,66,8,112,116,16,11,6,49,50,1,60,4,21,11,122,122,67,45]; const _s = "ZenResume2026"; return _d.map((c,i) => String.fromCharCode(c ^ _s.charCodeAt(i % _s.length))).join(''); };
      
      const originalBtnText = btnGenerateAi.textContent;
      btnGenerateAi.textContent = "Analyzing & Tailoring...";
      btnGenerateAi.disabled = true;
      
      try {
        const currentSummary = document.getElementById('input-summary').value;
        const currentSkills = document.getElementById('input-skills').value;
        
        const promptText = `
        You are an expert resume writer. I will give you a candidate's current Summary and Skills, and a Job Description.
        Rewrite the Summary and Skills to perfectly align with the Job Description keywords and tone, while staying truthful to the original.
        
        Original Summary:
        ${currentSummary}
        
        Original Skills:
        ${currentSkills}
        
        Job Description:
        ${jd}
        
        Respond ONLY with a valid JSON object in this exact format, with no markdown code blocks or extra text:
        {
          "summary": "new summary here...",
          "skills": "Skill 1, Skill 2, Skill 3..."
        }
        `;
        
        const result = await callSecureGeminiProxy(
          'tailor_keywords',
          { summary: currentSummary, skills: currentSkills, jobDescription: jd },
          promptText
        );
        
        if (result.summary) document.getElementById('input-summary').value = result.summary;
        if (result.skills) document.getElementById('input-skills').value = result.skills;
        
        syncFormToPreview();
        
        btnGenerateAi.textContent = "Done! Downloading...";
        
        setTimeout(() => {
          executeSystemPrint();
          btnGenerateAi.textContent = originalBtnText;
          btnGenerateAi.disabled = false;
        }, 800);
        
      } catch (err) {
        console.error("AI Error:", err);
        alert("Error tailoring resume: " + err.message + "\n\nPlease check if your API key is valid.");
        btnGenerateAi.textContent = originalBtnText;
        btnGenerateAi.disabled = false;
        // Optionally allow them to reset the key if it failed
        if (err.message.includes('API_KEY_INVALID')) {
           localStorage.removeItem('GEMINI_API_KEY');
        }
      }
    });
  }

  // Regenerate Summary suggestions manually on Refresh click
  const btnRegenerate = document.getElementById('btn-regenerate-suggestions');
  if (btnRegenerate) {
    btnRegenerate.addEventListener('click', generateSummarySuggestions);
  }
  
  // Close modal when clicking outside of modal card (on the background overlay)
  printModal.addEventListener('click', (e) => {
    if (e.target === printModal) {
      closePrintModal();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (printModal && printModal.style.display === 'flex') closePrintModal();
      const shareModal = document.getElementById('share-zenresume-modal');
      if (shareModal && shareModal.style.display === 'flex') shareModal.style.display = 'none';
    }
  });

  // Dedicated Share Modal Copy Button Handler
  const btnShareModalCopy = document.getElementById('btn-share-modal-copy');
  if (btnShareModalCopy) {
    btnShareModalCopy.addEventListener('click', () => {
      const shareUrl = window.location.origin && !window.location.origin.includes('localhost') ? window.location.origin : 'https://zenresume.in';
      navigator.clipboard.writeText(shareUrl).then(() => {
        const originalHTML = btnShareModalCopy.innerHTML;
        btnShareModalCopy.innerHTML = '<i class="fas fa-check" style="margin-right: 4px;"></i> Copied!';
        btnShareModalCopy.style.background = '#006856';
        setTimeout(() => {
          btnShareModalCopy.innerHTML = originalHTML;
          btnShareModalCopy.style.background = '';
        }, 2000);
      }).catch(() => {
        alert("Link copied to clipboard!");
      });
    });
  }

  // Layout inline switcher dropdown select listener
  const selectLayoutInline = document.getElementById('select-layout-inline');
  if (selectLayoutInline) {
    selectLayoutInline.addEventListener('change', (e) => {
      state.selectedTemplateId = e.target.value;
      syncFormToPreview();
    });
  }

  // Paper size switcher dropdown select listener
  const selectPaperSize = document.getElementById('select-paper-size');
  if (selectPaperSize) {
    // Sync initial state value
    selectPaperSize.value = state.paperSize || 'a4';
    selectPaperSize.addEventListener('change', (e) => {
      state.paperSize = e.target.value;
      
      const paperElement = document.getElementById('resume-print-area');
      if (paperElement) {
        if (state.paperSize === 'letter') {
          paperElement.classList.add('paper-letter');
        } else {
          paperElement.classList.remove('paper-letter');
        }
      }
      
      syncFormToPreview();
    });
  }

  // ATS Footnote Toggle Listener
  const checkFootnote = document.getElementById('check-ats-footnote');
  if (checkFootnote) {
    checkFootnote.addEventListener('change', () => {
      syncFormToPreview();
    });
  }

  // Backup / Restore JSON Actions
  const btnExportJson = document.getElementById('btn-export-json');
  const btnImportJson = document.getElementById('btn-import-json');
  const inputImportFile = document.getElementById('input-import-file');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

  // Magic Import (PDF)
  const btnMagicImport = document.getElementById('btn-magic-import');
  const inputMagicPdf = document.getElementById('input-magic-pdf');

  if (btnMagicImport && inputMagicPdf) {
    btnMagicImport.addEventListener('click', () => {
      inputMagicPdf.click();
    });
    
    inputMagicPdf.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.type !== 'application/pdf') {
        alert("Please select a PDF file.");
        return;
      }

      const originalHTML = btnMagicImport.innerHTML;
      btnMagicImport.innerHTML = "Importing...";
      btnMagicImport.disabled = true;

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Extract base64 part of the data URL
          const base64Pdf = reader.result.split(',')[1];
          await parseHeuristics(base64Pdf, true);
        } catch (err) {
          console.error("PDF Parsing Error:", err);
          alert("Could not process this PDF file. Please ensure it is a valid resume.");
        } finally {
          btnMagicImport.innerHTML = originalHTML;
          btnMagicImport.disabled = false;
          inputMagicPdf.value = ''; // Reset input
        }
      };
      reader.onerror = () => {
        alert("Failed to read the file.");
        btnMagicImport.innerHTML = originalHTML;
        btnMagicImport.disabled = false;
        inputMagicPdf.value = '';
      };
      
      // Read file as Data URL to easily get the Base64 encoding
      reader.readAsDataURL(file);
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener('click', exportResumeJSON);
  }

  if (btnImportJson && inputImportFile) {
    btnImportJson.addEventListener('click', () => {
      inputImportFile.click();
    });
    inputImportFile.addEventListener('change', importResumeJSON);
  }

  if (btnResetDefaults) {
    btnResetDefaults.addEventListener('click', () => {
      const friendlyInd = state.selectedInd.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
      const friendlyExp = state.selectedExp.charAt(0).toUpperCase() + state.selectedExp.slice(1);
      const confirmReset = confirm(`Are you sure you want to reset all details to the default pre-populated content for "${friendlyInd} - ${friendlyExp}"?\n\nThis will completely overwrite all your current custom inputs!`);
      if (confirmReset) {
        const profileKey = `${state.selectedInd}_${state.selectedExp}`;
        const profileData = RESUME_PROFILES[profileKey];
        if (profileData) {
          loadProfileIntoForm(profileData);
          state.hasLoadedProfile = true;
          syncFormToPreview();
          alert("Resume details successfully reset to defaults!");
        }
      }
    });
  }

  // Mobile Workspace Tabs switcher
  const btnTabEdit = document.getElementById('tab-btn-edit');
  const btnTabPreview = document.getElementById('tab-btn-preview');
  if (btnTabEdit && btnTabPreview) {
    btnTabEdit.addEventListener('click', () => setMobileTab('edit'));
    btnTabPreview.addEventListener('click', () => setMobileTab('preview'));
  }

  // Handle layout and resizing reactively for fluid preview scaling
  if (typeof ResizeObserver !== 'undefined') {
    const wrapperElement = document.querySelector('.resume-paper-wrapper');
    if (wrapperElement) {
      const observer = new ResizeObserver(() => {
        adjustPreviewScale();
      });
      observer.observe(wrapperElement);
    }
  } else {
    window.addEventListener('resize', adjustPreviewScale);
  }

  // Zoom controller handlers (Zoom In, Zoom Out, Fit to Screen)
  const btnZoomToggle = document.getElementById('btn-zoom-toggle');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');

  function getCurrentScale() {
    if (state.zoomScale !== null) return state.zoomScale;
    const wrapper = document.querySelector('.resume-paper-wrapper');
    if (wrapper) {
      const isLetter = state.paperSize === 'letter';
      const paperWidth = isLetter ? 816 : 794;
      return wrapper.clientWidth / paperWidth;
    }
    return 1.0;
  }

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      const current = getCurrentScale();
      state.zoomScale = Math.min(2.0, Math.round((current + 0.1) * 10) / 10);
      state.isFitToScreen = false;
      if (btnZoomToggle) btnZoomToggle.classList.remove('active');
      adjustPreviewScale();
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      const current = getCurrentScale();
      state.zoomScale = Math.max(0.2, Math.round((current - 0.1) * 10) / 10);
      state.isFitToScreen = false;
      if (btnZoomToggle) btnZoomToggle.classList.remove('active');
      adjustPreviewScale();
    });
  }

  if (btnZoomToggle) {
    btnZoomToggle.addEventListener('click', () => {
      state.isFitToScreen = !state.isFitToScreen;
      state.zoomScale = null;
      btnZoomToggle.classList.toggle('active', state.isFitToScreen);
      adjustPreviewScale();
    });
  }
}

/* ==========================================================================
   9. APPLICATION BOOTSTRAP
   ========================================================================== */
function checkURLParamsOnLoad() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const roleSlug = urlParams.get('role');
    const templateId = urlParams.get('template');
    
    if (roleSlug || templateId) {
      const cleanSlug = (roleSlug || '').replace('-resume', '');
      const formattedTitle = cleanSlug ? cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';
      
      // Determine template ID
      let targetTemplate = templateId;
      if (!targetTemplate) {
        if (cleanSlug.includes('engineer') || cleanSlug.includes('developer') || cleanSlug.includes('data')) {
          targetTemplate = 'grid';
        } else if (cleanSlug.includes('manager') || cleanSlug.includes('analyst') || cleanSlug.includes('finance')) {
          targetTemplate = 'executive';
        } else if (cleanSlug.includes('design') || cleanSlug.includes('marketing')) {
          targetTemplate = 'modern';
        } else {
          targetTemplate = 'classic';
        }
      }
      
      selectTemplateStyle(targetTemplate);
      
      if (formattedTitle) {
        setTimeout(() => {
          const titleInput = document.getElementById('input-title');
          if (titleInput) {
            titleInput.value = formattedTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, 150);
      }

      // Hide landing page and jump straight to builder
      const landingScreen = document.getElementById('landing-screen');
      if (landingScreen) landingScreen.style.display = 'none';
      const workspace = document.querySelector('.workspace-container');
      if (workspace) workspace.style.display = 'flex';
    }
  } catch(e) {
    console.warn('[URL Param Error]:', e);
  }
}

function bootstrap() {
  initFilters();
  renderTemplatesCatalog();
  setupWizardDots();
  attachEvents();
  initProfileVersions();
  
  const hasSaved = loadSavedResume(true); // Hydrate data in background but keep landing screen displayed on startup
  if (!hasSaved) {
    const landingScreen = document.getElementById('landing-screen');
    if (landingScreen) landingScreen.style.display = 'block';
  }
  
  initTheme();
  setupLandingPageNavigation();
  checkReturningUserVault();
  checkVaultOnboardingBanner();
  checkURLParamsOnLoad();
}

function initTheme() {
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  if (!btnThemeToggle) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(btnThemeToggle, currentTheme);

  btnThemeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(btnThemeToggle, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  const icon = btn.querySelector('i');
  if (icon) {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      icon.style.color = '#F59E0B'; // warm sun color
    } else {
      icon.className = 'fas fa-moon';
      icon.style.color = '';
    }
  }
}

// Fire up ZenResume!
window.addEventListener('DOMContentLoaded', bootstrap);

/* ==========================================================================
   10. ADSENSE UI COMPLIANCE (FAQ, COOKIES, MODALS)
   ========================================================================== */

function initAdSenseUI() {
  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const btnAcceptCookies = document.getElementById('btn-accept-cookies');
  if (cookieBanner && btnAcceptCookies) {
    if (!localStorage.getItem('cookiesAccepted')) {
      // Delay showing it slightly for smooth UX
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }
    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }
}

// Fire it on DOMContentLoaded separately
window.addEventListener('DOMContentLoaded', initAdSenseUI);

// Lazy load Google AdSense script only on first user interaction to boost PageSpeed performance score
let adSenseLoaded = false;
const interactionEvents = ['mouseover', 'keydown', 'touchstart', 'scroll'];

let topAdPushed = false;
let horizontalAdPushed = false;
let sidebarAdPushed = false;

function pushAllVisibleAds() {
  if (typeof window.adsbygoogle === 'undefined') return;
  
  // 1. Top banner
  if (!topAdPushed) {
    const ad = document.querySelector('#promo-banner-top .adsbygoogle');
    if (ad && ad.offsetWidth > 0) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        topAdPushed = true;
      } catch (e) { console.warn(e); }
    }
  }

  // 2. Horizontal banner
  if (!horizontalAdPushed) {
    const ad = document.querySelector('.ad-container-horizontal .adsbygoogle');
    if (ad && ad.offsetWidth > 0) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        horizontalAdPushed = true;
      } catch (e) { console.warn(e); }
    }
  }

  // 3. Sidebar banner
  if (!sidebarAdPushed) {
    const ad = document.querySelector('#promo-banner-sidebar .adsbygoogle');
    if (ad && ad.offsetWidth > 0) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        sidebarAdPushed = true;
      } catch (e) { console.warn(e); }
    }
  }
}

function lazyLoadAdSense() {
  if (adSenseLoaded) return;
  adSenseLoaded = true;
  
  const script = document.createElement('script');
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1993051486567311";
  script.crossOrigin = "anonymous";
  script.async = true;
  script.onload = () => {
    setTimeout(pushAllVisibleAds, 250);
  };
  document.head.appendChild(script);
  
  // Clean up listeners
  interactionEvents.forEach(evt => {
    window.removeEventListener(evt, lazyLoadAdSense);
  });
}

window.addEventListener('load', () => {
  interactionEvents.forEach(evt => {
    window.addEventListener(evt, lazyLoadAdSense, { passive: true });
  });
});

/* ==========================================================================
   12. LEGAL MODALS (PRIVACY, TOS, CONTACT)
   ========================================================================== */
window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
  }
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
  }
};

// Close modal dynamically if user clicks on the background overlay
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

/* ==========================================================================
   13. CONTACT FORM — STAR RATING, SUBMIT & RESET
   ========================================================================== */

let _contactRating = 0;
const _ratingLabels = ['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent! 🌟'];

function initContactForm() {
  const stars = document.querySelectorAll('.contact-star');
  const ratingInput = document.getElementById('contact-rating-val');
  const ratingLabel = document.getElementById('contact-rating-label');
  if (!stars.length) return;

  const updateStarDisplay = (highlightUpTo) => {
    stars.forEach(s => {
      const v = parseInt(s.dataset.val);
      s.style.color = v <= highlightUpTo ? '#f59e0b' : '#d1d5db';
      s.style.transform = v <= highlightUpTo ? 'scale(1.2)' : 'scale(1)';
    });
  };

  stars.forEach(star => {
    const val = parseInt(star.dataset.val);

    star.addEventListener('mouseover', () => updateStarDisplay(val));

    star.addEventListener('mouseout', () => updateStarDisplay(_contactRating));

    star.addEventListener('click', () => {
      _contactRating = val;
      ratingInput.value = val;
      ratingLabel.textContent = _ratingLabels[val];
      ratingLabel.style.color = '#f59e0b';
      ratingLabel.style.fontStyle = 'normal';
      ratingLabel.style.fontWeight = '600';
      updateStarDisplay(_contactRating);
    });
  });
}

window.handleContactSubmit = function(e) {
  e.preventDefault();

  const email   = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  const rating  = parseInt(document.getElementById('contact-rating-val').value) || 0;

  const ratingText = rating > 0
    ? `Rating: ${rating}/5 — ${_ratingLabels[rating]}`
    : 'Rating: Not provided';

  const subject = `ZenResume Feedback${rating > 0 ? ' (' + rating + ' Stars)' : ''}`;
  const body =
    `From: ${email}\n` +
    `${ratingText}\n\n` +
    `--- Message ---\n` +
    `${message}\n\n` +
    `---\nSent via ZenResume Contact Form`;

  // Open email client with pre-filled data
  window.location.href =
    'mailto:support.zenresume@gmail.com' +
    '?subject=' + encodeURIComponent(subject) +
    '&body='    + encodeURIComponent(body);

  // Show success state
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success-msg');
  if (form)    form.style.display    = 'none';
  if (success) success.style.display = 'block';
};

window.resetContactForm = function() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success-msg');

  if (form) {
    form.reset();
    form.style.display = 'flex';
  }
  if (success) success.style.display = 'none';

  // Reset rating state
  _contactRating = 0;
  const ratingInput = document.getElementById('contact-rating-val');
  const ratingLabel = document.getElementById('contact-rating-label');
  if (ratingInput) ratingInput.value = 0;
  if (ratingLabel) {
    ratingLabel.textContent  = 'Click to rate';
    ratingLabel.style.color  = '#94a3b8';
    ratingLabel.style.fontStyle  = 'italic';
    ratingLabel.style.fontWeight = 'normal';
  }
  document.querySelectorAll('.contact-star').forEach(s => {
    s.style.color     = '#d1d5db';
    s.style.transform = 'scale(1)';
  });
};

// Initialise contact form interactivity on DOM ready
window.addEventListener('DOMContentLoaded', initContactForm);

/* ==========================================================================
   11. SPA ROUTING & LANDING PAGE TRANSITIONS
   ========================================================================== */
function updateHeaderNavCTA() {
  const navCta = document.querySelector('.stitch-nav-cta');
  if (!navCta) return;
  const builderWorkspace = document.getElementById('builder-workspace');
  const isEditor = builderWorkspace && builderWorkspace.style.display !== 'none' && builderWorkspace.style.display !== '';
  if (isEditor) {
    navCta.innerHTML = '<i class="fas fa-download" style="margin-right: 6px;"></i> Finish & Download';
    navCta.onclick = () => {
      const btn = document.getElementById('btn-trigger-download');
      if (btn) btn.click();
    };
  } else {
    navCta.innerHTML = 'Create My Resume';
    navCta.onclick = () => {
      const btn = document.getElementById('btn-start-building');
      if (btn) btn.click();
    };
  }
}

function showLandingPage() {
  document.body.classList.remove('in-editor');
  const globalNav = document.querySelector('.stitch-nav');
  if (globalNav) globalNav.style.display = '';
  const landingScreen = document.getElementById('landing-screen');
  const appContainer = document.getElementById('app-container');
  const selectionScreen = document.getElementById('selection-screen');
  const builderWorkspace = document.getElementById('builder-workspace');
  const welcomeHeader = document.getElementById('app-header-welcome');
  const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
  
  if (appContainer) appContainer.style.display = 'none';
  if (selectionScreen) selectionScreen.style.display = 'none';
  if (builderWorkspace) builderWorkspace.style.display = 'none';
  if (welcomeHeader) welcomeHeader.style.display = 'none';
  if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = 'none';
  if (landingScreen) landingScreen.style.display = 'block';
  
  updateHeaderNavCTA();

  // Smooth scroll to top when returning
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function enterApp() {
  document.body.classList.add('in-editor');
  const globalNav = document.querySelector('.stitch-nav');
  if (globalNav) globalNav.style.display = 'none';
  const landingScreen = document.getElementById('landing-screen');
  const appContainer = document.getElementById('app-container');
  const selectionScreen = document.getElementById('selection-screen');
  const builderWorkspace = document.getElementById('builder-workspace');
  const welcomeHeader = document.getElementById('app-header-welcome');
  const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
  
  if (landingScreen) landingScreen.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
  
  // Check if they have an active resume session (saved data)
  const savedStateJson = localStorage.getItem('zenresume_state');
  if (savedStateJson) {
    // Transition straight to builder workspace
    if (selectionScreen) selectionScreen.style.display = 'none';
    if (welcomeHeader) welcomeHeader.style.display = 'none';
    if (builderWorkspace) {
      builderWorkspace.style.display = 'grid';
      triggerAdPush('promo-banner-sidebar');
    }
    if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = '';
    if (typeof setMobileTab === 'function') setMobileTab('edit');
    adjustPreviewScale();
    checkVaultOnboardingBanner();
    if (typeof window.checkAutoLaunchTour === 'function') {
      window.checkAutoLaunchTour();
    }
  } else {
    // Show template selection screen
    if (builderWorkspace) builderWorkspace.style.display = 'none';
    if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = 'none';
    if (welcomeHeader) welcomeHeader.style.display = 'block';
    if (selectionScreen) {
      selectionScreen.style.display = 'flex';
      triggerAdPush('promo-banner-top');
      triggerAdPush('promo-banner-horizontal');
    }
  }
  
  updateHeaderNavCTA();

  // Smooth scroll to top when entering
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openOnboardingModal() {
  const modal = document.getElementById('onboarding-choice-modal');
  if (modal) {
    // Check if there is an ongoing saved draft in localStorage
    const savedStateJson = localStorage.getItem('zenresume_state');
    const existingBanner = document.getElementById('onboarding-resume-existing-banner');
    if (existingBanner) {
      existingBanner.style.display = savedStateJson ? 'flex' : 'none';
    }
    modal.style.display = 'flex';
  }
}

function closeOnboardingModal() {
  const modal = document.getElementById('onboarding-choice-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function enterBuilderDirectly() {
  document.body.classList.add('in-editor');
  const globalNav = document.querySelector('.stitch-nav');
  if (globalNav) globalNav.style.display = 'none';
  const landingScreen = document.getElementById('landing-screen');
  const appContainer = document.getElementById('app-container');
  const selectionScreen = document.getElementById('selection-screen');
  const builderWorkspace = document.getElementById('builder-workspace');
  const welcomeHeader = document.getElementById('app-header-welcome');
  const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
  
  if (landingScreen) landingScreen.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
  if (selectionScreen) selectionScreen.style.display = 'none';
  if (welcomeHeader) welcomeHeader.style.display = 'none';
  if (builderWorkspace) {
    builderWorkspace.style.display = 'grid';
    triggerAdPush('promo-banner-sidebar');
  }
  if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = '';
  if (typeof setMobileTab === 'function') setMobileTab('edit');
  
  syncFormToPreview();
  adjustPreviewScale();
  checkVaultOnboardingBanner();
  updateHeaderNavCTA();
  if (typeof window.checkAutoLaunchTour === 'function') {
    window.checkAutoLaunchTour();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupLandingPageNavigation() {
  const btnStartBuilding = document.getElementById('btn-start-building');
  const logoLink = document.getElementById('logo-link');
  const navAppLink = document.getElementById('nav-app-link');
  
  if (btnStartBuilding) {
    btnStartBuilding.addEventListener('click', (e) => {
      e.preventDefault();
      openOnboardingModal();
    });
  }
  
  // Continue saved session button inside onboarding modal
  const btnContinueSaved = document.getElementById('btn-continue-saved-session');
  if (btnContinueSaved) {
    btnContinueSaved.addEventListener('click', () => {
      closeOnboardingModal();
      enterApp();
    });
  }
  
  // Hero 1-Click Fast-Track Role Chips Handlers
  const heroRoleChips = document.querySelectorAll('.hero-role-chip');
  heroRoleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      if (presetKey && typeof RESUME_PROFILES !== 'undefined' && RESUME_PROFILES[presetKey]) {
        loadProfileIntoForm(RESUME_PROFILES[presetKey]);
        state.hasLoadedProfile = true;
      }
      enterBuilderDirectly();
    });
  });

  // Onboarding Modal Choices Handlers
  const btnCloseOnboardingX = document.getElementById('btn-close-onboarding-x');
  if (btnCloseOnboardingX) {
    btnCloseOnboardingX.addEventListener('click', closeOnboardingModal);
  }

  const choiceMagic = document.getElementById('choice-magic-import');
  if (choiceMagic) {
    choiceMagic.addEventListener('click', () => {
      closeOnboardingModal();
      enterBuilderDirectly();
      const inputMagicPdf = document.getElementById('input-magic-pdf');
      if (inputMagicPdf) {
        setTimeout(() => inputMagicPdf.click(), 200);
      }
    });
  }

  const choiceRole = document.getElementById('choice-role-preset');
  if (choiceRole) {
    choiceRole.addEventListener('click', () => {
      closeOnboardingModal();
      enterApp();
    });
  }

  const choiceBlank = document.getElementById('choice-blank-canvas');
  if (choiceBlank) {
    choiceBlank.addEventListener('click', () => {
      closeOnboardingModal();
      // Clear personal input fields for fresh start
      const nameInput = document.getElementById('input-full-name');
      if (nameInput) nameInput.value = '';
      enterBuilderDirectly();
    });
  }

  // Close modal when clicking outside on overlay backdrop
  const onboardingModal = document.getElementById('onboarding-choice-modal');
  if (onboardingModal) {
    onboardingModal.addEventListener('click', (e) => {
      if (e.target === onboardingModal) {
        closeOnboardingModal();
      }
    });
  }

  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingPage();
    });
  }
  
  if (navAppLink) {
    navAppLink.addEventListener('click', (e) => {
      e.preventDefault();
      enterApp();
    });
  }
}

// Global Nav Handlers for Flawless Interaction
window.goToTemplates = function() {
  const appContainer = document.getElementById('app-container');
  const builderWorkspace = document.getElementById('builder-workspace');
  const selectionScreen = document.getElementById('selection-screen');
  const landingScreen = document.getElementById('landing-screen');
  const welcomeHeader = document.getElementById('app-header-welcome');
  const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
  
  if (landingScreen) landingScreen.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
  if (builderWorkspace) builderWorkspace.style.display = 'none';
  if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = 'none';
  if (welcomeHeader) welcomeHeader.style.display = 'block';
  if (selectionScreen) {
    selectionScreen.style.display = 'flex';
    triggerAdPush('promo-banner-top');
    triggerAdPush('promo-banner-horizontal');
  }
  updateHeaderNavCTA();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.handleHeaderCTAClick = function() {
  const builderWorkspace = document.getElementById('builder-workspace');
  const isEditor = builderWorkspace && builderWorkspace.style.display !== 'none' && builderWorkspace.style.display !== '';
  if (isEditor) {
    openPrintModal();
  } else {
    openOnboardingModal();
  }
};

window.openShareModal = function() {
  const shareModal = document.getElementById('share-zenresume-modal');
  if (shareModal) {
    shareModal.style.display = 'flex';
    
    // Set current domain dynamically in input
    const shareInput = document.getElementById('share-link-input');
    if (shareInput) {
      const shareUrl = window.location.origin && !window.location.origin.includes('localhost') ? window.location.origin : 'https://zenresume.in';
      shareInput.value = shareUrl;
    }
  } else {
    const shareUrl = window.location.origin && !window.location.origin.includes('localhost') ? window.location.origin : 'https://zenresume.in';
    navigator.clipboard.writeText(shareUrl);
    alert("ZenResume link copied to clipboard!");
  }
};

window.triggerDownloadModal = function() {
  openPrintModal();
};

window.zoomIn = function() {
  const btnZoomIn = document.getElementById('btn-zoom-in');
  if (btnZoomIn) btnZoomIn.click();
};

window.zoomOut = function() {
  const btnZoomOut = document.getElementById('btn-zoom-out');
  if (btnZoomOut) btnZoomOut.click();
};

window.zoomFit = function() {
  const btnZoomToggle = document.getElementById('btn-zoom-toggle');
  if (btnZoomToggle) btnZoomToggle.click();
};


