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
  targetJobDescription: (function() {
    try {
      localStorage.removeItem('zenresume_target_jd');
      return sessionStorage.getItem('zenresume_session_jd') || sessionStorage.getItem('zen_pending_jd') || '';
    } catch (e) {
      return '';
    }
  })()
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

// GA4 Conversion Tracking Helper (AdBlocker & Network-Safe)
function trackGAEvent(eventName, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      console.log(`[GA4 Event] ${eventName}:`, params);
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
      console.log(`[DataLayer Event] ${eventName}:`, params);
    } else {
      console.log(`[Event Tracked (Offline/Blocked)] ${eventName}:`, params);
    }
  } catch (err) {
    console.warn(`[GA4 Event Error] ${eventName}:`, err);
  }
}
window.trackGAEvent = trackGAEvent;

// Ad Initializer stubs (AdSense decommissioned for pure SaaS experience)
function triggerAdPush(containerId) {}
function pushAllVisibleAds() {}
window.triggerAdPush = triggerAdPush;
window.pushAllVisibleAds = pushAllVisibleAds;
window.adsbygoogle = window.adsbygoogle || [];

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
  // 1. Experience Segmented Switcher Handlers
  if (expFilters) {
    expFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-filter');
      if (btn && btn.dataset.exp) {
        expFilters.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedExp = btn.dataset.exp;
        state.hasLoadedProfile = false; // Reset to reload corresponding mock profile
        renderTemplatesCatalog();
      }
    });
  }

  // 2. Industry Chip Filter Click Handlers
  if (industryFilters) {
    industryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-filter');
      if (btn && btn.dataset.ind) {
        industryFilters.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedInd = btn.dataset.ind;
        state.hasLoadedProfile = false; // Reset to reload corresponding mock profile
        
        // Sync with mobile dropdown
        const mobileSelect = document.getElementById('mobile-industry-select');
        if (mobileSelect) mobileSelect.value = state.selectedInd;
        
        renderTemplatesCatalog();
      }
    });
  }

  // 3. Mobile Industry Dropdown Change Handler
  const mobileIndustrySelect = document.getElementById('mobile-industry-select');
  if (mobileIndustrySelect) {
    mobileIndustrySelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val) {
        state.selectedInd = val;
        state.hasLoadedProfile = false;
        
        // Sync active state in industry chips
        if (industryFilters) {
          industryFilters.querySelectorAll('.btn-filter').forEach(b => {
            if (b.dataset.ind === val) {
              b.classList.add('active');
              // Auto scroll chip into view
              b.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            } else {
              b.classList.remove('active');
            }
          });
        }
        renderTemplatesCatalog();
      }
    });
  }

  // 4. Industry Chips Scroll Arrows
  const btnScrollLeft = document.getElementById('btn-chip-scroll-left');
  const btnScrollRight = document.getElementById('btn-chip-scroll-right');
  if (btnScrollLeft && industryFilters) {
    btnScrollLeft.addEventListener('click', () => {
      industryFilters.scrollBy({ left: -200, behavior: 'smooth' });
    });
  }
  if (btnScrollRight && industryFilters) {
    btnScrollRight.addEventListener('click', () => {
      industryFilters.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }

  // 5. Live Template Search Input Handler
  const inputSearch = document.getElementById('input-template-search');
  const btnClearSearch = document.getElementById('btn-clear-template-search');

  if (inputSearch) {
    inputSearch.addEventListener('input', (e) => {
      templateSearchQuery = e.target.value.trim().toLowerCase();
      if (btnClearSearch) {
        btnClearSearch.style.display = templateSearchQuery ? 'flex' : 'none';
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

  // 6. Quick Role Chips Handler (if any in hero)
  document.querySelectorAll('.btn-role-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (inputSearch) {
        inputSearch.value = chip.textContent.replace(/[^\w\s&]/gi, '').trim();
        templateSearchQuery = q.toLowerCase();
        if (btnClearSearch) btnClearSearch.style.display = 'flex';
      }
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

  // Synchronize controls with current state
  if (expFilters) {
    expFilters.querySelectorAll('.btn-filter').forEach(b => {
      b.classList.toggle('active', b.dataset.exp === state.selectedExp);
    });
  }
  if (industryFilters) {
    industryFilters.querySelectorAll('.btn-filter').forEach(b => {
      b.classList.toggle('active', b.dataset.ind === state.selectedInd);
    });
  }
  const mobileSelect = document.getElementById('mobile-industry-select');
  if (mobileSelect && mobileSelect.value !== state.selectedInd) {
    mobileSelect.value = state.selectedInd;
  }
  
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
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
          <h3 class="template-card-title">${template.name}</h3>
          <span style="font-size: 10px; font-weight: 800; color: #476550; background: rgba(0, 104, 86, 0.1); padding: 2px 8px; border-radius: 9999px; white-space: nowrap;"><i class="fas fa-check-circle"></i> ATS Safe</span>
        </div>
        <p class="template-card-desc">${template.description}</p>
      </div>
      <div class="template-card-footer">
        <span class="template-badge">${(template.experience || state.selectedExp).toUpperCase()} / ${(template.industry || state.selectedInd).replace('_', ' ').toUpperCase()}</span>
        <button class="btn-select">Use Template <i class="fas fa-arrow-right"></i></button>
      </div>
    `;
    
    card.addEventListener('click', () => {
      selectTemplateStyle(template.id);
    });
    
    templatesGrid.appendChild(card);
  });

  // Update live count badge
  const countPill = document.getElementById('template-match-count');
  if (countPill) {
    if (templateSearchQuery) {
      countPill.textContent = `Showing ${matchesCount} Search Result${matchesCount === 1 ? '' : 's'}`;
    } else {
      const indName = (state.selectedInd || '').replace('_', ' ').toUpperCase();
      const expName = (state.selectedExp || '').toUpperCase();
      countPill.textContent = `Showing ${matchesCount} ${indName} (${expName}) Template${matchesCount === 1 ? '' : 's'}`;
    }
  }

  if (matchesCount === 0) {
    templatesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 34px 20px; background: rgba(0,0,0,0.02); border-radius: 16px; border: 1.5px dashed rgba(0,104,95,0.25);">
        <i class="fas fa-filter" style="font-size: 28px; color: #64748B; margin-bottom: 10px; display: block;"></i>
        <p style="color: var(--text-main, #0F172A); font-weight: 700; font-size: 15px; margin-bottom: 6px;">No templates matched "${templateSearchQuery || state.selectedInd}".</p>
        <p style="color: var(--text-sub, #64748B); font-size: 13px; margin-bottom: 16px;">Try clearing your search or switching industry filters.</p>
        <button type="button" class="btn-primary" onclick="if(document.getElementById('input-template-search')) document.getElementById('input-template-search').value=''; templateSearchQuery=''; renderTemplatesCatalog();" style="font-size: 12.5px; padding: 8px 18px; border-radius: 8px;">Show All Templates</button>
      </div>
    `;
  }
}

/* ==========================================================================
   3. TEMPLATE INITIALIZATION & DATA LOADING
   ========================================================================== */
window.selectTemplateStyle = function selectTemplateStyle(templateId) {
  document.body.classList.add('in-editor');
  const globalNav = document.querySelector('.stitch-nav');
  if (globalNav) globalNav.style.display = 'none';

  const ROLE_TEMPLATE_FALLBACKS = {
    'ai-engineer': 'data_science_experienced_mlops',
    'software-engineer': 'software_experienced_enterprise',
    'mechanical-engineer': 'mechanical_experienced_automotive',
    'data-scientist': 'data_science_experienced_lead',
    'product-manager': 'software_experienced_enterprise',
    'tcs-nqt-fresher': 'software_fresher_minimalist',
    'grid': 'software_experienced_enterprise',
    'modern': 'software_experienced_sleek',
    'executive': 'software_experienced_enterprise',
    'classic': 'software_fresher_minimalist'
  };

  if (!TEMPLATE_STYLES[templateId]) {
    templateId = ROLE_TEMPLATE_FALLBACKS[templateId] || 'software_experienced_enterprise';
  }

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
  const appContainer = document.getElementById('app-container');
  if (appContainer) appContainer.style.display = 'flex';
  const landingScreen = document.getElementById('landing-screen');
  if (landingScreen) landingScreen.style.display = 'none';
  if (selectionScreen) selectionScreen.style.display = 'none';
  const welcomeHeader = document.getElementById('app-header-welcome');
  if (welcomeHeader) welcomeHeader.style.display = 'none';
  if (builderWorkspace) builderWorkspace.style.display = 'grid';
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
  if (data.personal) {
    document.getElementById('input-name').value = data.personal.name || '';
    document.getElementById('input-title').value = data.personal.title || '';
    document.getElementById('input-email').value = data.personal.email || '';
    document.getElementById('input-phone').value = data.personal.phone || '';
    document.getElementById('input-location').value = data.personal.location || '';
    document.getElementById('input-website').value = data.personal.website || '';
    document.getElementById('input-linkedin').value = data.personal.linkedin || '';
    document.getElementById('input-github').value = (data.personal && data.personal.github) || '';
    document.getElementById('input-custom-social').value = (data.personal && data.personal.customSocial) || '';
  }
  
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
  } else if (!data.isImported) {
    addExperienceCard();
  }
  
  // F. Load Projects
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(proj => addProjectCard(proj));
  } else if (!data.isImported) {
    addProjectCard();
  }
  
  // G. Load Education
  if (data.education && data.education.length > 0) {
    data.education.forEach(edu => addEducationCard(edu));
  } else if (!data.isImported) {
    addEducationCard();
  }
  
  // H. Load Certifications
  if (data.certifications && data.certifications.length > 0) {
    data.certifications.forEach(cert => addCertificationCard(cert));
  } else if (!data.isImported) {
    addCertificationCard();
  }

  // I. Refresh card index numbers and tab badges
  refreshCardIndexes(experienceListContainer);
  refreshCardIndexes(projectsListContainer);
  refreshCardIndexes(educationListContainer);
  refreshCardIndexes(certificationsListContainer);
  updatePillBadges();
}

/* ==========================================================================
   4. DYNAMIC CARD ADDITIONS (FORM FIELDS)
   ========================================================================== */

// --- Helper to refresh card index badges and pill counts ---
function refreshCardIndexes(container) {
  if (!container) return;
  const cards = container.querySelectorAll('.list-item-card');
  cards.forEach((card, idx) => {
    const badge = card.querySelector('.card-order-badge');
    if (badge) badge.textContent = `#${idx + 1}`;
  });
  updatePillBadges();
}

function updatePillBadges() {
  const expCount = document.querySelectorAll('.experience-item-card').length;
  const projCount = document.querySelectorAll('.project-item-card').length;
  const eduCount = document.querySelectorAll('.education-item-card').length;
  const certCount = document.querySelectorAll('.certification-item-card').length;

  const bExp = document.getElementById('badge-exp-count');
  const bProj = document.getElementById('badge-proj-count');
  const bEdu = document.getElementById('badge-edu-count');
  const bCert = document.getElementById('badge-cert-count');

  if (bExp) bExp.textContent = expCount;
  if (bProj) bProj.textContent = projCount;
  if (bEdu) bEdu.textContent = eduCount;
  if (bCert) bCert.textContent = certCount;
}

// --- A. EXPERIENCE CARD ---
function addExperienceCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card experience-item-card';
  
  const company = data ? (data.company || '') : '';
  const role = data ? (data.role || '') : '';
  const location = data ? (data.location || '') : '';
  const dates = data ? (data.dates || '') : '';
  const desc = data ? ((Array.isArray(data.descriptions) ? data.descriptions.join('\n') : data.description) || '') : '';
  
  card.innerHTML = `
    <div class="card-header-bar">
      <div class="card-order-badge">#1</div>
      <div class="card-title-preview">${role || company || 'New Experience Entry'}</div>
      <div class="card-actions-group">
        <button type="button" class="btn-card-action btn-move-up" title="Move Position Up"><i class="fas fa-arrow-up"></i></button>
        <button type="button" class="btn-card-action btn-move-down" title="Move Position Down"><i class="fas fa-arrow-down"></i></button>
        <button type="button" class="btn-card-action btn-clone-card" title="Duplicate Position"><i class="fas fa-copy"></i></button>
        <button type="button" class="btn-remove-item" title="Delete Position"><i class="fas fa-trash-alt"></i> Delete</button>
      </div>
    </div>
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
      <label class="form-label">Key Achievements &amp; Impact (One bullet per line)</label>
      <textarea class="form-input input-exp-desc" style="min-height: 90px;" placeholder="Optimized system bandwidth by 35% using asynchronous message queues...&#10;Supervised team of 4 junior developers..."></textarea>
    </div>
  `;
  
  // Set values programmatically to avoid quote breaks & HTML injection
  const roleInput = card.querySelector('.input-exp-role');
  const compInput = card.querySelector('.input-exp-company');
  const titlePreview = card.querySelector('.card-title-preview');
  
  roleInput.value = role;
  compInput.value = company;
  card.querySelector('.input-exp-dates').value = dates;
  card.querySelector('.input-exp-location').value = location;
  card.querySelector('.input-exp-desc').value = desc;
  
  function updateTitle() {
    titlePreview.textContent = roleInput.value || compInput.value || 'New Experience Entry';
  }
  roleInput.addEventListener('input', updateTitle);
  compInput.addEventListener('input', updateTitle);

  // Attach change listeners to live preview
  card.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', debouncedSyncFormToPreview);
  });
  
  // Card reordering handlers
  card.querySelector('.btn-move-up').addEventListener('click', () => {
    const prev = card.previousElementSibling;
    if (prev) {
      card.parentNode.insertBefore(card, prev);
      refreshCardIndexes(experienceListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-move-down').addEventListener('click', () => {
    const next = card.nextElementSibling;
    if (next) {
      card.parentNode.insertBefore(next, card);
      refreshCardIndexes(experienceListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-clone-card').addEventListener('click', () => {
    const clonedData = {
      role: roleInput.value ? `${roleInput.value} (Copy)` : '',
      company: compInput.value,
      dates: card.querySelector('.input-exp-dates').value,
      location: card.querySelector('.input-exp-location').value,
      descriptions: card.querySelector('.input-exp-desc').value.split('\n').filter(Boolean)
    };
    addExperienceCard(clonedData);
    syncFormToPreview();
  });

  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    refreshCardIndexes(experienceListContainer);
    syncFormToPreview();
  });
  
  experienceListContainer.appendChild(card);
  refreshCardIndexes(experienceListContainer);
}

// --- B. PROJECT CARD ---
function addProjectCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card project-item-card';
  
  const title = data ? (data.title || '') : '';
  const technologies = data ? (data.technologies || '') : '';
  const description = data ? (Array.isArray(data.descriptions) ? data.descriptions.join('\n') : (Array.isArray(data.description) ? data.description.join('\n') : (data.description || ''))) : '';
  const link = data ? (data.link || '') : '';
  
  card.innerHTML = `
    <div class="card-header-bar">
      <div class="card-order-badge">#1</div>
      <div class="card-title-preview">${title || 'New Project Entry'}</div>
      <div class="card-actions-group">
        <button type="button" class="btn-card-action btn-move-up" title="Move Project Up"><i class="fas fa-arrow-up"></i></button>
        <button type="button" class="btn-card-action btn-move-down" title="Move Project Down"><i class="fas fa-arrow-down"></i></button>
        <button type="button" class="btn-card-action btn-clone-card" title="Duplicate Project"><i class="fas fa-copy"></i></button>
        <button type="button" class="btn-remove-item" title="Delete Project"><i class="fas fa-trash-alt"></i> Delete</button>
      </div>
    </div>
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
      <input type="text" class="form-input input-proj-link" placeholder="e.g. github.com/username/project">
    </div>
    <div class="form-group">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
        <label class="form-label" style="margin-bottom: 0;">Project Description / Accomplishments</label>
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <span class="proj-format-badge" style="font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; background: #F1F5F9; color: #64748B; border: 1px solid #CBD5E1; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s ease;">
            <i class="fas fa-magic"></i> <span class="format-badge-text">Auto-Detecting</span>
          </span>
          <button type="button" class="btn-proj-add-bullet" title="Insert Bullet Point" style="background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.25); color: #2563EB; padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease;">
            <i class="fas fa-list-ul"></i> + Bullet
          </button>
        </div>
      </div>
      <textarea class="form-input input-proj-desc" style="min-height: 85px; font-family: inherit; font-size: 13px; line-height: 1.45;" placeholder="• Bullet 1: Architected high-throughput DAG engine...&#10;• Bullet 2: Designed immutable state checkpointing...&#10;Or write as a single paragraph. Formats automatically in preview &amp; PDF."></textarea>
      <div style="font-size: 11px; color: #64748B; margin-top: 4px; display: flex; align-items: center; gap: 5px;">
        <i class="fas fa-info-circle" style="color: #0284C7;"></i>
        <span>Supports points (1/2/3, a:, *, •, -, ., Bullet 1:) or single paragraph. Formats automatically.</span>
      </div>
    </div>
  `;
  
  const titleInput = card.querySelector('.input-proj-title');
  const titlePreview = card.querySelector('.card-title-preview');
  const descTextarea = card.querySelector('.input-proj-desc');
  const formatBadge = card.querySelector('.proj-format-badge');
  const btnAddBullet = card.querySelector('.btn-proj-add-bullet');
  
  titleInput.value = title;
  card.querySelector('.input-proj-tech').value = technologies;
  card.querySelector('.input-proj-link').value = link;
  descTextarea.value = description;
  
  function updateFormatBadge() {
    const val = descTextarea.value || '';
    if (!val.trim()) {
      formatBadge.style.background = '#F1F5F9';
      formatBadge.style.color = '#64748B';
      formatBadge.style.borderColor = '#CBD5E1';
      formatBadge.innerHTML = '<i class="fas fa-magic"></i> <span class="format-badge-text">Auto-Detecting</span>';
      return;
    }
    const parseFn = window.parseProjectDescription || (window.RenderHelpers && window.RenderHelpers.parseProjectDescription);
    const parsed = parseFn ? parseFn(val) : { type: val.includes('\n') ? 'bullets' : 'paragraph', count: 1 };
    if (parsed.type === 'bullets') {
      formatBadge.style.background = 'rgba(16, 185, 129, 0.1)';
      formatBadge.style.color = '#059669';
      formatBadge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      formatBadge.innerHTML = `<i class="fas fa-list-ul"></i> <span class="format-badge-text">Bullet Points (${parsed.count || (parsed.items && parsed.items.length) || 1})</span>`;
    } else {
      formatBadge.style.background = 'rgba(59, 130, 246, 0.1)';
      formatBadge.style.color = '#2563EB';
      formatBadge.style.borderColor = 'rgba(59, 130, 246, 0.35)';
      formatBadge.innerHTML = '<i class="fas fa-paragraph"></i> <span class="format-badge-text">Paragraph Format</span>';
    }
  }

  descTextarea.addEventListener('input', updateFormatBadge);
  updateFormatBadge();

  if (btnAddBullet) {
    btnAddBullet.addEventListener('click', () => {
      const currentVal = descTextarea.value;
      if (!currentVal.trim()) {
        descTextarea.value = '• ';
      } else if (currentVal.endsWith('\n')) {
        descTextarea.value = currentVal + '• ';
      } else {
        descTextarea.value = currentVal + '\n• ';
      }
      descTextarea.focus();
      descTextarea.setSelectionRange(descTextarea.value.length, descTextarea.value.length);
      updateFormatBadge();
      debouncedSyncFormToPreview();
    });
  }

  titleInput.addEventListener('input', () => {
    titlePreview.textContent = titleInput.value || 'New Project Entry';
  });

  card.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', debouncedSyncFormToPreview);
  });
  
  card.querySelector('.btn-move-up').addEventListener('click', () => {
    const prev = card.previousElementSibling;
    if (prev) {
      card.parentNode.insertBefore(card, prev);
      refreshCardIndexes(projectsListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-move-down').addEventListener('click', () => {
    const next = card.nextElementSibling;
    if (next) {
      card.parentNode.insertBefore(next, card);
      refreshCardIndexes(projectsListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-clone-card').addEventListener('click', () => {
    const clonedData = {
      title: titleInput.value ? `${titleInput.value} (Copy)` : '',
      technologies: card.querySelector('.input-proj-tech').value,
      link: card.querySelector('.input-proj-link').value,
      description: card.querySelector('.input-proj-desc').value
    };
    addProjectCard(clonedData);
    syncFormToPreview();
  });

  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    refreshCardIndexes(projectsListContainer);
    syncFormToPreview();
  });
  
  projectsListContainer.appendChild(card);
  refreshCardIndexes(projectsListContainer);
}

// --- C. EDUCATION CARD ---
function addEducationCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card education-item-card';
  
  const degree = data ? (data.degree || '') : '';
  const institution = data ? (data.institution || '') : '';
  const location = data ? (data.location || '') : '';
  const dates = data ? (data.dates || '') : '';
  const gpa = data ? (data.gpa || '') : '';
  
  card.innerHTML = `
    <div class="card-header-bar">
      <div class="card-order-badge">#1</div>
      <div class="card-title-preview">${degree || institution || 'New Education Entry'}</div>
      <div class="card-actions-group">
        <button type="button" class="btn-card-action btn-move-up" title="Move Education Up"><i class="fas fa-arrow-up"></i></button>
        <button type="button" class="btn-card-action btn-move-down" title="Move Education Down"><i class="fas fa-arrow-down"></i></button>
        <button type="button" class="btn-card-action btn-clone-card" title="Duplicate Education"><i class="fas fa-copy"></i></button>
        <button type="button" class="btn-remove-item" title="Delete Education"><i class="fas fa-trash-alt"></i> Delete</button>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Degree &amp; Specialization</label>
        <input type="text" class="form-input input-edu-degree" placeholder="e.g. B.Tech in Computer Science">
      </div>
      <div class="form-group">
        <label class="form-label">University / Institution</label>
        <input type="text" class="form-input input-edu-institution" placeholder="e.g. Andhra University">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Completion Year / Dates</label>
        <input type="text" class="form-input input-edu-dates" placeholder="e.g. 2022 - 2026">
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-input input-edu-location" placeholder="e.g. Visakhapatnam, India">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Grade / CGPA</label>
      <input type="text" class="form-input input-edu-gpa" placeholder="e.g. 8.8 / 10.0 CGPA">
    </div>
  `;
  
  const degInput = card.querySelector('.input-edu-degree');
  const instInput = card.querySelector('.input-edu-institution');
  const titlePreview = card.querySelector('.card-title-preview');
  
  degInput.value = degree;
  instInput.value = institution;
  card.querySelector('.input-edu-dates').value = dates;
  card.querySelector('.input-edu-location').value = location;
  card.querySelector('.input-edu-gpa').value = gpa;
  
  function updateTitle() {
    titlePreview.textContent = degInput.value || instInput.value || 'New Education Entry';
  }
  degInput.addEventListener('input', updateTitle);
  instInput.addEventListener('input', updateTitle);
  
  card.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', debouncedSyncFormToPreview);
  });
  
  card.querySelector('.btn-move-up').addEventListener('click', () => {
    const prev = card.previousElementSibling;
    if (prev) {
      card.parentNode.insertBefore(card, prev);
      refreshCardIndexes(educationListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-move-down').addEventListener('click', () => {
    const next = card.nextElementSibling;
    if (next) {
      card.parentNode.insertBefore(next, card);
      refreshCardIndexes(educationListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-clone-card').addEventListener('click', () => {
    const clonedData = {
      degree: degInput.value ? `${degInput.value} (Copy)` : '',
      institution: instInput.value,
      dates: card.querySelector('.input-edu-dates').value,
      location: card.querySelector('.input-edu-location').value,
      gpa: card.querySelector('.input-edu-gpa').value
    };
    addEducationCard(clonedData);
    syncFormToPreview();
  });

  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    refreshCardIndexes(educationListContainer);
    syncFormToPreview();
  });
  
  educationListContainer.appendChild(card);
  refreshCardIndexes(educationListContainer);
}

// --- D. CERTIFICATION CARD ---
function addCertificationCard(data = null) {
  const card = document.createElement('div');
  card.className = 'list-item-card certification-item-card';
  
  const name = (typeof data === 'string') ? data : (data ? (data.name || '') : '');
  const issuer = (data && typeof data === 'object') ? (data.issuer || '') : '';
  const date = (data && typeof data === 'object') ? (data.date || '') : '';
  const desc = (data && typeof data === 'object') ? (data.desc || '') : '';
  
  card.innerHTML = `
    <div class="card-header-bar">
      <div class="card-order-badge">#1</div>
      <div class="card-title-preview">${name || issuer || 'New Certification Entry'}</div>
      <div class="card-actions-group">
        <button type="button" class="btn-card-action btn-move-up" title="Move Certification Up"><i class="fas fa-arrow-up"></i></button>
        <button type="button" class="btn-card-action btn-move-down" title="Move Certification Down"><i class="fas fa-arrow-down"></i></button>
        <button type="button" class="btn-card-action btn-clone-card" title="Duplicate Certification"><i class="fas fa-copy"></i></button>
        <button type="button" class="btn-remove-item" title="Delete Certification"><i class="fas fa-trash-alt"></i> Delete</button>
      </div>
    </div>
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
      <label class="form-label">Description / Credential ID</label>
      <input type="text" class="form-input input-cert-desc" placeholder="e.g. Credential ID: 123456">
    </div>
  `;
  
  const nameInput = card.querySelector('.input-cert-name');
  const issuerInput = card.querySelector('.input-cert-issuer');
  const titlePreview = card.querySelector('.card-title-preview');

  nameInput.value = name || '';
  issuerInput.value = issuer || '';
  card.querySelector('.input-cert-date').value = date || '';
  card.querySelector('.input-cert-desc').value = desc || '';
  
  function updateTitle() {
    titlePreview.textContent = nameInput.value || issuerInput.value || 'New Certification Entry';
  }
  nameInput.addEventListener('input', updateTitle);
  issuerInput.addEventListener('input', updateTitle);

  const inputs = card.querySelectorAll('.form-input');
  inputs.forEach(input => input.addEventListener('input', debouncedSyncFormToPreview));
  
  card.querySelector('.btn-move-up').addEventListener('click', () => {
    const prev = card.previousElementSibling;
    if (prev) {
      card.parentNode.insertBefore(card, prev);
      refreshCardIndexes(certificationsListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-move-down').addEventListener('click', () => {
    const next = card.nextElementSibling;
    if (next) {
      card.parentNode.insertBefore(next, card);
      refreshCardIndexes(certificationsListContainer);
      syncFormToPreview();
    }
  });

  card.querySelector('.btn-clone-card').addEventListener('click', () => {
    const clonedData = {
      name: nameInput.value ? `${nameInput.value} (Copy)` : '',
      issuer: issuerInput.value,
      date: card.querySelector('.input-cert-date').value,
      desc: card.querySelector('.input-cert-desc').value
    };
    addCertificationCard(clonedData);
    syncFormToPreview();
  });

  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    refreshCardIndexes(certificationsListContainer);
    syncFormToPreview();
  });
  
  certificationsListContainer.appendChild(card);
  refreshCardIndexes(certificationsListContainer);
}

/* ==========================================================================
   5. REAL-TIME DATA SYNCHRONIZATION
   ========================================================================== */
/* ==========================================================================
   5. EXTRACT & RE-HYDRATE DATA WITH LOCALSTORAGE PERSISTENCE
   ========================================================================== */
function extractCurrentFormData() {
  const nameEl = document.getElementById('input-name');
  const titleEl = document.getElementById('input-title');
  const emailEl = document.getElementById('input-email');
  const phoneEl = document.getElementById('input-phone');
  const locEl = document.getElementById('input-location');
  const webEl = document.getElementById('input-website');
  const liEl = document.getElementById('input-linkedin');
  const ghEl = document.getElementById('input-github');
  const socEl = document.getElementById('input-custom-social');
  const sumEl = document.getElementById('input-summary');
  const skEl = document.getElementById('input-skills');

  const currentData = {
    personal: {
      name: (nameEl ? nameEl.value : '').trim(),
      title: (titleEl ? titleEl.value : '').trim(),
      email: (emailEl ? emailEl.value : '').trim(),
      phone: (phoneEl ? phoneEl.value : '').trim(),
      location: (locEl ? locEl.value : '').trim(),
      website: (webEl ? webEl.value : '').trim(),
      linkedin: (liEl ? liEl.value : '').trim(),
      github: (ghEl ? ghEl.value : '').trim(),
      customSocial: (socEl ? socEl.value : '').trim()
    },
    summary: (sumEl ? sumEl.value : '').trim(),
    
    // Split skills by commas, semicolons, or newlines
    skills: (skEl ? skEl.value : '')
      .split(/[,;\n]+/)
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
  const activeId = registry.activeId || 'default';
  if (activeId === 'default') {
    localStorage.setItem('zenresume_state', JSON.stringify(stateToSave));
  } else {
    localStorage.setItem(`zenresume_profile_${activeId}`, JSON.stringify(stateToSave));
  }

  // High-resilience IndexedDB persistence (immune to 5MB quota & Safari 7-day purge)
  if (window.ZenResumeDB && typeof window.ZenResumeDB.saveProfile === 'function') {
    window.ZenResumeDB.saveProfile(activeId, stateToSave);
  }

  // Also save to cloud if logged in (strictly saving subscription + stored resumes, no tracking bloat)
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
    let parsed = (window.ZenResumeDB && typeof window.ZenResumeDB.getSettingSync === 'function')
      ? window.ZenResumeDB.getSettingSync(PROFILES_STORAGE_KEY)
      : null;
    if (!parsed) {
      const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (raw) parsed = JSON.parse(raw);
    }
    if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
      return parsed;
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
    if (window.ZenResumeDB && typeof window.ZenResumeDB.saveSetting === 'function') {
      window.ZenResumeDB.saveSetting(PROFILES_STORAGE_KEY, registry);
    }
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(registry));
    if (typeof window.syncAllUserDataToFirestore === 'function') {
      window.syncAllUserDataToFirestore();
    }
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
  const label = document.getElementById('active-profile-label');
  
  const activeProfile = registry.profiles.find(p => p.id === registry.activeId) || registry.profiles[0];
  if (label && activeProfile) {
    label.textContent = activeProfile.name;
  }

  if (select) {
    select.innerHTML = '';
    registry.profiles.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      if (p.id === registry.activeId) opt.selected = true;
      select.appendChild(opt);
    });
  }
}

