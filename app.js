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
  hasLoadedProfile: false
};

// DOM References
const greetingBanner = document.getElementById('greeting-banner');
const selectionScreen = document.getElementById('selection-screen');
const builderWorkspace = document.getElementById('builder-workspace');
const templatesGrid = document.getElementById('templates-grid');

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
const btnModalConfirm = document.getElementById('btn-modal-confirm');

const resumeForm = document.getElementById('resume-form');

/* ==========================================================================
   1. GREETING MANAGER
   ========================================================================== */
function updateGreeting() {
  const hours = new Date().getHours();
  let timeGreeting = "Welcome, Professional";
  
  if (hours >= 5 && hours < 12) {
    timeGreeting = "Good Morning, Professional";
  } else if (hours >= 12 && hours < 17) {
    timeGreeting = "Good Afternoon, Professional";
  } else {
    timeGreeting = "Good Evening, Professional";
  }
  
  greetingBanner.textContent = timeGreeting;
}

/* ==========================================================================
   2. FILTER & CATALOG RENDERER
   ========================================================================== */
function initFilters() {
  // Experience Filter Click Handlers
  expFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-filter')) {
      expFilters.querySelector('.active').classList.remove('active');
      e.target.classList.add('active');
      state.selectedExp = e.target.dataset.exp;
      state.hasLoadedProfile = false; // Reset to reload corresponding mock profile
      renderTemplatesCatalog();
    }
  });

  // Industry Filter Click Handlers
  industryFilters.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-filter')) {
      industryFilters.querySelector('.active').classList.remove('active');
      e.target.classList.add('active');
      state.selectedInd = e.target.dataset.ind;
      state.hasLoadedProfile = false; // Reset to reload corresponding mock profile
      renderTemplatesCatalog();
    }
  });
}

function renderTemplatesCatalog() {
  templatesGrid.innerHTML = '';
  
  Object.keys(TEMPLATE_STYLES).forEach(key => {
    const template = TEMPLATE_STYLES[key];
    if (template.industry !== state.selectedInd || template.experience !== state.selectedExp) {
      return; // Skip templates that don't match the active filters
    }
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
        <span class="template-badge">${state.selectedExp} / ${state.selectedInd}</span>
        <button class="btn-select">Select Style</button>
      </div>
    `;
    
    card.addEventListener('click', () => {
      selectTemplateStyle(template.id);
    });
    
    templatesGrid.appendChild(card);
  });
}

/* ==========================================================================
   3. TEMPLATE INITIALIZATION & DATA LOADING
   ========================================================================== */
function selectTemplateStyle(templateId) {
  state.selectedTemplateId = templateId;
  
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
  builderWorkspace.style.display = 'grid';
  
  // Show mobile tabs and default to 'edit' tab on entry
  const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
  if (mobileWorkspaceTabs) {
    mobileWorkspaceTabs.style.display = 'flex';
  }
  setMobileTab('edit');
  
  // Set current wizard step
  state.currentStep = 1;
  showStep(state.currentStep);
  updateProgressDots();
  
  // Sync the form values immediately to screen preview
  syncFormToPreview();
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
    input.addEventListener('input', syncFormToPreview);
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
    input.addEventListener('input', syncFormToPreview);
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
    input.addEventListener('input', syncFormToPreview);
  });
  
  card.querySelector('.btn-remove-item').addEventListener('click', () => {
    card.remove();
    syncFormToPreview();
  });
  
  educationListContainer.appendChild(card);
}

// --- D. CERTIFICATION CARD ---
function addCertificationCard(text = '') {
  const card = document.createElement('div');
  card.className = 'list-item-card certification-item-card';
  card.style.padding = '12px 18px';
  card.style.flexDirection = 'row';
  card.style.alignItems = 'center';
  card.style.gap = '12px';
  
  card.innerHTML = `
    <input type="text" class="form-input input-cert-text" placeholder="e.g. AWS Solutions Architect Associate" style="flex: 1;">
    <button type="button" class="btn-remove-item" style="position: static; margin-left: auto;">Remove</button>
  `;
  
  // Set value programmatically to avoid quote breaks & HTML injection
  card.querySelector('.input-cert-text').value = text;
  
  card.querySelector('.form-input').addEventListener('input', syncFormToPreview);
  
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
      linkedin: document.getElementById('input-linkedin').value
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
    const text = card.querySelector('.input-cert-text').value.trim();
    if (text) {
      currentData.certifications.push(text);
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
    hasLoadedProfile: state.hasLoadedProfile
  };
  localStorage.setItem('zenresume_state', JSON.stringify(stateToSave));
}

function loadSavedResume() {
  const savedStateJson = localStorage.getItem('zenresume_state');
  if (!savedStateJson) return false;
  
  try {
    const savedState = JSON.parse(savedStateJson);
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
    
    // Set UI filters active state
    expFilters.querySelector('.active').classList.remove('active');
    const expBtn = expFilters.querySelector(`[data-exp="${state.selectedExp}"]`);
    if (expBtn) expBtn.classList.add('active');
    
    industryFilters.querySelector('.active').classList.remove('active');
    const indBtn = industryFilters.querySelector(`[data-ind="${state.selectedInd}"]`);
    if (indBtn) indBtn.classList.add('active');
    
    // Sync inline quick layout selector dynamically
    updateInlineLayoutSwitcher();
    
    // Load profile data directly into the DOM fields
    loadProfileIntoForm(savedState.formData);
    
    // Transition Screen UI directly to workspace
    selectionScreen.style.display = 'none';
    builderWorkspace.style.display = 'grid';
    
    // Show mobile tabs and default to 'edit' tab
    const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
    if (mobileWorkspaceTabs) {
      mobileWorkspaceTabs.style.display = 'flex';
    }
    setMobileTab('edit');
    
    showStep(state.currentStep);
    updateProgressDots();
    
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
      autoFitToSinglePage();
      adjustPreviewScale();
    }
    
    return true;
  } catch (err) {
    console.error('Error loading saved state:', err);
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

function syncFormToPreview() {
  const currentData = extractCurrentFormData();
  
  // Retrieve selected template rendering layout
  const template = TEMPLATE_STYLES[state.selectedTemplateId];
  if (template) {
    const renderedHTML = template.render(currentData);
    const paper = document.getElementById('resume-print-area');
    paper.innerHTML = renderedHTML;
    
    // Toggle sidebar layout padding overrides
    if (state.selectedTemplateId === 'sidebar') {
      paper.classList.add('sidebar-layout');
    } else {
      paper.classList.remove('sidebar-layout');
    }
  }

  // Trigger LocalStorage Auto-Save
  autoSaveResume();

  // Run dynamic single-page auto-fit convergence engine
  autoFitToSinglePage();

  // Adjust preview scaling dynamically if on mobile
  adjustPreviewScale();

  // Regenerate summary suggestions reactively if on the Summary step
  if (state.currentStep === 2) {
    generateSummarySuggestions();
  }
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
  const dots = wizardProgressDots.querySelectorAll('.progress-dot');
  dots.forEach((dot, index) => {
    const stepNum = index + 1;
    dot.className = 'progress-dot';
    if (stepNum === state.currentStep) {
      dot.classList.add('active');
    } else if (stepNum < state.currentStep) {
      dot.classList.add('completed');
    }
  });
}

function showStep(stepNum) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show active step
  const activeStep = document.querySelector(`.form-step[data-step="${stepNum}"]`);
  if (activeStep) {
    activeStep.classList.add('active');
    
    // Smooth scroll top on form container
    document.querySelector('.form-panel').scrollTop = 0;
    
    // Generate dynamic summary suggestions when step 2 is active
    if (stepNum === 2) {
      generateSummarySuggestions();
    }
  }
  
  // Update Navigation Controls Visibility
  if (stepNum === 1) {
    btnWizardPrev.style.visibility = 'hidden';
  } else {
    btnWizardPrev.style.visibility = 'visible';
  }
  
  if (stepNum === state.totalSteps) {
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

function handleWizardNext() {
  if (state.currentStep < state.totalSteps) {
    state.currentStep++;
    showStep(state.currentStep);
    updateProgressDots();
  } else {
    // We are on the final step -> Confirm & Download
    openPrintModal();
  }
}

function handleWizardPrev() {
  if (state.currentStep > 1) {
    state.currentStep--;
    showStep(state.currentStep);
    updateProgressDots();
  }
}

/* ==========================================================================
   7. PRINT DIALOG & PDF EXPORT
   ========================================================================== */
function openPrintModal() {
  printModal.style.display = 'flex';
}

function closePrintModal() {
  printModal.style.display = 'none';
}

function executeSystemPrint() {
  // Close the instructions modal overlay
  closePrintModal();
  
  // Give the browser a brief moment to update the DOM, close the modal completely,
  // and paint the page cleanly before opening the native print dialog. This fixes
  // the blank/black PDF issue caused by backdrop-filter and synchronous main-thread blocking.
  setTimeout(() => {
    window.print();
  }, 250);
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
    
    // Trigger dynamic fluid preview scaling on mobile view tab switch
    setTimeout(adjustPreviewScale, 50);
  }
}

/* ==========================================================================
   7C. FLUID MOBILE PREVIEW SCALING
   ========================================================================== */
function adjustPreviewScale() {
  const wrapper = document.querySelector('.resume-paper-wrapper');
  const paper = document.getElementById('resume-print-area');
  
  if (!wrapper || !paper) return;
  
  const wrapperWidth = wrapper.clientWidth;
  const paperWidth = 794; // 210mm in pixels at 96 dpi is 793.7px
  
  // Apply dynamic scaling if wrapper is smaller than the paper width
  if (wrapperWidth > 0 && wrapperWidth < paperWidth) {
    const scale = wrapperWidth / paperWidth;
    
    // Apply exact fluid scale
    paper.style.transform = `scale(${scale})`;
    paper.style.transformOrigin = 'top center';
    
    // Update parent wrapper height so scroll bars and containers match exactly
    const paperHeight = paper.scrollHeight || 1122; // 297mm standard height fallback
    wrapper.style.height = `${paperHeight * scale}px`;
  } else {
    // Clear dynamic changes when wrapper has full space
    paper.style.transform = '';
    paper.style.transformOrigin = '';
    wrapper.style.height = '';
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
      
      summaryInput.value = text;
      syncFormToPreview();
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
  
  const targetHeight = 1122; // 297mm standard height in pixels (A4)
  
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
  // 2. If it is shorter than the single page, apply expansion classes step-by-step to fill the space
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
   8. ATTACH GENERAL EVENT LISTENERS
   ========================================================================== */
function attachEvents() {
  // Go back to the Greeting & Catalog screen
  btnBackToTemplates.addEventListener('click', () => {
    builderWorkspace.style.display = 'none';
    selectionScreen.style.display = 'flex';
    
    // Hide mobile tabs bar when back to templates
    const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
    if (mobileWorkspaceTabs) {
      mobileWorkspaceTabs.style.display = 'none';
    }
    
    updateGreeting();
  });

  // Attach Static Form Listeners (Top level details)
  document.getElementById('input-name').addEventListener('input', syncFormToPreview);
  document.getElementById('input-title').addEventListener('input', syncFormToPreview);
  document.getElementById('input-email').addEventListener('input', syncFormToPreview);
  document.getElementById('input-phone').addEventListener('input', syncFormToPreview);
  document.getElementById('input-location').addEventListener('input', syncFormToPreview);
  document.getElementById('input-website').addEventListener('input', syncFormToPreview);
  document.getElementById('input-linkedin').addEventListener('input', syncFormToPreview);
  document.getElementById('input-summary').addEventListener('input', syncFormToPreview);
  document.getElementById('input-skills').addEventListener('input', syncFormToPreview);

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
  
  // Modal Actions
  btnModalClose.addEventListener('click', closePrintModal);
  btnModalConfirm.addEventListener('click', executeSystemPrint);

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
    if (e.key === 'Escape' && printModal.style.display === 'flex') {
      closePrintModal();
    }
  });

  // Layout inline switcher dropdown select listener
  const selectLayoutInline = document.getElementById('select-layout-inline');
  if (selectLayoutInline) {
    selectLayoutInline.addEventListener('change', (e) => {
      state.selectedTemplateId = e.target.value;
      syncFormToPreview();
    });
  }

  // Backup / Restore JSON Actions
  const btnExportJson = document.getElementById('btn-export-json');
  const btnImportJson = document.getElementById('btn-import-json');
  const inputImportFile = document.getElementById('input-import-file');
  const btnResetDefaults = document.getElementById('btn-reset-defaults');

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

  // Handle window resizing for responsive dynamic fluid preview scaling
  window.addEventListener('resize', adjustPreviewScale);
}

/* ==========================================================================
   9. APPLICATION BOOTSTRAP
   ========================================================================== */
function bootstrap() {
  updateGreeting();
  initFilters();
  renderTemplatesCatalog();
  setupWizardDots();
  attachEvents();
  loadSavedResume();
  adjustPreviewScale();
}

// Fire up ZenResume!
window.addEventListener('DOMContentLoaded', bootstrap);