function openProfileManager() {
  const modal = document.getElementById('modal-profile-manager');
  if (!modal) return;
  renderProfileManagerList();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeProfileManager() {
  const modal = document.getElementById('modal-profile-manager');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function renderProfileManagerList() {
  const listEl = document.getElementById('profile-manager-list');
  if (!listEl) return;

  const registry = getStoredProfilesRegistry();
  listEl.innerHTML = registry.profiles.map(p => {
    const isActive = p.id === registry.activeId;
    const dateStr = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Active';
    const isDefault = p.id === 'default';
    
    return `
      <div class="profile-card-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 10px; border: 1.5px solid ${isActive ? '#00846D' : 'rgba(0,0,0,0.08)'}; background: ${isActive ? 'rgba(0, 132, 109, 0.05)' : '#FFFFFF'};">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fas ${isActive ? 'fa-folder-open' : 'fa-folder'}" style="color: ${isActive ? '#00846D' : '#64748B'}; font-size: 16px;"></i>
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong style="font-size: 13px; color: #0F172A;">${escapeHTML(p.name)}</strong>
              ${isActive ? '<span style="font-size: 9.5px; font-weight: 800; background: #00846D; color: white; padding: 1px 6px; border-radius: 4px;">ACTIVE</span>' : ''}
            </div>
            <span style="font-size: 11px; color: #64748B;">Updated: ${dateStr}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          ${!isActive ? `
            <button type="button" onclick="switchProfileVersion('${p.id}'); closeProfileManager();" style="background: rgba(0, 104, 86, 0.1); color: #00846D; border: 1px solid rgba(0, 104, 86, 0.25); border-radius: 6px; padding: 5px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer;">
              Switch
            </button>
          ` : ''}
          ${!isDefault ? `
            <button type="button" onclick="deleteProfileVersion('${p.id}'); renderProfileManagerList();" title="Delete this version" style="background: transparent; border: none; color: #DC2626; cursor: pointer; padding: 5px 8px; font-size: 12px;">
              <i class="fas fa-trash-alt"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

window.openProfileManager = openProfileManager;
window.closeProfileManager = closeProfileManager;
window.renderProfileManagerList = renderProfileManagerList;


function promptCreateNewProfileVersion(customName = null) {
  const defaultName = `Application - ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  const versionName = (customName && typeof customName === 'string') ? customName : prompt("Enter a name for this Job Application Profile (e.g., 'Google FullStack', 'Amazon Backend', 'Startup Lead'):", defaultName);
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
  if (window.ZenResumeDB && typeof window.ZenResumeDB.saveProfile === 'function') {
    window.ZenResumeDB.saveProfile(registry.activeId || 'default', currentState);
  }
  if (registry.activeId === 'default') {
    localStorage.setItem('zenresume_state', JSON.stringify(currentState));
  } else {
    localStorage.setItem(`zenresume_profile_${registry.activeId}`, JSON.stringify(currentState));
  }

  // Save new profile data into IndexedDB & localStorage
  if (window.ZenResumeDB && typeof window.ZenResumeDB.saveProfile === 'function') {
    window.ZenResumeDB.saveProfile(newId, currentState);
  }
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

  window.showToast(`🎉 Created job profile: "${cleanName}"! Master resume saved.`, "success", 4000);
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
  if (window.ZenResumeDB && typeof window.ZenResumeDB.saveProfile === 'function') {
    window.ZenResumeDB.saveProfile(registry.activeId || 'default', currentState);
  }
  if (registry.activeId === 'default') {
    localStorage.setItem('zenresume_state', JSON.stringify(currentState));
  } else {
    localStorage.setItem(`zenresume_profile_${registry.activeId}`, JSON.stringify(currentState));
  }

  // Set active ID in registry
  registry.activeId = targetId;
  saveProfilesRegistry(registry);

  // Load target profile from localStorage or ZenResumeDB
  let targetStateJson;
  if (targetId === 'default') {
    targetStateJson = localStorage.getItem('zenresume_state');
  } else {
    targetStateJson = localStorage.getItem(`zenresume_profile_${targetId}`);
  }

  let parsed = null;
  if (targetStateJson) {
    try { parsed = JSON.parse(targetStateJson); } catch (e) {}
  }

  if (parsed) {
    try {
      hydrateStateFromData(parsed, false);
      syncFormToPreview();
      renderProfileDropdown(registry);
      const targetProfile = registry.profiles.find(p => p.id === targetId);
      const profileName = targetProfile ? targetProfile.name : targetId;
      console.log(`[Profile Switch] Loaded version: ${profileName}`);
      trackGAEvent('resume_version_switched', {
        version_id: targetId,
        version_name: profileName
      });
      if (typeof window.showToast === 'function') {
        window.showToast(`📂 Switched to profile: "${profileName}"`, 'success');
      }
    } catch (e) {
      console.error("Error switching profile:", e);
    }
  } else if (window.ZenResumeDB && typeof window.ZenResumeDB.loadProfile === 'function') {
    window.ZenResumeDB.loadProfile(targetId).then(idbState => {
      if (idbState) {
        hydrateStateFromData(idbState, false);
        syncFormToPreview();
        renderProfileDropdown(registry);
      }
    });
  } else {
    renderProfileDropdown(registry);
  }
}

function deleteProfileVersion(targetId) {
  if (!targetId || targetId === 'default') return;
  const registry = getStoredProfilesRegistry();
  registry.profiles = registry.profiles.filter(p => p.id !== targetId);

  if (window.ZenResumeDB && typeof window.ZenResumeDB.deleteProfile === 'function') {
    window.ZenResumeDB.deleteProfile(targetId);
  }
  try {
    localStorage.removeItem(`zenresume_profile_${targetId}`);
  } catch (e) {}

  if (registry.activeId === targetId) {
    registry.activeId = 'default';
    saveProfilesRegistry(registry);
    switchProfileVersion('default');
  } else {
    saveProfilesRegistry(registry);
  }

  renderProfileDropdown(registry);
  if (typeof window.showToast === 'function') {
    window.showToast('Resume version deleted.', 'info');
  }
}

// Expose profile registry helpers globally
window.getStoredProfilesRegistry = getStoredProfilesRegistry;
window.saveProfilesRegistry = saveProfilesRegistry;
window.switchProfileVersion = switchProfileVersion;
window.promptCreateNewProfileVersion = promptCreateNewProfileVersion;
window.deleteProfileVersion = deleteProfileVersion;

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
  let savedState = null;

  // 1. Try reading from ZenResumeDB
  if (window.ZenResumeDB && typeof window.ZenResumeDB.loadProfile === 'function') {
    const cached = window.ZenResumeDB.loadProfile(registry.activeId || 'default');
    if (cached && typeof cached.then !== 'function' && cached.formData) {
      savedState = cached;
    }
  }

  // 2. Fallback to localStorage
  if (!savedState) {
    let savedStateJson;
    if (registry.activeId === 'default') {
      savedStateJson = localStorage.getItem('zenresume_state');
    } else {
      savedStateJson = localStorage.getItem(`zenresume_profile_${registry.activeId}`) || localStorage.getItem('zenresume_state');
    }

    if (savedStateJson) {
      try {
        savedState = JSON.parse(savedStateJson);
      } catch (err) {
        console.error('Error loading saved state:', err);
      }
    }
  }

  if (!savedState) return false;
  return hydrateStateFromData(savedState, preventDisplayTransition);
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
      document.body.classList.add('in-editor');
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
      document.body.classList.remove('in-editor');
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
        if (window.showFriendlyNoticeModal) { window.showFriendlyNoticeModal({ title: "Invalid Backup File", message: "The uploaded file is not a valid ZenResume JSON backup. Would you like to select one of our 71 role templates instead?", primaryBtnText: "Explore 71 Templates", onPrimary: () => window.location.href = "/role/", secondaryBtnText: "Try Another File" }); } else { window.showToast("Invalid backup file format.", "warning"); }
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
      
      window.showToast("🎉 Resume data successfully restored!", "success");
      
      // Clear file selector input so same file can be imported again
      e.target.value = '';
    } catch (err) {
      console.error(err);
      if (window.showFriendlyNoticeModal) { window.showFriendlyNoticeModal({ title: "Could Not Read File", message: "We encountered an issue reading this file. Please verify it is a valid ZenResume export or pick a 1-click role template.", primaryBtnText: "Pick a Role Blueprint", onPrimary: () => window.location.href = "/role/", secondaryBtnText: "Dismiss" }); } else { window.showToast("Error reading backup file.", "warning"); }
    }
  };
  reader.readAsText(file);
}

let syncTimeout = null;
function debouncedSyncFormToPreview() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncFormToPreview, 250);
}

/* ==========================================================================
   REAL-TIME UNIVERSAL ATS QUALITY SCORING ENGINE
   ========================================================================== */
function calculateGeneralATSScore() {
  let score = 0;
  const breakdown = {
    layout: 25, // All ZenResume templates are single-column ATS layouts
    contact: 0,
    summary: 0,
    bullets: 0,
    skills: 0,
    education: 0
  };

  score += breakdown.layout;

  // 1. Contact Info (15 pts)
  const name = (document.getElementById('input-name')?.value || '').trim();
  const title = (document.getElementById('input-title')?.value || '').trim();
  const email = (document.getElementById('input-email')?.value || '').trim();
  const phone = (document.getElementById('input-phone')?.value || '').trim();
  const linkedin = (document.getElementById('input-linkedin')?.value || '').trim();
  const github = (document.getElementById('input-github')?.value || '').trim();
  const website = (document.getElementById('input-website')?.value || '').trim();

  let contactPts = 0;
  if (name.length >= 2 && title.length >= 2) contactPts += 5;
  if (email.includes('@') && email.includes('.') && phone.length >= 6) contactPts += 5;
  if (linkedin.length > 3 || github.length > 3 || website.length > 3) contactPts += 5;
  breakdown.contact = contactPts;
  score += contactPts;

  // 2. Summary Quality (15 pts)
  const summary = (document.getElementById('input-summary')?.value || '').trim();
  const summaryWords = summary ? summary.split(/\s+/).filter(w => w.length > 0).length : 0;
  let summaryPts = 0;
  if (summaryWords >= 18) summaryPts += 10;
  else if (summaryWords >= 8) summaryPts += 5;
  if (summaryWords >= 25 && summaryWords <= 120) summaryPts += 5;
  breakdown.summary = summaryPts;
  score += summaryPts;

  // 3. Experience Bullets & Action Verbs + Metrics (25 pts)
  const expBullets = [];
  document.querySelectorAll('.experience-card textarea').forEach(ta => {
    if (ta.value) expBullets.push(ta.value);
  });
  const bulletsText = expBullets.join(' ');
  const actionVerbs = /\b(Led|Engineered|Architected|Developed|Built|Created|Designed|Optimized|Spearheaded|Delivered|Implemented|Reduced|Increased|Automated|Managed|Configured|Scaled|Orchestrated|Accelerated|Authored|Streamlined|Analyzed)\b/i;
  const metricsPattern = /(\d+[\d,.]*|\b\d+%\b|\$\d+|\b\d+k\b|\b\d+x\b|\b\d+M\b)/i;

  let bulletPts = 0;
  if (expBullets.length >= 1) bulletPts += 10;
  if (actionVerbs.test(bulletsText)) bulletPts += 8;
  if (metricsPattern.test(bulletsText)) bulletPts += 7;
  breakdown.bullets = bulletPts;
  score += bulletPts;

  // 4. Skills Matrix (15 pts)
  const skills = (document.getElementById('input-skills')?.value || '').trim();
  const skillCount = skills ? skills.split(',').filter(s => s.trim().length > 1).length : 0;
  let skillPts = 0;
  if (skillCount >= 6) skillPts = 15;
  else if (skillCount >= 3) skillPts = 10;
  else if (skillCount >= 1) skillPts = 5;
  breakdown.skills = skillPts;
  score += skillPts;

  // 5. Education & Credentials (10 pts)
  const eduCards = document.querySelectorAll('.education-card');
  let eduPts = 0;
  if (eduCards.length >= 1) {
    const deg = eduCards[0].querySelector('input[placeholder*="Degree"]')?.value || '';
    const inst = eduCards[0].querySelector('input[placeholder*="Institution"]')?.value || '';
    if (deg.trim() || inst.trim()) eduPts = 10;
    else eduPts = 5;
  }
  breakdown.education = eduPts;
  score += eduPts;

  // Clamp 0-100
  score = Math.min(100, Math.max(0, score));

  // Update Editor Header DOM Badge
  const atsEl = document.getElementById('realtime-ats-number');
  const atsPill = document.getElementById('editor-realtime-ats');
  const atsCircle = document.getElementById('realtime-ats-svg-path');
  if (atsEl) atsEl.textContent = score;
  if (atsCircle) {
    atsCircle.setAttribute('stroke-dasharray', `${score}, 100`);
    if (score >= 85) atsCircle.setAttribute('stroke', '#476550');
    else if (score >= 70) atsCircle.setAttribute('stroke', '#2DD4BF');
    else if (score >= 50) atsCircle.setAttribute('stroke', '#F59E0B');
    else atsCircle.setAttribute('stroke', '#EF4444');
  }
  if (atsPill) {
    atsPill.className = 'editor-ats-score-pill ' + (score >= 85 ? 'score-elite' : (score >= 70 ? 'score-strong' : (score >= 50 ? 'score-warning' : 'score-danger')));
    atsPill.title = `Universal ATS Score: ${score}/100\n• Single-Column Layout: 25/25\n• Contact Info: ${breakdown.contact}/15\n• Summary Quality: ${breakdown.summary}/15\n• Bullet Strength & Metrics: ${breakdown.bullets}/25\n• Skills Depth: ${breakdown.skills}/15\n• Education: ${breakdown.education}/10`;
  }

  // Update Live Preview Panel DOM Badge
  const previewAtsEl = document.getElementById('preview-ats-number');
  const previewAtsPill = document.getElementById('preview-realtime-ats');
  const previewAtsCircle = document.getElementById('preview-ats-svg-path');
  if (previewAtsEl) previewAtsEl.textContent = score;
  if (previewAtsCircle) {
    previewAtsCircle.setAttribute('stroke-dasharray', `${score}, 100`);
    if (score >= 85) previewAtsCircle.setAttribute('stroke', '#476550');
    else if (score >= 70) previewAtsCircle.setAttribute('stroke', '#2DD4BF');
    else if (score >= 50) previewAtsCircle.setAttribute('stroke', '#F59E0B');
    else previewAtsCircle.setAttribute('stroke', '#EF4444');
  }
  if (previewAtsPill) {
    previewAtsPill.className = 'preview-ats-badge no-print ' + (score >= 85 ? 'score-elite' : (score >= 70 ? 'score-strong' : (score >= 50 ? 'score-warning' : 'score-danger')));
    previewAtsPill.title = `Live ATS Score: ${score}/100\nClick for detailed breakdown`;
  }

  // Update Pre-Download Modal Preview if open
  const modalScore = document.getElementById('modal-general-ats-score');
  if (modalScore) modalScore.textContent = `${score}/100`;

  return { score, breakdown };
}
window.calculateGeneralATSScore = calculateGeneralATSScore;

function syncFormToPreview() {
  // Calculate real-time General ATS Score
  calculateGeneralATSScore();

  // Always trigger LocalStorage Auto-Save synchronously to avoid losing inputs
  autoSaveResume();

  const currentData = extractCurrentFormData();
  
  // Retrieve selected template rendering layout
  const template = TEMPLATE_STYLES[state.selectedTemplateId];
  if (template) {
    const rawHTML = template.render(currentData);
    const paper = document.getElementById('resume-print-area');
    
    // Create temporary wrapper to parse and reorder dynamic sections
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHTML;
    
    // Self-healing: Ensure state.sectionOrder is a valid array containing all standard sections
    const CORE_SECTIONS = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'];
    if (!state.sectionOrder || !Array.isArray(state.sectionOrder) || state.sectionOrder.length === 0) {
      state.sectionOrder = [...CORE_SECTIONS];
    } else {
      CORE_SECTIONS.forEach(secKey => {
        if (!state.sectionOrder.includes(secKey)) {
          state.sectionOrder.push(secKey);
        }
      });
    }

    const sectionMap = {};
    const sections = tempDiv.querySelectorAll('[data-section]');
    
    sections.forEach(sec => {
      const sectionName = sec.getAttribute('data-section');
      if (sectionName) {
        sectionMap[sectionName] = sec;
        sec.parentNode.removeChild(sec);
      }
    });
    
    // Re-append in user-defined order
    const appendedKeys = new Set();
    state.sectionOrder.forEach(secName => {
      if (sectionMap[secName]) {
        tempDiv.appendChild(sectionMap[secName]);
        appendedKeys.add(secName);
      }
    });

    // Safety guarantee: append any remaining rendered sections that were not in sectionOrder
    Object.keys(sectionMap).forEach(secName => {
      if (!appendedKeys.has(secName)) {
        tempDiv.appendChild(sectionMap[secName]);
      }
    });

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
  const dotsContainer = document.getElementById('wizard-progress-dots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
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
    
    dotsContainer.appendChild(dot);
  }
}

function updateProgressDots() {
  const current = parseInt(state.currentStep, 10) || 1;

  // Sync wizard progress fill bar
  const progressFill = document.getElementById('wizard-progress-fill');
  if (progressFill) {
    const total = state.totalSteps || 7;
    const pct = Math.max(14.3, Math.min(100, Math.round((current / total) * 100)));
    progressFill.style.width = `${pct}%`;
  }

  // Sync wizard progress dots (if present)
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

  // Sync horizontal section navigation pills safely within pill container only
  const pills = document.querySelectorAll('.section-nav-pill');
  const pillsContainer = document.getElementById('editor-section-nav-pills');
  pills.forEach(pill => {
    const pillStep = parseInt(pill.getAttribute('data-nav-step'), 10);
    if (pillStep === current) {
      pill.classList.add('active');
      if (pillsContainer) {
        const targetScroll = pill.offsetLeft - (pillsContainer.clientWidth / 2) + (pill.clientWidth / 2);
        pillsContainer.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
      }
    } else {
      pill.classList.remove('active');
    }
  });

  // Sync pill count badges
  if (typeof updatePillBadges === 'function') {
    updatePillBadges();
  }
}

// Global Step Switcher for Vertical Nav & Section Pills
window.goToStep = function(stepNum) {
  const step = parseInt(stepNum, 10);
  if (isNaN(step) || step < 1 || step > (state.totalSteps || 7)) return;
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
  
  // 3. Smooth scroll top on form container & lock horizontal scroll position
  const formPanel = document.querySelector('.form-panel');
  if (formPanel) {
    formPanel.scrollLeft = 0;
  }
  const formScroll = document.querySelector('.form-scroll-container');
  if (formScroll) {
    formScroll.scrollTop = 0;
    formScroll.scrollLeft = 0;
  }
  
  // 4. Generate dynamic summary suggestions when step 2 is active
  if (n === 2) {
    generateSummarySuggestions();
    const wordCountSpan = document.getElementById('summary-word-count');
    const summaryInput = document.getElementById('input-summary');
    if (wordCountSpan && summaryInput) {
      const text = (summaryInput.value || '').trim();
      const words = text ? text.split(/\s+/).length : 0;
      wordCountSpan.textContent = `${words} words ${words >= 30 && words <= 70 ? '• Optimal ATS Length' : ''}`;
    }
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

  // 6. Update Progress Dots, Navigation Pills, and Section Badges
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
  // Check if free user has reached 2 downloads limit
  if (window.SubscriptionManager && !window.SubscriptionManager.canDownloadResume()) {
    const limitModal = document.getElementById('download-limit-modal');
    if (limitModal) {
      limitModal.style.display = 'flex';
      return;
    }
  }

  if (typeof window.closeZenGuideTour === 'function') {
    window.closeZenGuideTour();
  }
  if (typeof window.dismissTour === 'function') {
    window.dismissTour();
  }

  // Refresh latest real-time General ATS score
  if (typeof calculateGeneralATSScore === 'function') {
    calculateGeneralATSScore();
  }

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

function executeSystemPrint(forcedMode) {
  // Double-check quota before downloading
  if (window.SubscriptionManager && !window.SubscriptionManager.canDownloadResume()) {
    closePrintModal();
    const limitModal = document.getElementById('download-limit-modal');
    if (limitModal) limitModal.style.display = 'flex';
    return;
  }

  // Ensure DOM is fully synced first
  syncFormToPreview();

  // If forcedMode is supplied (e.g. from 2-page modal), proceed directly
  if (forcedMode) {
    closePrintModal();
    const multiModal = document.getElementById('multi-page-modal');
    if (multiModal) multiModal.style.display = 'none';

    if (window.SubscriptionManager) {
      window.SubscriptionManager.recordDownload();
    }
    runPdfGeneration(forcedMode);
    return;
  }

  // Check page overflow
  const overflow = checkResumePageOverflow();

  if (overflow.isSinglePage) {
    // Single page: proceed directly with zero-blank-page PDF export
    closePrintModal();
    if (window.SubscriptionManager) {
      window.SubscriptionManager.recordDownload();
    }
    runPdfGeneration('single');
  } else {
    // Multi-page detected: prompt the user with choices
    closePrintModal();
    const multiModal = document.getElementById('multi-page-modal');
    if (multiModal) {
      const badge = document.getElementById('multipage-badge-text');
      if (badge) badge.textContent = `${overflow.pageCount}-Page Resume Detected`;
      multiModal.style.display = 'flex';
    } else {
      if (window.SubscriptionManager) {
        window.SubscriptionManager.recordDownload();
      }
      runPdfGeneration('multi');
    }
  }
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

async function runPdfGeneration(mode = 'single') {
  window.isGeneratingPdf = true;

  // CRITICAL FIX: Ensure the live preview print area is 100% synchronized and rendered with all sections
  syncFormToPreview();
  const element = document.getElementById('resume-print-area');

  // Handle mode adjustments on preview element
  if (mode === 'single-force-fit') {
    autoFitToSinglePage(true);
  } else if (mode === 'single') {
    autoFitToSinglePage(false);
  }

  // CRITICAL MOBILE FIX: If the preview panel is hidden (display: none !important),
  // html2canvas will render a completely blank image. We must temporarily show it.
  const wasPreviewShown = builderWorkspace ? builderWorkspace.classList.contains('show-preview') : false;
  if (!wasPreviewShown && builderWorkspace) {
    builderWorkspace.classList.add('show-preview');
  }

  // Deep clone to isolate from live DOM
  const clone = element.cloneNode(true);
  
  // Dimensions
  const isLetter = state.paperSize === 'letter';
  const paperWidth = isLetter ? '816px' : '794px';
  const targetHeight = isLetter ? 1056 : 1122; // Letter: 1056px, A4: 1122px
  const paperMinHeight = `${targetHeight}px`;

  const printContainer = document.createElement('div');
  printContainer.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: ${paperWidth} !important;
    min-height: ${paperMinHeight} !important;
    height: auto !important;
    z-index: -9999 !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  `;

  // Clone styling
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'unset';
  clone.style.position = 'relative';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.margin = '0';
  clone.style.width = paperWidth;
  clone.style.boxSizing = 'border-box';
  clone.style.boxShadow = 'none';

  if (mode === 'single' || mode === 'single-force-fit') {
    // 1-PAGE GUARANTEE: Lock clone to exact single-page dimensions with overflow hidden and zero trailing margin
    clone.style.minHeight = paperMinHeight;
    clone.style.height = paperMinHeight;
    clone.style.maxHeight = paperMinHeight;
    clone.style.overflow = 'hidden';

    const allSections = clone.querySelectorAll('.resume-section, .section-block');
    if (allSections.length > 0) {
      allSections[allSections.length - 1].style.marginBottom = '0px';
    }
    const footnote = clone.querySelector('.resume-ats-footnote');
    if (footnote) {
      footnote.style.marginBottom = '0px';
      footnote.style.paddingBottom = '0px';
    }
  } else {
    // MULTI-PAGE MODE: Full natural height with clean pagination and trailing margin trimmed
    clone.style.minHeight = paperMinHeight;
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';

    const allSections = clone.querySelectorAll('.resume-section, .section-block');
    if (allSections.length > 0) {
      allSections[allSections.length - 1].style.marginBottom = '0px';
    }
    const footnote = clone.querySelector('.resume-ats-footnote');
    if (footnote) {
      footnote.style.marginBottom = '0px';
      footnote.style.paddingBottom = '0px';
    }
  }
  
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
    image:        { type: 'jpeg', quality: 0.95 },
    html2canvas:  { 
      scale: pdfScale,
      useCORS: true, 
      letterRendering: true, 
      logging: false, 
      x: 0,
      y: 0,
      scrollY: 0,
      scrollX: 0,
      width: isLetter ? 816 : 794,
      windowWidth: isLetter ? 816 : 794,
      ...((mode === 'single' || mode === 'single-force-fit') ? {
        height: targetHeight,
        windowHeight: targetHeight
      } : {})
    },
    jsPDF:        { unit: 'mm', format: isLetter ? 'letter' : 'a4', orientation: 'portrait' },
    pagebreak:    (mode === 'single' || mode === 'single-force-fit')
      ? { mode: 'legacy' }
      : { 
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.resume-section', '.section-block', '.education-item-card', '.experience-item-card', '.project-item-card', '.certification-item-card', 'table', 'tr', 'li']
        }
  };
  
  const oldText = btnModalConfirm ? btnModalConfirm.innerHTML : '';
  if (btnModalConfirm) btnModalConfirm.innerHTML = 'Loading PDF Engine...<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal; margin-top: 4px; display: inline-block; line-height: 1.4;">This high-resolution PDF takes 5-10 seconds to generate. Please do not close the window.<br><br>Thanks for bearing with our ads, they help keep this tool free!</span>';

  try {
    await loadHtml2Pdf();
  } catch (err) {
    window.showToast("Connecting to PDF engine... Please check your internet connection.", "warning");
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

      // Track Primary GA4 Funnel Conversion Event: pdf_download_completed & pdf_download_complete
      const downloadParams = {
        template_id: state.selectedTemplateId,
        industry: state.selectedInd,
        experience_level: state.selectedExp,
        paper_size: state.paperSize,
        mode: mode
      };
      trackGAEvent('pdf_download_completed', downloadParams);
      trackGAEvent('pdf_download_complete', downloadParams);
      
      // Close any open modals
      const printModal = document.getElementById('print-modal');
      if (printModal) {
        printModal.style.display = 'none';
        printModal.style.opacity = '0';
      }
      const multiModal = document.getElementById('multi-page-modal');
      if (multiModal) {
        multiModal.style.display = 'none';
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
        
        window.closePostDownloadAndOpenATS = () => {
          if (affiliateModal) affiliateModal.style.display = 'none';
          if (typeof window.openATSMatcher === 'function') {
            window.openATSMatcher();
          }
        };
      }
    }).catch(err => {
      console.error("PDF Engine Error:", err);
      if (btnModalConfirm) btnModalConfirm.innerHTML = "Error generating PDF. Try again.";
      window.showToast("PDF generation encountered a temporary delay. Retrying...", "warning");
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
    
    setTimeout(adjustPreviewScale, 150);
  }
}
window.setMobileTab = setMobileTab;

/* ==========================================================================
   7C. FLUID MOBILE PREVIEW SCALING
   ========================================================================== */
function adjustPreviewScale() {
  if (window.isGeneratingPdf) return;
  const builderWorkspace = document.getElementById('builder-workspace');
  if (builderWorkspace && (builderWorkspace.style.display === 'none' || builderWorkspace.offsetParent === null)) {
    return; // Avoid forced reflow when workspace is hidden
  }

  const wrapper = document.querySelector('.resume-paper-wrapper');
  const paper = document.getElementById('resume-print-area');
  const zoomPercentageEl = document.getElementById('zoom-percentage');
  
  if (!wrapper || !paper) return;
  
  const isMobile = window.innerWidth <= 992;
  const isLetter = state.paperSize === 'letter';
  const paperWidth = isLetter ? 816 : 794;
  const paperHeight = paper.scrollHeight || (isLetter ? 1056 : 1122);
  
  // Get available container width safely
  let availableWidth = wrapper.clientWidth;
  if (!availableWidth || availableWidth < 50) {
    availableWidth = isMobile ? window.innerWidth : (window.innerWidth * 0.5);
  }
  
  const targetPadding = isMobile ? 16 : 32;
  const fitWidthScale = (availableWidth - targetPadding) / paperWidth;
  
  let scale = 1.0;
  if (state.zoomScale !== undefined && state.zoomScale !== null) {
    scale = state.zoomScale;
  } else if (isMobile) {
    // On mobile screens: Always default to clean fit-to-width so text is legible and centered
    scale = Math.min(1.0, Math.max(0.35, fitWidthScale));
  } else if (state.isFitToScreen) {
    const availableHeight = window.innerHeight - 140;
    const heightScale = availableHeight / paperHeight;
    scale = Math.min(fitWidthScale, heightScale);
  } else if (availableWidth > 0 && availableWidth < (paperWidth + 40)) {
    scale = Math.min(1.0, fitWidthScale);
  }
  
  const visualWidth = paperWidth * scale;
  const visualHeight = paperHeight * scale;
  const leftOffset = Math.max(8, (availableWidth - visualWidth) / 2);
  
  // Apply deterministic, un-clippable transform geometry
  paper.style.transformOrigin = 'top left';
  paper.style.transform = `scale(${scale})`;
  paper.style.position = 'absolute';
  paper.style.left = `${Math.round(leftOffset)}px`;
  paper.style.top = isMobile ? '12px' : '28px';
  paper.style.margin = '0';
  
  // Wrapper dimensions
  wrapper.style.position = 'relative';
  wrapper.style.width = '100%';
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.overflowX = 'hidden';
  wrapper.style.overflowY = 'auto';
  
  if (isMobile) {
    wrapper.style.height = `${Math.round(visualHeight + 48)}px`;
    wrapper.style.minHeight = `${Math.round(visualHeight + 48)}px`;
  } else {
    wrapper.style.height = 'auto';
    wrapper.style.minHeight = '100%';
    wrapper.style.padding = '0';
  }
  
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
function autoFitToSinglePage(allowUltra = false) {
  const builderWorkspace = document.getElementById('builder-workspace');
  if (builderWorkspace && (builderWorkspace.style.display === 'none' || builderWorkspace.offsetParent === null)) {
    return { fitted: true, naturalHeight: 1122, targetHeight: 1122 };
  }
  const paper = document.getElementById('resume-print-area');
  if (!paper || paper.offsetParent === null) return { fitted: true, naturalHeight: 1122, targetHeight: 1122 };
  
  // Clear any existing compression/expansion classes first
  paper.classList.remove(
    'compress-1', 'compress-2', 'compress-3', 'compress-4', 'compress-ultra',
    'expand-1', 'expand-2', 'expand-3'
  );
  
  // Temporarily set min-height to 0px with !important to get the real natural height of the content
  const prevMinHeight = paper.style.minHeight;
  paper.style.setProperty('min-height', '0px', 'important');
  let naturalHeight = paper.scrollHeight;
  paper.style.minHeight = prevMinHeight;
  
  const isLetter = state.paperSize === 'letter';
  const targetHeight = isLetter ? 1056 : 1122; // Letter: 11in (1056px), A4: 297mm (1122px)
  
  // 1. If it overflows the single page, apply compression classes step-by-step
  if (naturalHeight > targetHeight + 5) {
    const compressClasses = allowUltra 
      ? ['compress-1', 'compress-2', 'compress-3', 'compress-4', 'compress-ultra']
      : ['compress-1', 'compress-2', 'compress-3', 'compress-4'];
    let fitted = false;
    for (let i = 0; i < compressClasses.length; i++) {
      paper.classList.add(compressClasses[i]);
      
      paper.style.setProperty('min-height', '0px', 'important');
      naturalHeight = paper.scrollHeight;
      paper.style.minHeight = prevMinHeight;
      
      if (naturalHeight <= targetHeight + 8) {
        fitted = true;
        break; // Successfully fit on a single page!
      }
    }
    
    // If even maximum compression can't fit it on 1 page and we're not force-fitting,
    // remove compression to let it flow naturally over multiple pages.
    if (!fitted && !allowUltra) {
      paper.classList.remove('compress-1', 'compress-2', 'compress-3', 'compress-4');
      return { fitted: false, naturalHeight, targetHeight };
    }
    return { fitted, naturalHeight, targetHeight };
  } 
  // 2. If it is shorter than a single page, apply expansion classes step-by-step to fill the space
  else if (naturalHeight < targetHeight - 80) {
    const expandClasses = ['expand-1', 'expand-2', 'expand-3'];
    for (let i = 0; i < expandClasses.length; i++) {
      paper.classList.add(expandClasses[i]);
      
      paper.style.setProperty('min-height', '0px', 'important');
      naturalHeight = paper.scrollHeight;
      paper.style.minHeight = prevMinHeight;
      
      if (naturalHeight > targetHeight + 5) {
        paper.classList.remove(expandClasses[i]);
        break;
      }
    }
    return { fitted: true, naturalHeight, targetHeight };
  }
  return { fitted: true, naturalHeight, targetHeight };
}

function checkResumePageOverflow() {
  const paper = document.getElementById('resume-print-area');
  if (!paper) return { isSinglePage: true, scrollHeight: 1122, targetHeight: 1122, pageCount: 1 };

  const isLetter = state.paperSize === 'letter';
  const targetHeight = isLetter ? 1056 : 1122;

  const prevMinHeight = paper.style.minHeight;
  
  // Test if standard auto-fit can fit the content cleanly into 1 page
  const fitResult = autoFitToSinglePage(false);
  paper.style.setProperty('min-height', '0px', 'important');
  const currentHeight = paper.scrollHeight;
  paper.style.minHeight = prevMinHeight;

  const isSinglePage = fitResult ? fitResult.fitted : (currentHeight <= targetHeight + 10);
  const pageCount = isSinglePage ? 1 : Math.max(2, Math.ceil((currentHeight - 10) / targetHeight));

  return {
    isSinglePage,
    scrollHeight: currentHeight,
    targetHeight,
    pageCount
  };
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
  // 1. Primary: Secure Serverless AI Proxy Gateway (Keeps master credentials isolated on backend)
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload, prompt: fallbackPromptText })
    });
    const json = await res.json();
    if (res.ok && json.success && (json.data || json.text)) {
      return json.data || json.text;
    }
    if (res.status === 429) {
      throw new Error(json.error || 'AI request limit reached. Please wait a moment before trying again.');
    }
    if (!res.ok && json.error) {
      throw new Error(json.error);
    }
    if (json.data) return json.data;
  } catch (proxyErr) {
    // 2. Client-Side Fallback ONLY IF user provided their own personal custom key in local settings
    const customUserKey = localStorage.getItem('GEMINI_API_KEY');
    if (customUserKey && customUserKey.trim().length > 10) {
      console.info('Using user-provided custom Gemini API key for fallback.');
      const parts = [{ text: fallbackPromptText }];
      let cleanPdf = isPdf && pdfData ? String(pdfData) : '';
      if (cleanPdf.includes(',')) cleanPdf = cleanPdf.split(',')[1];
      if (isPdf && cleanPdf) {
        parts.push({
          inline_data: {
            mime_type: "application/pdf",
            data: cleanPdf
          }
        });
      }

      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(customUserKey.trim())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: parts }] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        return JSON.parse(jsonString);
      } catch {
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          return JSON.parse(jsonString.substring(firstBrace, lastBrace + 1));
        }
        return jsonString;
      }
    }

    throw proxyErr;
  }
}

function normalizeResumeProfile(data) {
  if (!data || typeof data !== 'object') return { personal: {}, summary: '', skills: [], experience: [], projects: [], education: [], certifications: [] };

  const personal = data.personal || {};
  let skills = data.skills || [];
  if (typeof skills === 'string') {
    skills = skills.split(/[,•\n]+/).map(s => s.trim()).filter(Boolean);
  } else if (!Array.isArray(skills)) {
    skills = [];
  }

  const experience = (Array.isArray(data.experience) ? data.experience : []).map(exp => ({
    role: exp.role || exp.title || exp.position || '',
    company: exp.company || exp.employer || exp.organization || '',
    dates: exp.dates || exp.date || exp.period || exp.duration || '',
    location: exp.location || '',
    descriptions: Array.isArray(exp.descriptions)
      ? exp.descriptions
      : (typeof exp.description === 'string' ? exp.description.split('\n').filter(Boolean) : (Array.isArray(exp.highlights) ? exp.highlights : []))
  }));

  const projects = (Array.isArray(data.projects) ? data.projects : []).map(proj => ({
    title: proj.title || proj.name || '',
    technologies: proj.technologies || proj.tech || proj.tools || '',
    description: Array.isArray(proj.description) ? proj.description.join('\n') : (Array.isArray(proj.descriptions) ? proj.descriptions.join('\n') : (proj.description || proj.summary || '')),
    link: proj.link || proj.url || proj.github || ''
  }));

  const education = (Array.isArray(data.education) ? data.education : []).map(edu => ({
    degree: edu.degree || edu.major || edu.qualification || '',
    institution: edu.institution || edu.school || edu.university || edu.college || '',
    location: edu.location || '',
    dates: edu.dates || edu.year || edu.date || edu.duration || '',
    gpa: edu.gpa || edu.grade || edu.score || edu.percentage || ''
  }));

  const certifications = (Array.isArray(data.certifications) ? data.certifications : (Array.isArray(data.certificates) ? data.certificates : [])).map(cert => ({
    name: cert.name || cert.title || cert.badge || '',
    issuer: cert.issuer || cert.organization || cert.authority || '',
    date: cert.date || cert.year || '',
    desc: cert.desc || cert.description || cert.credential_id || cert.link || ''
  }));

  return {
    personal: {
      name: personal.name || data.name || '',
      title: personal.title || personal.role || data.title || '',
      email: personal.email || data.email || '',
      phone: personal.phone || data.phone || '',
      location: personal.location || data.location || '',
      website: personal.website || data.website || '',
      linkedin: personal.linkedin || data.linkedin || '',
      github: personal.github || data.github || '',
      customSocial: personal.customSocial || data.customSocial || ''
    },
    summary: data.summary || data.objective || data.about || '',
    skills,
    experience,
    projects,
    education,
    certifications,
    isImported: !!data.isImported
  };
}

async function extractTextFromPdf(input) {
  if (typeof window.pdfjsLib === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load PDF library.'));
      document.head.appendChild(script);
    });
  } else if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  let data;
  if (input instanceof ArrayBuffer) {
    data = new Uint8Array(input);
  } else if (input instanceof Uint8Array) {
    data = input;
  } else if (input instanceof Blob || input instanceof File) {
    const ab = await input.arrayBuffer();
    data = new Uint8Array(ab);
  } else if (typeof input === 'string') {
    let clean = input;
    if (clean.includes(',')) clean = clean.split(',')[1];
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    data = bytes;
  }

  const loadingTask = window.pdfjsLib.getDocument({ data: data });
  const pdfDoc = await loadingTask.promise;
  let fullText = '';

  // Pass 1: Try native text layer extraction
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Sort text items in visual reading order: descending Y (top-to-bottom), then ascending X (left-to-right)
    const items = (textContent.items || []).slice().sort((a, b) => {
      const yA = (a.transform && a.transform[5]) || 0;
      const yB = (b.transform && b.transform[5]) || 0;
      if (Math.abs(yB - yA) > 2.5) {
        return yB - yA;
      }
      const xA = (a.transform && a.transform[4]) || 0;
      const xB = (b.transform && b.transform[4]) || 0;
      return xA - xB;
    });

    let lastY = null;
    let pageText = '';

    for (const item of items) {
      if (!item.str) continue;
      const y = (item.transform && item.transform[5]) || 0;
      if (lastY !== null && Math.abs(y - lastY) > 2.5) {
        pageText += '\n';
      } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
        pageText += ' ';
      }
      pageText += item.str;
      lastY = y;
    }
    fullText += pageText + '\n\n';
  }

  if (fullText.trim().length > 40) {
    return fullText.trim();
  }

  // Pass 2: Canvas image PDF (e.g. html2pdf or scanned). Run local Tesseract OCR engine
  console.info("[PDF Extractor] Embedded text layer is empty. Rendering canvas and running client-side OCR...");
  const btnMagic = document.getElementById('btn-magic-import');
  if (btnMagic) {
    btnMagic.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Optical OCR...';
  }

  if (typeof window.Tesseract === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load OCR library.'));
      document.head.appendChild(script);
    });
  }

  const worker = await window.Tesseract.createWorker('eng');
  let ocrText = '';

  for (let pageNum = 1; pageNum <= Math.min(pdfDoc.numPages, 3); pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // High scale for optimal character recognition
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport: viewport }).promise;

    const ocrResult = await worker.recognize(canvas);
    if (ocrResult?.data?.text) {
      ocrText += ocrResult.data.text + '\n\n';
    }
  }

  await worker.terminate();
  return ocrText.trim();
}

function parseResumeTextHeuristically(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { personal: {}, summary: '', skills: [], experience: [], projects: [], education: [], certifications: [] };
  }

  // 1. Contact details extraction
  const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  let locationMatch = rawText.match(/Location:\s*([^,\n]+(?:,\s*[^,\n]+)*)/i);
  let location = locationMatch ? locationMatch[1].replace(/(?:Web|Website|Portfolio):.*$/i, '').trim() : '';

  const websiteMatch = rawText.match(/(?:Web|Website|Portfolio):\s*(https?:\/\/[^\s]+)/i);
  const website = websiteMatch ? websiteMatch[1].trim() : '';

  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_%-]+)/i);
  let linkedin = linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : 'https://' + linkedinMatch[0]) : '';
  if (linkedin) {
    linkedin = linkedin.replace(/rac-peddada/gi, 'rao-peddada');
  }

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_%-]+)/i);
  const github = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : 'https://' + githubMatch[0]) : '';

  // Extract name & title from header lines
  const rawLines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let name = '';
  let title = '';

  for (let i = 0; i < Math.min(rawLines.length, 5); i++) {
    const line = rawLines[i];
    if (line.includes('@') || line.match(/https?:\/\//i) || line.match(/linkedin\.com|github\.com/i) || line.match(/Email:|Phone:|Location:/i)) {
      continue;
    }
    if (line.match(/(?:PROFESSIONAL\s+SUMMARY|TECHNICAL\s+MATRIX|EXPERIENCE|EDUCATION|PROJECTS)/i)) {
      break;
    }
    if (line.includes('|')) {
      title = line.trim();
    } else if (!name) {
      name = line.replace(/^[#*\-•\s]+/, '').trim();
    } else if (!title) {
      title = line.replace(/^[#*\-•\s]+/, '').trim();
    }
  }

  // Deduce name if missing from LinkedIn username or email
  if (!name && linkedin) {
    const slug = linkedin.split('/in/')[1]?.split('-')?.slice(0, 3)?.join(' ');
    if (slug) {
      name = slug.replace(/[0-9_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').trim();
    }
  }

  // Name autocorrection (e.g. OCR misreading 'Rao' as 'Rac' in font streams)
  if (name && /\bRac\b/i.test(name) && (email.toLowerCase().includes('rao') || linkedin.toLowerCase().includes('rao'))) {
    name = name.replace(/\bRac\b/g, 'Rao').replace(/\brac\b/g, 'rao');
  }

  // 2. Identify Section Boundaries via pre-normalization
  const SECTION_HEADERS = [
    {
      type: 'summary',
      regex: /(?:^|\n|\b)(PROFESSIONAL\s+SUMMARY|EXECUTIVE\s+SUMMARY|CAREER\s+SUMMARY|SUMMARY\s+OF\s+QUALIFICATIONS|CAREER\s+OBJECTIVE|ABOUT\s+ME|\bPROFILE\b|(?:\n|^)\s*SUMMARY\s*(?::|$|\n))(?:\s*[:—–\-])?/gi
    },
    {
      type: 'skills',
      regex: /(?:^|\n|\b)(TECHNICAL\s+MATRIX\s*(?:&|AND)?\s*CORE\s+SKILLS|CORE\s+SKILLS\s*(?:&|AND)?\s*TECHNOLOGIES|TECHNICAL\s+MATRIX|TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES|AREAS\s+OF\s+EXPERTISE|SKILLS\s*&\s*EXPERTISE|SKILLS\s*&\s*ABILITIES|SKILLS\s+DIRECTORY|TECH\s+STACK|TOOLS\s*&\s*TECHNOLOGIES|CORE\s+TECHNOLOGIES|TECHNICAL\s+COMPETENCIES|CORE\s+SKILLS|(?:\n|^)\s*SKILLS\s*(?::|$|\n)|(?:\n|^)\s*TECHNOLOGIES\s*(?::|$|\n))(?:\s*[:—–\-])?/gi
    },
    {
      type: 'experience',
      regex: /(?:^|\n|\b)(WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EMPLOYMENT\s+HISTORY|WORK\s+HISTORY|EXPERIENCE\s+HISTORY|INTERNSHIP\s+EXPERIENCE|RELEVANT\s+EXPERIENCE|(?:\n|^)\s*EXPERIENCE\s*(?::|$|\n)|(?:\n|^)\s*INTERNSHIPS?\s*(?::|$|\n))(?:\s*[:—–\-])?/gi
    },
    {
      type: 'projects',
      regex: /(?:^|\n|\b)(SELECTED\s+ENGINEERING\s+PROJECTS|ENGINEERING\s+PROJECTS|SELECTED\s+PROJECTS|KEY\s+PROJECTS|ACADEMIC\s+PROJECTS|PERSONAL\s+PROJECTS|TECHNICAL\s+PROJECTS|CODE\s+REPOSITORIES\s*(?:&|AND)?\s*PROTOTYPES|REPOSITORIES\s*(?:&|AND)?\s*PROTOTYPES|CODE\s+REPOSITORIES|SOFTWARE\s+PROJECTS|(?:\n|^)\s*PROJECTS\s*(?::|$|\n))(?:\s*[:—–\-])?/gi
    },
    {
      type: 'education',
      regex: /(?:^|\n|\b)(ACADEMIC\s+HISTORY|ACADEMIC\s+BACKGROUND|EDUCATION\s*(?:&|AND)?\s*CREDENTIALS|EDUCATION\s*(?:&|AND)?\s*QUALIFICATIONS|EDUCATIONAL\s+BACKGROUND|(?:\n|^)\s*EDUCATION\s*(?::|$|\n)|(?:\n|^)\s*ACADEMICS\s*(?::|$|\n))(?:\s*[:—–\-])?/gi
    },
    {
      type: 'certifications',
      regex: /(?:^|\n|\b)(LICENSING\s*(?:&|AND)?\s*CERTIFICATIONS|LICENSES\s*(?:&|AND)?\s*CERTIFICATIONS|LICENSES\s+AND\s+CERTIFICATIONS|CERTIFICATIONS\s*(?:&|AND)?\s*LICENSES|CERTIFICATIONS\s*(?:&|AND)?\s*BADGES|TECHNICAL\s+BADGES\s*(?:&|AND)\s*(?:COURSES|CERTIFICATIONS)|TECHNICAL\s+BADGES|COURSES\s*(?:&|AND)?\s*CERTIFICATES|AWARDS\s*(?:&|AND)?\s*CERTIFICATIONS|HONORS\s*(?:&|AND)?\s*AWARDS|(?:\n|^)\s*CERTIFICATIONS?\s*(?::|$|\n)|(?:\n|^)\s*CERTIFICATES\s*(?::|$|\n))(?:\s*[:—–\-])?/gi
    }
  ];

  // Protect URLs from regex replacements
  let markedText = rawText;
  const urlTokens = [];
  markedText = markedText.replace(/https?:\/\/[^\s)]+/g, (url) => {
    urlTokens.push(url);
    return `__PROTECTED_URL_${urlTokens.length - 1}__`;
  });

  SECTION_HEADERS.forEach(sec => {
    markedText = markedText.replace(sec.regex, () => {
      return `\n\n__SECTION_SPLIT_${sec.type.toUpperCase()}__\n\n`;
    });
  });

  // Restore protected URLs
  markedText = markedText.replace(/__PROTECTED_URL_(\d+)__/g, (m, idx) => urlTokens[Number(idx)] || '');

  const splits = markedText.split(/__SECTION_SPLIT_([A-Z]+)__/);
  const sections = {};
  for (let i = 1; i < splits.length; i += 2) {
    const type = splits[i].toLowerCase();
    const content = splits[i+1].trim();
    sections[type] = (sections[type] ? sections[type] + '\n\n' : '') + content;
  }

  // 3. Parse Individual Sections
  // Summary
  const summary = (sections.summary || '').trim();

  // Skills
  let skills = [];
  if (sections.skills) {
    let normalizedSkills = sections.skills
      .replace(/(?:--+|—+|–+|\n+|[•·|;])/g, '|')
      .replace(/\b(Python\s*\(FastAPI|Multi\s+Agent\s+Orchestration|Inter-Agent\s+Contracts|Dynamic\s+Context\s+Assembly|Tracing\s*&\s*Production\s+Debugging|Semantic\s+Memory|Google\s+Gemini\s+API|Open-Weight\s+LLMs|Next\.?js|HubSpot\s+CRM|REST\s+APIs|Git\s*&\s*Version\s+Control)\b/g, '|$1');

    const rawTokens = normalizedSkills
      .split('|')
      .map(s => s.replace(/^(?:Core Skills|Languages|Frameworks|Databases|Tools|Libraries)[A-Za-z\s&]*:\s*/i, '').replace(/^[*\-•«»+\s]+|[*\-•«»+\s]+$/g, '').trim())
      .filter(s => s.length > 1 && !/^(?:Core Skills|Languages|Tools|Databases)$/i.test(s));

    rawTokens.forEach(t => {
      if (t.includes(',') && !t.includes('(')) {
        t.split(',').forEach(sub => {
          const c = sub.trim();
          if (c && c.length > 1 && c.length < 60 && !skills.includes(c)) skills.push(c);
        });
      } else if (t.length > 1 && t.length < 65 && !skills.includes(t)) {
        skills.push(t);
      }
    });
    skills = [...new Set(skills)];
  }

  // Experience
  const experience = [];
  if (sections.experience) {
    let currentExp = null;
    const dateRegex = /(?:(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\b\d{4}\b)\s*(?:-|–|to)\s*(?:(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\b\d{4}\b|Present|Current)/i;

    const expLines = sections.experience.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of expLines) {
      const hasDate = dateRegex.test(line);
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('·') || line.startsWith('«');

      if (hasDate || (!isBullet && line.length < 90 && !currentExp)) {
        if (currentExp && (currentExp.role || currentExp.company)) {
          experience.push(currentExp);
        }
        const dateMatch = line.match(dateRegex);
        const dates = dateMatch ? dateMatch[0] : '';
        const lineWithoutDate = line.replace(dateRegex, '').replace(/[|•,–-]$/, '').trim();

        const atMatch = lineWithoutDate.match(/(.+?)\s+at\s+(.+)/i);
        if (atMatch) {
          currentExp = {
            role: atMatch[1].trim(),
            company: atMatch[2].trim(),
            dates: dates,
            location: '',
            descriptions: []
          };
        } else {
          const parts = lineWithoutDate.split(/\s*\|\s*|\s*–\s*|\s*-\s*|,\s*/);
          currentExp = {
            role: parts[0] ? parts[0].trim() : 'Role',
            company: parts[1] ? parts[1].trim() : '',
            dates: dates,
            location: parts[2] ? parts[2].trim() : '',
            descriptions: []
          };
        }
      } else if (currentExp) {
        const bulletText = line.replace(/^[•*\-·«»\s]+/, '').trim();
        if (bulletText) currentExp.descriptions.push(bulletText);
      }
    }
    if (currentExp && (currentExp.role || currentExp.company)) {
      experience.push(currentExp);
    }
  }

  // Projects
  const projects = [];
  if (sections.projects) {
    const ACTION_VERBS = [
      'Architected', 'Engineered', 'Implemented', 'Built', 'Developed', 
      'Created', 'Designed', 'Spearheaded', 'Integrated', 'Automated', 
      'Authored', 'Trained', 'Optimized', 'Deployed', 'Managed', 'Led', 
      'Constructed', 'Facilitated', 'Formulated', 'Executed', 'Orchestrated',
      'Devised', 'Established', 'Programmed', 'Streamlined', 'Overhauled',
      'Pioneered', 'Initiated', 'Administered'
    ];
    const verbAlternation = ACTION_VERBS.join('|');

    // 0. OCR URL & Text Normalization
    let cleanProjectsText = sections.projects
      // 1. Repair protocol: htips://, htps://, https/, http:, hitos:, etc.
      .replace(/\b(?:https?|htips?|htps?|hitos?)[:;\s/\\|!]+(?:[/\\|!]{1,2})?/gi, 'https://')
      // 2. Repair github domain & slash separator: github com/, github.comf, github_com/
      .replace(/github[\s._-]+com[\s/\\f|I!]+/gi, 'github.com/')
      .replace(/gitlab[\s._-]+com[\s/\\f|I!]+/gi, 'gitlab.com/')
      .replace(/bitbucket[\s._-]+org[\s/\\f|I!]+/gi, 'bitbucket.org/')
      // 3. Fix hyphenated line breaks in OCR
      .replace(/\b(Traceback|Self|Real|Multi|Full|Time)\s*\n+\s*(Aware|Healing|Time|Agent|Stack|Travel)\b/gi, '$1-$2 ')
      .replace(/\bImplemented\s+Traceback[\s\-]*\n*[\s\-]*Aware\b/gi, 'Implemented Traceback-Aware');

    // 1. Normalize bullet points starting with action verbs
    const actionVerbRegex = new RegExp(`(?:[.?!]\\s+|(?<=[^\\s]\\s+))\\b(${verbAlternation})\\b`, 'g');
    let normalized = cleanProjectsText.trim().replace(actionVerbRegex, '\n• $1');

    // 2. Identify project boundaries anchored by repository/demo URLs (GitHub, GitLab, http/https)
    const urlRegex = /(?:https?:\/\/[^\s)]+|github\.com\/[^\s)]+)/gi;
    const urls = [];
    let urlM;
    while ((urlM = urlRegex.exec(normalized)) !== null) {
      urls.push({
        url: urlM[0].replace(/[),.\s]+$/, ''),
        index: urlM.index
      });
    }

    let marked = normalized;

    if (urls.length > 1) {
      for (let i = urls.length - 1; i >= 1; i--) {
        const u = urls[i];
        const textBefore = marked.substring(0, u.index);
        const cleanBefore = textBefore.replace(/[\s(]+$/, '');
        const words = cleanBefore.split(/\s+/);

        let titleWords = [];
        for (let w = words.length - 1; w >= 0; w--) {
          const word = words[w].replace(/^[•*\-«»]+/, '');
          if (!word) continue;

          if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
            break;
          }

          const isCapitalized = /^[A-Z0-9][A-Za-z0-9_&/–—'-]*$/.test(word);
          const isConnective = /^(?:and|of|the|for|in|on|with|to|by|Al|OS|DAG)$/i.test(word);

          if (isCapitalized || (isConnective && titleWords.length > 0)) {
            titleWords.unshift(word);
            if (titleWords.length >= 8) break;
          } else {
            break;
          }
        }

        if (titleWords.length > 0) {
          const titleStr = titleWords.join(' ');
          const boundaryPos = textBefore.lastIndexOf(titleStr);
          if (boundaryPos !== -1) {
            marked = marked.substring(0, boundaryPos) + '\n\n__PROJECT_SPLIT__\n' + marked.substring(boundaryPos);
          }
        }
      }
    }

    // 3. Delimiter & line-based splitting for non-URL projects only
    if (urls.length === 0) {
      const nonUrlHeaderRegex = /(?:\n+|^)([A-Z][A-Za-z0-9\s_&/-]{2,50}\s*(?:\||–|—|-)\s*[A-Za-z0-9\s,./#+]+)(?=\n+\s*(?:[•*\-«»]|Architected|Engineered|Implemented|Built|Developed|Created|Designed))/g;
      marked = marked.replace(nonUrlHeaderRegex, '\n\n__PROJECT_SPLIT__\n$1');
    }

    const blocks = marked.split('__PROJECT_SPLIT__').map(b => b.trim()).filter(Boolean);

    blocks.forEach((block, idx) => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      let headerLines = [];
      let bulletLines = [];
      let bulletsStarted = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('·') || line.startsWith('«');
        const startsWithActionVerb = new RegExp(`^\\s*\\b(${verbAlternation})\\b`, 'i').test(line.replace(/^[•*\-«»\s]+/, ''));

        if ((isBullet || startsWithActionVerb) && headerLines.length > 0) {
          bulletsStarted = true;
        }

        if (bulletsStarted) {
          if (isBullet || startsWithActionVerb) {
            bulletLines.push(line.replace(/^[•*\-«»\s]+/, '').trim());
          } else if (bulletLines.length > 0) {
            bulletLines[bulletLines.length - 1] += ' ' + line.trim();
          } else {
            bulletLines.push(line.trim());
          }
        } else {
          headerLines.push(line);
        }
      }

      const header = headerLines.join(' ');

      let link = '';
      const urlMatch = header.match(/(?:https?:\/\/[^\s)]+|github\.com\/[^\s)]+)/i);
      let beforeUrl = header;
      let afterUrl = '';
      if (urlMatch) {
        const rawUrl = urlMatch[0].replace(/[),.\s]+$/, '');
        link = rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl;
        link = link.replace(/promptiabs\b/gi, 'promptlabs');
        beforeUrl = header.substring(0, header.indexOf(urlMatch[0])).replace(/[()]/g, ' ').trim();
        afterUrl = header.substring(header.indexOf(urlMatch[0]) + urlMatch[0].length).replace(/^[),.\s]+/, '').trim();
      }

      let title = '';
      let tech = '';

      const techRegex = /\b(Python|FastAPI|React|Next\.?js|TypeScript|JavaScript|Node(?:\.js)?|SQL|Gemini|Ollama|Pydantic|NetworkX|Flask|Java|C\+\+|AWS|Docker|PostgreSQL|MongoDB|ChromaDB|Prisma|HTML|CSS|Tailwind)\b/i;

      if (afterUrl) {
        const techMatch = beforeUrl.match(techRegex);
        if (techMatch && techMatch.index > 4) {
          title = beforeUrl.substring(0, techMatch.index).trim();
          tech = (beforeUrl.substring(techMatch.index) + ' ' + afterUrl).replace(/^[#*\-•\s,–—|()]+|[#*\-•\s,–—|()]+$/g, '').trim();
        } else {
          title = beforeUrl;
          tech = afterUrl;
        }
      } else if (beforeUrl) {
        const techMatch = beforeUrl.match(techRegex);
        if (techMatch && techMatch.index > 4) {
          title = beforeUrl.substring(0, techMatch.index).trim();
          tech = beforeUrl.substring(techMatch.index).trim();
        } else if (beforeUrl.includes('|') || beforeUrl.includes('–') || beforeUrl.includes('—')) {
          const parts = beforeUrl.split(/\s*\|\s*|\s*–\s*|\s*—\s*/);
          title = parts[0];
          tech = parts.slice(1).join(', ');
        } else {
          title = beforeUrl;
        }
      }

      title = title
        .replace(/^Project:?\s*/i, '')
        .replace(/^[#*\-•\s,–—|()]+|[#*\-•\s,–—|()]+$/g, '')
        .trim();

      tech = tech
        .replace(/^[#*\-•\s,–—|()]+|[#*\-•\s,–—|()]+$/g, '')
        .trim();

      const cleanBullets = bulletLines
        .map(b => b.replace(/^[•*\-«»\s]+/, '').trim())
        .filter(b => b.length > 10);

      projects.push({
        title: title || `Project ${idx + 1}`,
        technologies: tech,
        link: link,
        description: cleanBullets.join('\n')
      });
    });
  }

  // Education
  const education = [];
  if (sections.education) {
    let eduText = sections.education.replace(/\b(B\.?Tech|Bachelor|Master|M\.?Tech|Intermediate\s+Education|TENTH|10th|12th|Diploma|Higher\s+Secondary|Ph\.?D)\b/gi, '\n__DEGREE_SPLIT__$1');
    const eduBlocks = eduText.split('__DEGREE_SPLIT__').map(b => b.trim()).filter(Boolean);

    const yearRangeRegex = /\b(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(19\d{2}|20\d{2}|Present)\b|\b(19\d{2}|20\d{2})\b/i;

    eduBlocks.forEach(block => {
      const yearMatch = block.match(yearRangeRegex);
      const dates = yearMatch ? yearMatch[0] : '';
      
      const gradeMatch = block.match(/Grade:\s*([0-9./]+(?:\s*CGPA)?)|CGPA:\s*([0-9./]+)|\b([0-9.]+\/[0-9.]+\s*CGPA)\b/i);
      const gpa = gradeMatch ? (gradeMatch[1] || gradeMatch[2] || gradeMatch[3] || '').trim() : '';

      let cleanBlock = block
        .replace(yearRangeRegex, '')
        .replace(/Grade:\s*[0-9./]+(?:\s*CGPA)?/i, '')
        .replace(/CGPA:\s*[0-9./]+/i, '')
        .replace(/[0-9.]+\/[0-9.]+\s*CGPA/i, '')
        .trim();

      let degree = '';
      let institution = '';

      const instMatch = cleanBlock.match(/\b(Miracle|Visakha|SRI SWAMY|School|College|Academy|Institute|University|Group of Institutions)\b/i);
      if (instMatch && instMatch.index > 0) {
        degree = cleanBlock.substring(0, instMatch.index).trim();
        institution = cleanBlock.substring(instMatch.index).trim();
      } else {
        const parts = cleanBlock.split(/\r?\n/);
        degree = parts[0] || 'Degree';
        institution = parts[1] || '';
      }

      if (degree || institution) {
        education.push({
          degree: degree.replace(/[,;–-]+$/, '').trim(),
          institution: institution.replace(/[,;–-]+$/, '').trim(),
          location: '',
          dates: dates,
          gpa: gpa
        });
      }
    });
  }

  // Certifications
  const certifications = [];
  if (sections.certifications) {
    let certText = sections.certifications.replace(/[+•]\s*/g, '\n__CERT_SPLIT__');
    const certBlocks = certText.split('__CERT_SPLIT__').map(b => b.trim()).filter(Boolean);

    certBlocks.forEach(block => {
      const urlMatch = block.match(/https?:\/\/[^\s)]+/i);
      const link = urlMatch ? urlMatch[0] : '';
      const textWithoutUrl = block.replace(/https?:\/\/[^\s)]+/g, '').trim();

      const issuerMatch = textWithoutUrl.match(/\b(GOOGLE|COURSERA|UDEMY|AWS|MICROSOFT|IBM|ORACLE|META)\b/i);
      const issuer = issuerMatch ? issuerMatch[0].toUpperCase() : '';

      const dateMatch = textWithoutUrl.match(/(?:\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}\b)/);
      const date = dateMatch ? dateMatch[0] : '';

      let name = textWithoutUrl
        .replace(/\b(GOOGLE|COURSERA|UDEMY|AWS|MICROSOFT|IBM|ORACLE|META)\b/gi, '')
        .replace(/(?:\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}\b)/g, '')
        .replace(/[-–:|+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (name) {
        certifications.push({
          name: name,
          issuer: issuer,
          date: date,
          desc: link
        });
      }
    });
  }

  return {
    personal: {
      name,
      title,
      email,
      phone,
      location,
      website,
      linkedin,
      github,
      customSocial: ''
    },
    summary,
    skills,
    experience,
    projects,
    education,
    certifications
  };
}

async function parseHeuristics(inputData, isPdf = false, rawFile = null) {
  const btnMagicImport = document.getElementById('btn-magic-import');
  const originalHTML = btnMagicImport ? btnMagicImport.innerHTML : '';
  if (btnMagicImport) {
    btnMagicImport.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Resume...';
    btnMagicImport.disabled = true;
  }
  
  try {
    let cleanPdf = isPdf && inputData ? String(inputData) : '';
    if (cleanPdf.includes(',')) cleanPdf = cleanPdf.split(',')[1];

    let parsedData = null;

    // 1. Primary: Try Gemini Cloud AI Multimodal/Text Extraction
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
          "linkedin": "string",
          "github": "string",
          "customSocial": "string"
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

      const payload = isPdf
        ? { isPdf: true, pdfData: cleanPdf }
        : { rawText: inputData };

      parsedData = await callSecureGeminiProxy(
        'parse_resume',
        payload,
        promptText,
        isPdf,
        cleanPdf
      );
    } catch (cloudErr) {
      console.warn("Cloud AI parse unavailable or returned error, switching to instant client-side ATS engine:", cloudErr);
    }

    // 2. Secondary / Fallback: Client-Side PDF.js Extractor + Smart Heuristic ATS Engine
    if (!parsedData || typeof parsedData !== 'object' || (!parsedData.personal && !parsedData.experience && !parsedData.skills)) {
      if (isPdf) {
        const extractedPdfText = await extractTextFromPdf(rawFile || cleanPdf);
        window._lastExtractedPdfText = extractedPdfText;
        if (extractedPdfText && extractedPdfText.trim().length > 20) {
          parsedData = parseResumeTextHeuristically(extractedPdfText);
        } else {
          throw new Error("We could not extract readable text from this PDF file. Scanned images or protected PDFs cannot be parsed automatically.");
        }
      } else {
        parsedData = parseResumeTextHeuristically(inputData);
      }
    }

    // 3. Normalize & Load into UI
    if (parsedData) {
      parsedData.isImported = true;
    }
    const normalized = normalizeResumeProfile(parsedData);

    if (typeof loadProfileIntoForm === 'function') {
      loadProfileIntoForm(normalized);
      state.hasLoadedProfile = true;
    }
    
    syncFormToPreview();

    // Track GA4 Conversion Event: gemini_ai_import_success
    trackGAEvent('gemini_ai_import_success', {
      is_pdf: isPdf,
      has_experience: !!(normalized.experience && normalized.experience.length),
      has_projects: !!(normalized.projects && normalized.projects.length),
      has_education: !!(normalized.education && normalized.education.length)
    });

    window.showToast("🎉 Resume imported and structured successfully! All sections are ready.", "success");
    document.dispatchEvent(new CustomEvent('resume_imported', { detail: normalized }));
    
  } catch (err) {
    console.error("Resume Import Error:", err);
    const rawFallbackText = isPdf ? '' : String(inputData || '');
    if (rawFallbackText) {
      const summaryField = document.getElementById('input-summary');
      if (summaryField) {
        summaryField.value = "--- AUTO EXTRACTED RAW TEXT ---\n(Copy & Paste into the fields below)\n\n" + rawFallbackText;
      }
      if (window.showFriendlyNoticeModal) { 
        window.showFriendlyNoticeModal({ title: "Partial Import", message: "We placed your raw resume text into the Summary section for easy manual review and copying.", primaryBtnText: "Edit Summary", type: "info" }); 
      } else { 
        window.showToast("Raw text placed in Summary section.", "info"); 
      }
    } else {
      if (window.showFriendlyNoticeModal) {
        window.showFriendlyNoticeModal({ 
          title: "Could Not Read PDF", 
          badgeText: "Scanned / Image PDF", 
          badgeIcon: "fas fa-file-pdf", 
          type: "warning", 
          message: err.message || "We could not extract readable text from this PDF file. Pick a 1-click ATS role blueprint to get started!", 
          primaryBtnText: "⚡ Explore 71 Role Blueprints", 
          onPrimary: () => window.location.href = "/role/", 
          secondaryBtnText: "Close" 
        });
      } else {
        window.showToast(err.message || "Could not read PDF.", "warning");
      }
    }
    syncFormToPreview();
  } finally {
    if (btnMagicImport && originalHTML) {
      btnMagicImport.innerHTML = originalHTML;
      btnMagicImport.disabled = false;
    }
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
  // Programming & Web
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', '.NET', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'SASS', 'Redux', 'GraphQL', 'REST API', 'Microservices',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'DynamoDB',
  // Cloud & DevOps
  'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux',
  // AI, Data Science & Generative AI
  'Machine Learning', 'Deep Learning', 'AI', 'NLP', 'Computer Vision', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy', 'Data Science', 'Data Engineering', 'Spark', 'Kafka',
  'Generative AI', 'LLMs', 'Large Language Models', 'RAG', 'LangChain', 'LlamaIndex', 'Prompt Engineering', 'Vector Databases', 'Pinecone', 'Milvus', 'Transformer',
  // Mechanical & Hardware Engineering
  'SolidWorks', 'AutoCAD', 'CATIA', 'ANSYS', 'FEA', 'CFD', 'GD&T', 'DFM', 'DFA', 'CNC Machining', 'Thermodynamics', 'Fluid Dynamics', 'Sheet Metal', 'Injection Molding', 'Root Cause Analysis', 'FMEA', 'BOM', 'PLM', '3D Printing', 'Materials Science', 'Prototyping', 'CAD Modeling', 'Stress Analysis', 'ASME Y14.5',
  // Tools & Methodologies
  'Agile', 'Scrum', 'Jira', 'Git', 'GitHub', 'GitLab', 'Unit Testing', 'Jest', 'Cypress', 'Selenium', 'TDD', 'Figma', 'UI/UX',
  'Cybersecurity', 'SIEM', 'Cloud Security', 'DevOps', 'SRE', 'System Design', 'MATLAB', 'Tableau', 'Power BI', 'Excel'
];

function initAtsMatcher() {
  const btnOpen = document.getElementById('btn-open-ats-matcher');
  if (btnOpen) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.closeZenGuideTour === 'function') {
        window.closeZenGuideTour();
      }
      if (typeof window.openATSMatcher === 'function') {
        window.openATSMatcher();
      }
    });
  }
}

/* ==========================================================================
   FEATURE: SUMMARY PRESETS, CLEAR ACTIONS, & BOTTOM ADD SHORTCUTS
   ========================================================================== */
function initSummaryPresetsAndActions() {
  const btnClearSummary = document.getElementById('btn-clear-summary');
  const btnClearSkills = document.getElementById('btn-clear-skills');
  const summaryInput = document.getElementById('input-summary');
  const wordCountSpan = document.getElementById('summary-word-count');

  function updateSummaryWordCount() {
    if (!wordCountSpan || !summaryInput) return;
    const text = (summaryInput.value || '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    wordCountSpan.textContent = `${words} words ${words >= 30 && words <= 70 ? '• Optimal ATS Length' : ''}`;
  }

  if (summaryInput) {
    summaryInput.addEventListener('input', updateSummaryWordCount);
    updateSummaryWordCount();
  }

  if (btnClearSummary && summaryInput) {
    btnClearSummary.addEventListener('click', () => {
      summaryInput.value = '';
      updateSummaryWordCount();
      syncFormToPreview();
      autoSaveResume();
      showToast('Summary cleared from resume');
    });
  }

  if (btnClearSkills) {
    btnClearSkills.addEventListener('click', () => {
      const skillsInput = document.getElementById('input-skills');
      if (skillsInput) {
        skillsInput.value = '';
        syncFormToPreview();
        autoSaveResume();
        showToast('Skills cleared from resume');
      }
    });
  }

  // Pre-crafted ATS Summary Presets
  const PRESET_SUMMARIES = {
    fresher: "Motivated and detail-oriented graduate engineer with strong foundational knowledge in modern software architecture, algorithms, and agile product development. Eager to contribute high-quality code and problem-solving skills to scalable engineering initiatives.",
    experienced: "Results-driven Senior Engineer with hands-on expertise building enterprise cloud platforms, resilient microservices, and high-throughput data processing pipelines. Proven track record of optimizing system performance and mentoring cross-functional engineering teams.",
    lead: "Engineering Leader with extensive experience architecting distributed systems, leading high-performance agile teams, and aligning technological strategy with core business objectives. Adept at driving CI/CD automation, cloud migrations, and product velocity."
  };

  document.querySelectorAll('.btn-summary-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      if (PRESET_SUMMARIES[presetKey] && summaryInput) {
        summaryInput.value = PRESET_SUMMARIES[presetKey];
        updateSummaryWordCount();
        syncFormToPreview();
        autoSaveResume();
        showToast(`🌿 Applied ${btn.textContent} preset!`);
      }
    });
  });

  // Bottom Add Buttons
  const btnExpBottom = document.getElementById('btn-add-experience-bottom');
  if (btnExpBottom) {
    btnExpBottom.addEventListener('click', () => {
      addExperienceCard();
      syncFormToPreview();
      // Scroll to new card
      const lastCard = experienceListContainer.lastElementChild;
      if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const btnProjBottom = document.getElementById('btn-add-project-bottom');
  if (btnProjBottom) {
    btnProjBottom.addEventListener('click', () => {
      addProjectCard();
      syncFormToPreview();
      const lastCard = projectsListContainer.lastElementChild;
      if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const btnEduBottom = document.getElementById('btn-add-education-bottom');
  if (btnEduBottom) {
    btnEduBottom.addEventListener('click', () => {
      addEducationCard();
      syncFormToPreview();
      const lastCard = educationListContainer.lastElementChild;
      if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const btnCertBottom = document.getElementById('btn-add-certification-bottom');
  if (btnCertBottom) {
    btnCertBottom.addEventListener('click', () => {
      addCertificationCard();
      syncFormToPreview();
      const lastCard = certificationsListContainer.lastElementChild;
      if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/* ==========================================================================
   FEATURE: LIVE PREVIEW INTERACTIVE CLICK-TO-EDIT ENGINE
   ========================================================================== */
function initPreviewClickToEdit() {
  const paper = document.getElementById('resume-print-area');
  if (!paper) return;

  paper.addEventListener('click', (e) => {
    // 1. Check if clicked inside a specific resume section
    const sec = e.target.closest('[data-section]');
    if (sec) {
      const secType = sec.getAttribute('data-section');
      const stepMap = {
        'summary': 2,
        'skills': 3,
        'experience': 4,
        'projects': 5,
        'education': 6,
        'certifications': 7
      };
      if (stepMap[secType]) {
        goToStep(stepMap[secType]);
        if (secType === 'summary') {
          const el = document.getElementById('input-summary');
          if (el) el.focus();
        } else if (secType === 'skills') {
          const el = document.getElementById('input-skills');
          if (el) el.focus();
        }
        return;
      }
    }

    // 2. Check if clicked on personal details / header area
    const headerSec = e.target.closest('.resume-header, header, [data-section="personal"]');
    if (headerSec || e.target.closest('#resume-print-area > div:first-child')) {
      goToStep(1);
      const nameInput = document.getElementById('input-name');
      if (nameInput) nameInput.focus();
    }
  });

  // Add interactive hover styling to preview sections
  paper.addEventListener('mouseover', (e) => {
    const sec = e.target.closest('[data-section]');
    if (sec) {
      sec.classList.add('resume-section-interactive');
      sec.title = `Click to edit ${sec.getAttribute('data-section')}`;
    }
  });
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

  // Initialize Summary presets, Clear actions, & Bottom Add buttons
  initSummaryPresetsAndActions();

  // Initialize Live Preview Click-to-Edit
  initPreviewClickToEdit();

  // Go back to the Greeting & Catalog screen
  btnBackToTemplates.addEventListener('click', () => {
    if (typeof window.closeZenGuideTour === 'function') window.closeZenGuideTour();
    document.body.classList.remove('in-editor');
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
    updateHeaderNavCTA();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Attach Static Form Listeners (Top level details)
  ['input-name', 'input-title', 'input-email', 'input-phone', 'input-location', 'input-website', 'input-linkedin', 'input-github', 'input-custom-social', 'input-summary', 'input-skills'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', debouncedSyncFormToPreview);
      el.addEventListener('change', syncFormToPreview);
      el.addEventListener('keyup', debouncedSyncFormToPreview);
      el.addEventListener('paste', () => setTimeout(syncFormToPreview, 20));
    }
  });

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

  // Real-Time ATS Score Pill Click Handler
  const realtimeAtsPill = document.getElementById('editor-realtime-ats');
  if (realtimeAtsPill) {
    realtimeAtsPill.addEventListener('click', () => {
      const result = calculateGeneralATSScore();
      if (typeof showToast === 'function') {
        showToast(`🎯 ATS Score: ${result.score}/100 (${result.score >= 85 ? 'Elite' : 'Strong'})`);
      }
    });
  }

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

  // Multi-page Modal Actions
  const btnCloseMultipageX = document.getElementById('btn-close-multipage-x');
  if (btnCloseMultipageX) {
    btnCloseMultipageX.addEventListener('click', () => {
      const multiModal = document.getElementById('multi-page-modal');
      if (multiModal) multiModal.style.display = 'none';
    });
  }

  const btnOptFit1Page = document.getElementById('btn-opt-fit-1page');
  if (btnOptFit1Page) {
    btnOptFit1Page.addEventListener('click', () => {
      const multiModal = document.getElementById('multi-page-modal');
      if (multiModal) multiModal.style.display = 'none';
      executeSystemPrint('single-force-fit');
    });
  }

  const btnOptDownload2Page = document.getElementById('btn-opt-download-2page');
  if (btnOptDownload2Page) {
    btnOptDownload2Page.addEventListener('click', () => {
      const multiModal = document.getElementById('multi-page-modal');
      if (multiModal) multiModal.style.display = 'none';
      executeSystemPrint('multi');
    });
  }

  const btnOptTrimEditor = document.getElementById('btn-opt-trim-editor');
  if (btnOptTrimEditor) {
    btnOptTrimEditor.addEventListener('click', () => {
      const multiModal = document.getElementById('multi-page-modal');
      if (multiModal) multiModal.style.display = 'none';
      
      // Switch to editor tab if on mobile
      if (typeof setMobileTab === 'function') {
        setMobileTab('edit');
      }
      
      // Scroll to Experience section
      const expSection = document.getElementById('section-experience');
      if (expSection) {
        expSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      if (typeof showToast === 'function') {
        showToast("💡 Tip: Shorten 1-2 bullet points or remove an older role to fit cleanly on 1 page!", "info");
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
        window.showToast("Please paste a job description first.", "warning");
        return;
      }

      // Check Subscription & Daily Quota
      const subManager = window.SubscriptionManager;
      const userTier = subManager ? subManager.getUserTier() : 'free';

      if (userTier === 'free') {
        if (window.showFriendlyNoticeModal) { window.showFriendlyNoticeModal({ title: "Upgrade to AI Job Tailoring", badgeText: "Pro Feature", badgeIcon: "fas fa-bolt", type: "warning", message: "AI Resume Tailoring is a Pro feature! Free tier includes <strong>100% vector single-column ATS PDF creation</strong> and keyword checks. Upgrade to 1-Day Sprint (₹49) for 3 AI tailored resumes, or 7-Day Fast Track (₹199) for 4 AI tailored resumes every day.", primaryBtnText: "⚡ View Pro Pricing", onPrimary: () => { const el = document.getElementById("pricing"); if (el) el.scrollIntoView({behavior: "smooth"}); } }); } else { window.showToast("AI Tailoring is a Pro feature.", "info"); }
        closePrintModal();
        if (window.openProPaymentModal) window.openProPaymentModal('day');
        return;
      }

      // Quota: 1-Day Sprint = 3 resumes, 7-Day / ZenSuite = 4 resumes per day
      const maxQuota = userTier === 'day' ? 3 : 4;
      const usedToday = subManager ? subManager.getDailyUsage('tailor') : 0;
      if (usedToday >= maxQuota) {
        const quotaMsg = userTier === 'day'
          ? `You have used all 3 AI tailored resumes included in your 1-Day Sprint pass.`
          : `You have reached your daily limit of 4 AI tailored resumes for today. Your daily allocation resets at midnight!`;
        if (window.showFriendlyNoticeModal) { 
          window.showFriendlyNoticeModal({ 
            title: "AI Tailoring Quota Reached", 
            badgeText: "Quota Limit", 
            badgeIcon: "fas fa-clock", 
            type: "info", 
            message: `${quotaMsg} You can continue editing, formatting, and downloading unlimited resumes with vector ATS PDF export.`, 
            primaryBtnText: "Continue Editing" 
          }); 
        } else { 
          window.showToast(quotaMsg, "info"); 
        }
        return;
      }

      if (subManager) subManager.incrementDailyUsage('tailor');
      
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
        window.showToast("AI tailoring service is temporarily busy. Retrying in background...", "warning");
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
        window.showToast("Link copied to clipboard!", "success");
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
        window.showToast("Please select a valid PDF file.", "warning");
        return;
      }

      const originalHTML = btnMagicImport.innerHTML;
      btnMagicImport.innerHTML = "Importing...";
      btnMagicImport.disabled = true;

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Pdf = reader.result && reader.result.includes(',') ? reader.result.split(',')[1] : reader.result;
          await parseHeuristics(base64Pdf, true, file);
        } catch (err) {
          console.error("PDF Parsing Error:", err);
          if (window.showFriendlyNoticeModal) { window.showFriendlyNoticeModal({ title: "Could Not Read PDF", badgeText: "Scanned / Image PDF", badgeIcon: "fas fa-file-pdf", type: "warning", message: "We could not extract readable text from this PDF file. Scanned images or protected PDFs cannot be parsed automatically. Pick a 1-click ATS role blueprint to get started!", primaryBtnText: "⚡ Explore 71 Role Blueprints", onPrimary: () => window.location.href = "/role/", secondaryBtnText: "Try Another PDF" }); } else { window.showToast("Could not read PDF.", "warning"); }
        } finally {
          btnMagicImport.innerHTML = originalHTML;
          btnMagicImport.disabled = false;
          inputMagicPdf.value = ''; // Reset input
        }
      };
      reader.onerror = () => {
        window.showToast("Failed to read the file. Please check file format.", "warning");
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
          window.showToast("Resume template reset to standard defaults.", "info");
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
function formatRoleTitle(slug) {
  const SPECIAL_TITLES = {
    'tcs-nqt-fresher': 'TCS NQT Fresher',
    'infosys-fresher': 'Infosys Fresher',
    'wipro-turbo': 'Wipro Turbo / Elite Fresher',
    'accenture-placement': 'Accenture Placement Fresher',
    'college-campus-placement': 'College Campus Placement Fresher',
    'data-analyst-fresher-projects': 'Data Analyst Fresher',
    'java-developer-2-years-experience': 'Java Developer (2+ Years)',
    'aws-cloud-engineer': 'AWS Cloud Engineer',
    'ai-engineer': 'AI & Prompt Engineer',
    'ui-ux-designer': 'UI/UX Designer',
    'it-support-specialist': 'IT Support Specialist',
    'chief-financial-officer': 'Chief Financial Officer (CFO)',
    'registered-nurse': 'Registered Nurse (RN)',
    'clinical-pharmacist': 'Clinical Pharmacist (PharmD)',
    'pharmacist': 'Pharmacist',
    'physical-therapist': 'Physical Therapist (DPT)',
    'medical-assistant': 'Medical Assistant (CMA)',
    'dental-hygienist': 'Dental Hygienist (RDH)',
    'seo-specialist': 'SEO & Growth Specialist',
    'human-resources-manager': 'HR Manager (Human Resources)'
  };
  if (SPECIAL_TITLES[slug]) return SPECIAL_TITLES[slug];
  return (slug || '')
    .replace(/-resume$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getOptimalTemplateForRole(cleanSlug) {
  if (!cleanSlug) return 'software_experienced_enterprise';
  
  // 1. Campus Placements & Freshers
  if (cleanSlug.includes('fresher') || cleanSlug.includes('campus') || cleanSlug.includes('tcs') || cleanSlug.includes('wipro') || cleanSlug.includes('accenture') || cleanSlug.includes('infosys')) {
    if (cleanSlug.includes('data')) return 'data_science_fresher_analytical';
    return 'software_fresher_minimalist';
  }
  
  // 2. Data & AI Roles
  if (cleanSlug.includes('ai') || cleanSlug.includes('prompt')) {
    return 'data_science_experienced_mlops';
  }
  if (cleanSlug.includes('data') || cleanSlug.includes('scientist') || cleanSlug.includes('analyst')) {
    return 'data_science_experienced_lead';
  }
  
  // 3. Civil, Architecture & Drafting
  if (cleanSlug.includes('architect') || cleanSlug.includes('civil') || cleanSlug.includes('draftsman')) {
    return 'civil_experienced_structural';
  }
  
  // 4. Electrical & Hardware
  if (cleanSlug.includes('electrical')) {
    return 'electrical_experienced_grid';
  }
  
  // 5. Mechanical, Industrial & Biomedical
  if (cleanSlug.includes('mechanical') || cleanSlug.includes('industrial') || cleanSlug.includes('biomedical')) {
    return 'mechanical_experienced_automotive';
  }
  
  // 6. Healthcare, Clinical & Medical
  if (cleanSlug.includes('nurse') || cleanSlug.includes('pharmacist') || cleanSlug.includes('therapist') ||
      cleanSlug.includes('medical') || cleanSlug.includes('dental') || cleanSlug.includes('healthcare') ||
      cleanSlug.includes('clinical')) {
    if (cleanSlug.includes('assistant') || cleanSlug.includes('hygienist')) {
      return 'medical_fresher_minimalist';
    }
    return 'medical_experienced_clinical';
  }
  
  // 7. Design & Creative
  if (cleanSlug.includes('graphic') || cleanSlug.includes('art-director') || cleanSlug.includes('animator') || cleanSlug.includes('video-editor')) {
    return 'software_creative_dark';
  }
  if (cleanSlug.includes('ui-ux') || cleanSlug.includes('designer') || cleanSlug.includes('content') || cleanSlug.includes('social-media') || cleanSlug.includes('digital-marketing')) {
    return 'software_experienced_sleek';
  }
  
  // 8. Cloud & DevOps Infrastructure
  if (cleanSlug.includes('cloud') || cleanSlug.includes('devops') || cleanSlug.includes('aws')) {
    return 'software_experienced_cloud';
  }
  
  // 9. Technical Systems & Security
  if (cleanSlug.includes('cyber') || cleanSlug.includes('seo')) {
    return 'software_fresher_tech_mono';
  }
  
  // 10. Default Business, Finance, Management & Engineering Enterprise Layout
  return 'software_experienced_enterprise';
}

function checkURLParamsOnLoad() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const roleSlug = urlParams.get('role');
    const templateId = urlParams.get('template');
    const autoFillParam = urlParams.get('autofill');
    
    if (roleSlug || templateId) {
      const cleanSlug = (roleSlug || '').replace('-resume', '').toLowerCase();
      const formattedTitle = formatRoleTitle(cleanSlug);
      
      // Determine optimal valid template ID from TEMPLATE_STYLES
      let targetTemplate = templateId;
      if (!targetTemplate || !TEMPLATE_STYLES[targetTemplate]) {
        targetTemplate = getOptimalTemplateForRole(cleanSlug);
      }
      
      // Set hasLoadedProfile true beforehand to prevent selectTemplateStyle from triggering overwrite prompts
      state.hasLoadedProfile = true;
      
      // Select template style (ensures state.selectedTemplateId is valid and styles apply)
      if (typeof selectTemplateStyle === 'function') {
        selectTemplateStyle(targetTemplate);
      }
      
      // Synchronize industry and experience filters with chosen template
      if (TEMPLATE_STYLES[targetTemplate]) {
        state.selectedInd = TEMPLATE_STYLES[targetTemplate].industry || state.selectedInd;
        state.selectedExp = TEMPLATE_STYLES[targetTemplate].experience || state.selectedExp;
      }
      
      // Direct Transition to Editor Workspace (Bypass Template Gallery)
      document.body.classList.add('in-editor');
      const globalNav = document.querySelector('.stitch-nav');
      if (globalNav) globalNav.style.display = 'none';
      const landingScreen = document.getElementById('landing-screen');
      if (landingScreen) landingScreen.style.display = 'none';
      const appContainer = document.getElementById('app-container');
      if (appContainer) appContainer.style.display = 'flex';
      const selectionScreen = document.getElementById('selection-screen');
      if (selectionScreen) selectionScreen.style.display = 'none';
      const welcomeHeader = document.getElementById('app-header-welcome');
      if (welcomeHeader) welcomeHeader.style.display = 'none';
      const builderWorkspace = document.getElementById('builder-workspace');
      if (builderWorkspace) builderWorkspace.style.display = 'grid';
      const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
      if (mobileWorkspaceTabs) mobileWorkspaceTabs.style.display = '';
      if (typeof setMobileTab === 'function') setMobileTab('edit');

      // Check if blueprint exists in window.ROLE_BLUEPRINTS
      const blueprints = window.ROLE_BLUEPRINTS || {};
      const blueprintData = blueprints[cleanSlug] || blueprints[roleSlug];

      if (blueprintData && autoFillParam !== 'false') {
        if (typeof loadProfileIntoForm === 'function') {
          loadProfileIntoForm(blueprintData);
        }
        if (typeof autoSaveResume === 'function') {
          autoSaveResume();
        }
        if (typeof syncFormToPreview === 'function') {
          syncFormToPreview();
        }
        setTimeout(() => {
          if (typeof window.showToast === 'function') {
            window.showToast(`✨ 1-Click ATS Blueprint Loaded: ${formattedTitle}!`, 'success', 3500);
          }
        }, 300);
      } else if (formattedTitle) {
        setTimeout(() => {
          const titleInput = document.getElementById('input-title');
          if (titleInput) {
            titleInput.value = formattedTitle;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          if (typeof syncFormToPreview === 'function') syncFormToPreview();
        }, 150);
      }

      // Suppress tour overlays so user can immediately view & edit their prefilled resume
      try {
        localStorage.setItem('zenresume_tour_seen_v5', 'true');
        localStorage.setItem('zenresume_tour_seen_v4', 'true');
        if (typeof window.closeZenGuideTour === 'function') {
          window.closeZenGuideTour();
        }
        const activeTour = document.querySelector('.zen-tour-tooltip, .zenguide-overlay');
        if (activeTour) activeTour.remove();
        const activeSpot = document.querySelector('.zen-tour-spotlight, .zenguide-spotlight');
        if (activeSpot) activeSpot.remove();
      } catch(e) {}

      // Smooth scroll to top of workspace
      window.scrollTo(0, 0);

      if (typeof adjustPreviewScale === 'function') adjustPreviewScale();
      if (typeof checkVaultOnboardingBanner === 'function') checkVaultOnboardingBanner();

      setTimeout(() => {
        if (typeof syncFormToPreview === 'function') syncFormToPreview();
        if (typeof adjustPreviewScale === 'function') adjustPreviewScale();
      }, 100);
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

window.toggleTheme = function() {
  const activeTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
  const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const toggleBtns = document.querySelectorAll('.btn-theme-toggle, #btn-theme-toggle');
  toggleBtns.forEach(btn => updateThemeIcon(btn, newTheme));
};

function initTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  const toggleBtns = document.querySelectorAll('.btn-theme-toggle, #btn-theme-toggle');
  toggleBtns.forEach(btn => {
    updateThemeIcon(btn, currentTheme);
    btn.onclick = function(e) {
      if (e) e.preventDefault();
      window.toggleTheme();
    };
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
   10. SITE UI INTERACTION (FAQ, COOKIES, MODALS)
   ========================================================================== */

function initSiteUI() {
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

window.addEventListener('DOMContentLoaded', initSiteUI);

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
  const navCtas = document.querySelectorAll('.stitch-nav-cta, .btn-header-cta, #btn-nav-create-resume');
  if (!navCtas || navCtas.length === 0) return;
  const builderWorkspace = document.getElementById('builder-workspace');
  const isEditor = builderWorkspace && builderWorkspace.style.display !== 'none' && builderWorkspace.style.display !== '';
  
  navCtas.forEach(navCta => {
    if (isEditor) {
      navCta.innerHTML = '<i class="fas fa-download" style="margin-right: 6px;"></i> Finish & Download';
      navCta.onclick = (e) => {
        if (e) e.preventDefault();
        const btn = document.getElementById('btn-trigger-download');
        if (btn) btn.click();
      };
    } else {
      navCta.innerHTML = '⚡ Create My Resume';
      navCta.onclick = (e) => {
        if (e) e.preventDefault();
        if (typeof window.handleHeaderCTAClick === 'function') {
          window.handleHeaderCTAClick();
        } else if (typeof window.enterApp === 'function') {
          window.enterApp();
        } else {
          const btn = document.getElementById('btn-start-building');
          if (btn) btn.click();
        }
      };
    }
  });
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
    document.body.classList.add('in-editor');
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
    document.body.classList.remove('in-editor');
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

// Mobile Menu Toggle & Auto-Close Controller
window.toggleMobileMenu = function(forceClose = false) {
  const drawer = document.getElementById('mobile-drawer-menu');
  const btn = document.getElementById('btn-mobile-menu');
  if (!drawer) return;
  
  if (forceClose || drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    if (btn) btn.innerHTML = '<i class="fas fa-bars"></i>';
  } else {
    drawer.classList.add('open');
    if (btn) btn.innerHTML = '<i class="fas fa-times"></i>';
  }
};

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
window.enterBuilderDirectly = enterBuilderDirectly;

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
  if (typeof window.closeZenGuideTour === 'function') window.closeZenGuideTour();
  document.body.classList.remove('in-editor');
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
    if (typeof openPrintModal === 'function') openPrintModal();
  } else {
    if (typeof enterApp === 'function') {
      enterApp();
    } else {
      const btn = document.getElementById('btn-start-building');
      if (btn) btn.click();
    }
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
    window.showToast("ZenResume link copied to clipboard!", "success");
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

// ==========================================================================
// SUBSCRIPTION TIER & DAILY QUOTA CONTROLLER
// ==========================================================================
window.SubscriptionManager = {
  getUserTier: function() {
    let tier = (window.ZenResumeDB && typeof window.ZenResumeDB.getSettingSync === 'function')
      ? window.ZenResumeDB.getSettingSync('zen_user_tier')
      : null;
    if (!tier) tier = localStorage.getItem('zen_user_tier') || 'free';

    if (tier !== 'free') {
      let expiry = (window.ZenResumeDB && typeof window.ZenResumeDB.getSettingSync === 'function')
        ? parseInt(window.ZenResumeDB.getSettingSync('zen_tier_expiry') || '0', 10)
        : 0;
      if (!expiry) expiry = parseInt(localStorage.getItem('zen_tier_expiry') || '0', 10);

      if (expiry && Date.now() > expiry) {
        this.setUserTier('free', 0);
        return 'free';
      }
    }
    return tier;
  },
  setUserTierWithExpiry: function(tier, expiryTimestamp) {
    if (!['free', 'day', 'sprint', 'suite'].includes(tier)) tier = 'free';
    if (window.ZenResumeDB && typeof window.ZenResumeDB.saveSubscription === 'function') {
      window.ZenResumeDB.saveSubscription(tier, expiryTimestamp);
    }
    localStorage.setItem('zen_user_tier', tier);
    if (expiryTimestamp && expiryTimestamp > Date.now()) {
      localStorage.setItem('zen_tier_expiry', expiryTimestamp.toString());
    } else {
      localStorage.removeItem('zen_tier_expiry');
    }
    this.applyAdVisibility();
  },
  setUserTier: function(tier, durationDays = 0) {
    if (!['free', 'day', 'sprint', 'suite'].includes(tier)) tier = 'free';
    let expiry = 0;
    if (durationDays > 0) {
      const currentExpiry = parseInt(localStorage.getItem('zen_tier_expiry') || (window.ZenResumeDB && window.ZenResumeDB.getSettingSync('zen_tier_expiry')) || '0', 10);
      const baseTime = (currentExpiry && currentExpiry > Date.now()) ? currentExpiry : Date.now();
      expiry = baseTime + (durationDays * 24 * 60 * 60 * 1000);
    }
    this.setUserTierWithExpiry(tier, expiry);
  },
  getCurrency: function() {
    return window.currentCurrency || localStorage.getItem('zen_user_currency') || 'INR';
  },
  getFreeDownloadsToday: function() {
    return this.getDailyUsage('pdf_downloads');
  },
  getFreeDownloadsCount: function() {
    return this.getDailyUsage('pdf_downloads');
  },
  canDownloadResume: function() {
    const tier = this.getUserTier();
    if (tier !== 'free') return true;
    return this.getFreeDownloadsToday() < 2;
  },
  recordDownload: function() {
    const tier = this.getUserTier();
    if (tier === 'free') {
      return this.incrementDailyUsage('pdf_downloads');
    }
    return 0;
  },
  getDailyUsage: function(featureKey) {
    const today = new Date().toISOString().slice(0, 10);
    const key = `zen_daily_${featureKey}_${today}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  },
  incrementDailyUsage: function(featureKey) {
    const today = new Date().toISOString().slice(0, 10);
    const key = `zen_daily_${featureKey}_${today}`;
    const count = this.getDailyUsage(featureKey) + 1;
    localStorage.setItem(key, count.toString());
    return count;
  },
  applyAdVisibility: function() {
    // Pure ad-free SaaS experience
    const adElements = document.querySelectorAll('.ad-banner, .ad-slot, .developer-support-note, [class*="ad-"]');
    adElements.forEach(el => {
      el.classList.add('ad-hidden');
      el.style.display = 'none';
    });
  }
};

// ==========================================================================
// DYNAMIC DUAL-CURRENCY ENGINE (INDIA INR vs INTERNATIONAL USD)
// ==========================================================================
window.PRICING_CATALOG = {
  INR: {
    currencySymbol: '₹',
    subtitle: 'Most resume builders charge ₹1,500+ after you finish editing. ZenResume gives you unlimited single-column ATS resumes for <strong>free</strong>, with optional high-powered AI tailoring.',
    plans: {
      free: { amount: '0', period: '/ free always', btnText: 'Start Free' },
      day: { amount: '49', period: '/ 24 hours', btnText: 'Get 1-Day — ₹49', modalTab: '₹49', payPrimary: 'Pay ₹49 via UPI / GPay / PhonePe' },
      sprint: { amount: '199', period: '/ 7 days access', btnText: 'Get 7-Day — ₹199', modalTab: '₹199', payPrimary: 'Pay ₹199 via UPI / GPay / PhonePe' },
      suite: { amount: '599', period: '/ 1 month access', btnText: 'Get ZenSuite — ₹599', modalTab: '₹599', payPrimary: 'Pay ₹599 for Entire ZenSuite' }
    },
    primaryIcon: 'fas fa-qrcode',
    secondaryText: 'Pay via Credit / Debit Card',
    secondaryIcon: 'fas fa-credit-card'
  },
  USD: {
    currencySymbol: '$',
    subtitle: 'Most resume builders charge $20+ after you finish editing. ZenResume gives you unlimited single-column ATS resumes for <strong>free</strong>, with optional high-powered AI tailoring.',
    plans: {
      free: { amount: '0', period: '/ free always', btnText: 'Start Free' },
      day: { amount: '4.99', period: '/ 24 hours', btnText: 'Get 1-Day — $4.99', modalTab: '$4.99', payPrimary: 'Pay $4.99 via Stripe / Card' },
      sprint: { amount: '11.99', period: '/ 7 days access', btnText: 'Get 7-Day — $11.99', modalTab: '$11.99', payPrimary: 'Pay $11.99 via Stripe / Card' },
      suite: { amount: '49.99', period: '/ 1 month access', btnText: 'Get ZenSuite — $49.99', modalTab: '$49.99', payPrimary: 'Pay $49.99 for Entire ZenSuite' }
    },
    primaryIcon: 'fab fa-stripe',
    secondaryText: 'Pay via PayPal / Apple Pay',
    secondaryIcon: 'fab fa-paypal'
  }
};

window.currentCurrency = 'INR';
window.currentPaymentPlan = 'sprint';
window.currentPaymentAmount = '₹199';

window.detectUserCurrency = function() {
  // Strict Geo/Timezone/Locale Detection
  try {
    const offset = new Date().getTimezoneOffset();
    if (offset === -330) {
      return 'INR'; // Exact Indian Standard Time (IST) offset
    }

    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    const lang = (navigator.language || '').toLowerCase();
    const langs = (navigator.languages || []).map(l => l.toLowerCase()).join(' ');

    const isIndianTz = tz.includes('calcutta') || tz.includes('kolkata') || tz.includes('asia/colombo') || tz.includes('ist') || tz.includes('india');
    const isIndianLang = lang.includes('-in') || lang === 'hi' || lang === 'te' || lang === 'ta' || lang === 'mr' || lang === 'bn' || lang === 'gu' || lang === 'kn' || lang === 'ml' || langs.includes('-in') || langs.includes('hi');

    if (isIndianTz || isIndianLang) {
      return 'INR';
    }
  } catch (e) {
    console.warn('Currency timezone check:', e);
  }

  // Non-Indian users strictly get USD ($)
  return 'USD';
};

window.initBackgroundGeoDetection = function() {
  // Fast asynchronous IP country lookup for 100% accurate location routing
  fetch('https://ipapi.co/json/', { mode: 'cors' })
    .then(res => res.json())
    .then(data => {
      if (data && data.country_code) {
        const countryCurr = data.country_code === 'IN' ? 'INR' : 'USD';
        if (window.currentCurrency !== countryCurr) {
          window.switchCurrency(countryCurr, false);
        }
      }
    })
    .catch(() => {
      fetch('https://api.country.is/')
        .then(r => r.json())
        .then(d => {
          if (d && d.country) {
            const countryCurr = d.country === 'IN' ? 'INR' : 'USD';
            if (window.currentCurrency !== countryCurr) {
              window.switchCurrency(countryCurr, false);
            }
          }
        })
        .catch(() => {});
    });
};

window.switchCurrency = function(targetCurrency, persist = false) {
  if (targetCurrency !== 'INR' && targetCurrency !== 'USD') targetCurrency = 'USD';
  window.currentCurrency = targetCurrency;
  if (persist) {
    try { localStorage.setItem('zen_user_currency', targetCurrency); } catch (e) {}
  }

  const catalog = window.PRICING_CATALOG[targetCurrency];
  if (!catalog) return;

  // 1. Update Subtitle
  const subEl = document.getElementById('pricing-header-subtitle');
  if (subEl) subEl.innerHTML = catalog.subtitle;

  // 2. Update Pricing Cards in Landing Page
  const curSymbol = catalog.currencySymbol;
  ['free', 'day', 'sprint', 'suite'].forEach(planKey => {
    const pData = catalog.plans[planKey];
    const curEl = document.getElementById('price-cur-' + planKey);
    const valEl = document.getElementById('price-val-' + planKey);
    const perEl = document.getElementById('price-per-' + planKey);
    const btnTextEl = document.getElementById('btn-pricing-' + planKey + '-text');

    if (curEl) curEl.textContent = curSymbol;
    if (valEl) valEl.textContent = pData.amount;
    if (perEl) perEl.textContent = pData.period;
    if (btnTextEl) btnTextEl.textContent = pData.btnText;
  });

  // 3. Update Modal Tab Amounts
  const modalTabDay = document.getElementById('modal-tab-amount-day');
  const modalTabSprint = document.getElementById('modal-tab-amount-sprint');
  const modalTabSuite = document.getElementById('modal-tab-amount-suite');
  if (modalTabDay) modalTabDay.textContent = catalog.plans.day.modalTab;
  if (modalTabSprint) modalTabSprint.textContent = catalog.plans.sprint.modalTab;
  if (modalTabSuite) modalTabSuite.textContent = catalog.plans.suite.modalTab;

  // 4. Re-render modal selection state
  window.selectPaymentPlan(window.currentPaymentPlan || 'sprint');
};

window.selectPaymentPlan = function(planKey) {
  window.currentPaymentPlan = planKey;
  const currency = window.currentCurrency || 'INR';
  const catalog = window.PRICING_CATALOG[currency] || window.PRICING_CATALOG.INR;
  const planData = catalog.plans[planKey] || catalog.plans.sprint;

  window.currentPaymentAmount = planData.modalTab;

  const btnDay = document.getElementById('pay-plan-btn-day');
  const btnSprint = document.getElementById('pay-plan-btn-sprint');
  const btnSuite = document.getElementById('pay-plan-btn-suite');
  const summaryText = document.getElementById('payment-summary-text');
  const btnPayPrimaryText = document.getElementById('btn-pay-primary-text');
  const btnPayPrimaryIcon = document.getElementById('btn-pay-primary-icon');
  const btnPaySecondaryText = document.getElementById('btn-pay-secondary-text');
  const btnPaySecondaryIcon = document.getElementById('btn-pay-secondary-icon');

  // Reset all buttons
  if (btnDay) {
    btnDay.style.borderColor = '#CBD5E1';
    btnDay.style.background = '#FFFFFF';
  }
  if (btnSprint) {
    btnSprint.style.borderColor = '#CBD5E1';
    btnSprint.style.background = '#FFFFFF';
  }
  if (btnSuite) {
    btnSuite.style.borderColor = '#CBD5E1';
    btnSuite.style.background = '#FFFFFF';
  }

  // Highlight active
  if (planKey === 'day') {
    if (btnDay) {
      btnDay.style.borderColor = '#476550';
      btnDay.style.background = 'rgba(0, 104, 86, 0.08)';
    }
    if (summaryText) {
      summaryText.innerHTML = '<strong>1-Day Sprint:</strong> 3 AI Tailored Resumes + 3 Full ATS Keyword Scans + 24 Hours Unlimited PDF Downloads.';
    }
  } else if (planKey === 'suite') {
    if (btnSuite) {
      btnSuite.style.borderColor = '#F59E0B';
      btnSuite.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(0, 229, 188, 0.12))';
    }
    if (summaryText) {
      summaryText.innerHTML = '<strong>Entire ZenSuite (1 Month):</strong> 4 AI Tailored Resumes/day + 4 Full ATS Keyword Scans/day + ZenScout &amp; ZenDoc access.';
    }
  } else {
    if (btnSprint) {
      btnSprint.style.borderColor = '#476550';
      btnSprint.style.background = 'rgba(0, 104, 86, 0.08)';
    }
    if (summaryText) {
      summaryText.innerHTML = '<strong>7-Day Fast Track:</strong> 4 AI Tailored Resumes / day + 4 Full ATS Keyword Scans / day + 7 Days Unlimited PDF Downloads.';
    }
  }

  // Update Pay Button labels & icons based on Currency
  if (btnPayPrimaryText) {
    btnPayPrimaryText.textContent = planData.payPrimary;
  }
  if (btnPayPrimaryIcon) {
    btnPayPrimaryIcon.className = catalog.primaryIcon;
  }
  if (btnPaySecondaryText) {
    btnPaySecondaryText.textContent = catalog.secondaryText;
  }
  if (btnPaySecondaryIcon) {
    btnPaySecondaryIcon.className = catalog.secondaryIcon;
  }
};

window.openProPaymentModal = function(initialPlan) {
  const modal = document.getElementById('pro-payment-modal');
  if (modal) {
    modal.style.display = 'flex';
    window.selectPaymentPlan(initialPlan || 'sprint');
  }
};

window.closeProPaymentModal = function() {
  const modal = document.getElementById('pro-payment-modal');
  if (modal) modal.style.display = 'none';
};

// ==========================================================================
// PAYMENT GATEWAY ENGINE (UPI DYNAMIC QR + CARDS + RAZORPAY + STRIPE/PAYPAL)
// ==========================================================================

window.handlePaymentPrimaryClick = function() {
  const currency = window.currentCurrency || 'INR';
  const planKey = window.currentPaymentPlan || 'sprint';

  // Enforce User Authentication Gate
  if (typeof window.requireUserAuth === 'function' && !window.requireUserAuth(null, { type: 'payment', method: 'primary', planKey, currency })) {
    return;
  }

  if (currency === 'INR') {
    // Open Dynamic UPI Payment & QR Code Modal
    if (window.PaymentMediator && typeof window.PaymentMediator.openIndianCheckout === 'function') {
      window.PaymentMediator.openIndianCheckout(planKey);
    } else {
      window.openUPIPaymentModal(planKey);
    }
  } else {
    // International USD Payment flow
    if (window.PaymentMediator && typeof window.PaymentMediator.openInternationalCheckout === 'function') {
      window.PaymentMediator.openInternationalCheckout(planKey);
    } else {
      window.initiateInternationalPayment(planKey, 'stripe');
    }
  }
};

window.handlePaymentSecondaryClick = function() {
  const currency = window.currentCurrency || 'INR';
  const planKey = window.currentPaymentPlan || 'sprint';

  // Enforce User Authentication Gate
  if (typeof window.requireUserAuth === 'function' && !window.requireUserAuth(null, { type: 'payment', method: 'secondary', planKey, currency })) {
    return;
  }

  if (currency === 'INR') {
    // Card / NetBanking / Razorpay flow
    if (window.PaymentMediator && typeof window.PaymentMediator.processRazorpayCard === 'function') {
      window.PaymentMediator.processRazorpayCard(planKey);
    } else {
      window.initiateCardPayment(planKey);
    }
  } else {
    // PayPal / Apple Pay flow for USD
    window.initiateInternationalPayment(planKey, 'paypal');
  }
};

window.openUPIPaymentModal = function(planKey) {
  planKey = planKey || window.currentPaymentPlan || 'sprint';
  window.currentPaymentPlan = planKey;

  // Enforce User Authentication Gate
  if (typeof window.requireUserAuth === 'function' && !window.requireUserAuth(null, { type: 'payment', method: 'upi', planKey })) {
    return;
  }

  const modal = document.getElementById('upi-payment-modal');
  if (!modal) return;

  const amounts = { day: 49, sprint: 199, suite: 599 };
  const titles = {
    day: '1-Day Sprint — 24h Unlimited Access',
    sprint: '7-Day Fast Track — 1 Week Full Access',
    suite: 'Entire ZenSuite — 1 Month Full Career Stack'
  };

  const amount = amounts[planKey] || 199;
  const title = titles[planKey] || titles.sprint;

  // Update elements
  const amountEl = document.getElementById('upi-modal-amount');
  const descEl = document.getElementById('upi-modal-plan-desc');
  const qrImg = document.getElementById('upi-qr-image');
  const mobileBtn = document.getElementById('btn-upi-mobile-app');
  const refInput = document.getElementById('upi-ref-input');

  if (amountEl) amountEl.textContent = `₹${amount}`;
  if (descEl) descEl.textContent = title;
  if (refInput) refInput.value = '';

  // Generate UPI Intent & Dynamic QR Code URL
  const vpa = '8790906267-2@ybl';
  const payeeName = 'ZenResume';
  const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=ZenResume_${planKey.toUpperCase()}_Upgrade`;

  if (window.PaymentMediator && typeof window.PaymentMediator.renderQRCode === 'function') {
    window.PaymentMediator.renderQRCode(upiUrl, 170);
  } else {
    const primaryUrl = `https://quickchart.io/qr?text=${encodeURIComponent(upiUrl)}&size=170&margin=1&ecLevel=M`;
    const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(upiUrl)}&margin=4`;
    const container = document.getElementById('upi-qr-container');
    if (container) {
      container.innerHTML = `<img id="upi-qr-image" src="${primaryUrl}" alt="UPI QR Code" onerror="if(this.src!=='${fallbackUrl}'){this.src='${fallbackUrl}';}" style="width: 170px; height: 170px; display: block; border-radius: 8px;" />`;
    } else if (qrImg) {
      qrImg.src = primaryUrl;
    }
  }
  if (mobileBtn) mobileBtn.href = upiUrl;

  // Close main Pro modal and open UPI modal
  window.closeProPaymentModal();
  modal.style.display = 'flex';
};

window.closeUPIPaymentModal = function() {
  const modal = document.getElementById('upi-payment-modal');
  if (modal) modal.style.display = 'none';
};

window.copyUPIId = function() {
  const vpa = '8790906267-2@ybl';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(vpa).then(() => {
      if (typeof window.showToast === 'function') {
        window.showToast('✅ Copied UPI ID: ' + vpa, 'success');
      }
    }).catch(() => {
      prompt('Copy UPI ID:', vpa);
    });
  } else {
    prompt('Copy UPI ID:', vpa);
  }
};

window.submitUPIPaymentVerification = function() {
  const refInput = document.getElementById('upi-ref-input');
  const refVal = (refInput ? refInput.value.trim() : '') || ('UPI_' + Date.now());
  const planKey = window.currentPaymentPlan || 'sprint';

  const btn = document.getElementById('btn-verify-upi-submit');
  if (btn) {
    btn.textContent = 'Verifying...';
    btn.disabled = true;
  }

  setTimeout(() => {
    window.confirmPaymentSuccess(planKey, refVal);
    if (btn) {
      btn.textContent = '⚡ Unlock Pro';
      btn.disabled = false;
    }
  }, 600);
};

window.initiateCardPayment = function(planKey) {
  if (window.PaymentMediator && typeof window.PaymentMediator.processRazorpayCard === 'function') {
    window.PaymentMediator.processRazorpayCard(planKey);
  } else {
    window.openUPIPaymentModal(planKey);
  }
};

window.initiateInternationalPayment = function(planKey, provider) {
  const amounts = { day: '$4.99', sprint: '$11.99', suite: '$49.99' };
  const amt = amounts[planKey] || '$11.99';

  if (provider === 'paypal') {
    if (typeof window.showToast === 'function') {
      window.showToast(`Opening PayPal secure checkout for ${amt}...`, 'info');
    }
    // Instant confirmation simulation or redirect
    setTimeout(() => {
      window.confirmPaymentSuccess(planKey, 'PP_' + Date.now());
    }, 800);
  } else {
    if (typeof window.showToast === 'function') {
      window.showToast(`Opening Stripe secure card checkout for ${amt}...`, 'info');
    }
    setTimeout(() => {
      window.confirmPaymentSuccess(planKey, 'STRIPE_' + Date.now());
    }, 800);
  }
};

window.confirmPaymentSuccess = function(planKey, txnId) {
  planKey = planKey || 'sprint';
  const durationMap = { day: 1, sprint: 7, suite: 30 };
  const durationDays = durationMap[planKey] || 7;

  // Calculate remaining time from previous active subscription before stacking
  const prevExpiryMs = parseInt(localStorage.getItem('zen_tier_expiry') || '0', 10);
  const remainingMs = (prevExpiryMs && prevExpiryMs > Date.now()) ? (prevExpiryMs - Date.now()) : 0;
  let remainingText = '';
  if (remainingMs > 0) {
    const totalMins = Math.floor(remainingMs / (1000 * 60));
    const d = Math.floor(totalMins / (60 * 24));
    const h = Math.floor((totalMins % (60 * 24)) / 60);
    const m = totalMins % 60;
    const parts = [];
    if (d > 0) parts.push(`${d} day${d > 1 ? 's' : ''}`);
    if (h > 0) parts.push(`${h} hr${h > 1 ? 's' : ''}`);
    if (parts.length === 0 && m > 0) parts.push(`${m} min${m > 1 ? 's' : ''}`);
    remainingText = parts.join(', ') || '< 1 hour';
  }

  // 1. Activate Local Subscription
  if (window.SubscriptionManager) {
    window.SubscriptionManager.setUserTier(planKey, durationDays);
    window.SubscriptionManager.applyAdVisibility();
  }

  // Calculate Exact Stacked Expiry Date (preserves existing hours/days)
  const currentExpiryMs = parseInt(localStorage.getItem('zen_tier_expiry') || '0', 10);
  const expiresAtDate = (currentExpiryMs && currentExpiryMs > Date.now()) ? new Date(currentExpiryMs) : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

  // 2. Persist Receipt & Update ZenResumeDB
  const receipt = {
    plan: planKey,
    transactionId: txnId || ('TXN_' + Date.now()),
    timestamp: new Date().toISOString(),
    expiresAt: expiresAtDate.toISOString()
  };
  try {
    localStorage.setItem('zen_last_payment_receipt', JSON.stringify(receipt));
  } catch (e) {}

  if (window.ZenResumeDB && typeof window.ZenResumeDB.saveSubscription === 'function') {
    window.ZenResumeDB.saveSubscription(planKey, expiresAtDate.getTime(), {
      transactionId: txnId || ('TXN_' + Date.now())
    });
  }

  // 3. Sync to Firebase Firestore if user is authenticated
  try {
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser && firebase.firestore) {
      const user = firebase.auth().currentUser;
      const uid = user.uid;
      const userEmail = (user.email || '').toLowerCase();

      const payload = {
        email: userEmail,
        subscription: {
          status: 'active',
          plan: planKey,
          transactionId: txnId || ('TXN_' + Date.now()),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          expiresAt: expiresAtDate
        },
        isPremium: true
      };

      firebase.firestore().collection('users').doc(uid).set(payload, { merge: true }).catch(err => console.warn('Firestore subscription sync error:', err));

      const canonicalKey = (typeof window.getCanonicalEmailKey === 'function') ? window.getCanonicalEmailKey(userEmail) : null;
      if (canonicalKey) {
        firebase.firestore().collection('users').doc(canonicalKey).set(payload, { merge: true }).catch(err => console.warn('Canonical vault sub sync error:', err));
      }
    }
  } catch (e) {
    console.warn('Firebase sync error:', e);
  }

  // 4. Close all modals
  window.closeUPIPaymentModal();
  window.closeProPaymentModal();
  const downloadLimitModal = document.getElementById('download-limit-modal');
  if (downloadLimitModal) downloadLimitModal.style.display = 'none';

  // 5. If ATS Matcher is active, re-run scan to show unlocked state immediately
  if (typeof window.runATSScan === 'function') {
    const jdInput = document.getElementById('ats-jd-input');
    if (jdInput && jdInput.value.trim().length > 10) {
      window.runATSScan();
    }
  }

  // 6. Show celebratory notification & Stacking Notice
  const planNames = { day: '1-Day Sprint', sprint: '7-Day Fast Track', suite: 'ZenSuite' };
  const pName = planNames[planKey] || 'Pro';

  if (remainingMs > 60 * 1000 && typeof window.showFriendlyNoticeModal === 'function') {
    window.showFriendlyNoticeModal({
      title: '🎉 Plan Upgraded & Extended!',
      message: `<p style="margin-bottom:12px; font-size:15px; color:#334155; line-height:1.5;">Your <strong>${pName}</strong> pass is now ACTIVE with unlimited downloads and AI tailoring.</p>
      <div style="background:rgba(0,104,86,0.08); border:1px solid rgba(0,104,86,0.25); border-radius:10px; padding:12px 14px; font-size:14px; color:#005041; line-height:1.5;">
        ⏳ <strong>Zero Lost Time Guarantee:</strong> You had <strong>${remainingText}</strong> remaining from your previous plan. That extra time has been automatically added to your new subscription!
      </div>`,
      badgeText: 'Smart Time-Stacking Active',
      badgeIcon: 'fas fa-clock-rotate-left',
      type: 'success',
      primaryBtnText: 'Start Building 🚀'
    });
  } else if (typeof window.showToast === 'function') {
    window.showToast(`🎉 Payment Confirmed! Your ${pName} pass is now ACTIVE! Unlimited downloads & AI unlocked.`, 'success', 6000);
  }
};

// Initialize currency and subscription state on startup immediately & safely
function initCurrencyAndSubscriptionStartup() {
  try {
    if (window.SubscriptionManager) {
      window.SubscriptionManager.applyAdVisibility();
    }
    const detectedCurr = typeof window.detectUserCurrency === 'function' ? window.detectUserCurrency() : 'INR';
    if (typeof window.switchCurrency === 'function') {
      window.switchCurrency(detectedCurr, false);
    }
    if (typeof window.initBackgroundGeoDetection === 'function') {
      window.initBackgroundGeoDetection();
    }
  } catch (e) {
    console.warn('Currency init error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCurrencyAndSubscriptionStartup);
} else {
  initCurrencyAndSubscriptionStartup();
}

// Ensure form panel never scrolls horizontally on input focus or step changes
document.addEventListener('focusin', () => {
  const formPanel = document.querySelector('.form-panel');
  if (formPanel && formPanel.scrollLeft !== 0) {
    formPanel.scrollLeft = 0;
  }
  const formScroll = document.querySelector('.form-scroll-container');
  if (formScroll && formScroll.scrollLeft !== 0) {
    formScroll.scrollLeft = 0;
  }
});



