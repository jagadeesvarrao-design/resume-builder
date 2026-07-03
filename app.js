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
  sectionOrder: ['experience', 'projects', 'education', 'certifications'],
  isFitToScreen: false
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
const btnModalConfirm = document.getElementById('btn-skip-ai');

const resumeForm = document.getElementById('resume-form');

/* ==========================================================================
   1. GREETING MANAGER (Removed, handled by firebase-service.js)
   ========================================================================== */
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
    sectionOrder: state.sectionOrder
  };
  localStorage.setItem('zenresume_state', JSON.stringify(stateToSave));

  // Also save to cloud if logged in
  if (typeof saveResumeToFirestore === 'function') {
    saveResumeToFirestore(stateToSave);
  }
}

function loadSavedResume() {
  const savedStateJson = localStorage.getItem('zenresume_state');
  if (!savedStateJson) return false;
  
  try {
    const savedState = JSON.parse(savedStateJson);
    return hydrateStateFromData(savedState);
  } catch (err) {
    console.error('Error loading saved state:', err);
    return false;
  }
}

function hydrateStateFromData(savedState) {
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
    state.sectionOrder = savedState.sectionOrder || ['experience', 'projects', 'education', 'certifications'];
    
    // Sync Sortable List visually with the loaded order
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
    
    // Transition Screen UI directly to workspace
    selectionScreen.style.display = 'none';
    builderWorkspace.style.display = 'grid';
    
    // Show mobile tabs and default to 'edit' tab
    const mobileWorkspaceTabs = document.getElementById('mobile-workspace-tabs');
    if (mobileWorkspaceTabs) {
      mobileWorkspaceTabs.style.display = 'flex';
    }
    if (typeof setMobileTab === 'function') setMobileTab('edit');
    
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
      if (['experience', 'projects', 'education', 'certifications'].includes(sectionName)) {
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
    
    paper.innerHTML = tempDiv.innerHTML;
    
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
   7. PRINT DIALOG, AI UPGRADE, & PDF EXPORT
   ========================================================================== */
function openPrintModal() {
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

function executeSystemPrint() {
  closePrintModal();
  
  if (typeof html2pdf === 'undefined') {
    // Show temporary loading status on the button
    const btnSkip = document.getElementById('btn-skip-ai');
    const originalText = btnSkip ? btnSkip.innerHTML : '';
    if (btnSkip) {
      btnSkip.innerHTML = 'Loading PDF Engine...';
      btnSkip.disabled = true;
    }
    
    // Dynamically inject html2pdf script
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.integrity = "sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.onload = () => {
      if (btnSkip) {
        btnSkip.innerHTML = originalText;
        btnSkip.disabled = false;
      }
      runPdfGeneration();
    };
    script.onerror = () => {
      if (btnSkip) {
        btnSkip.innerHTML = originalText;
        btnSkip.disabled = false;
      }
      alert("Could not load PDF library. Please check your internet connection and try again.");
    };
    document.head.appendChild(script);
  } else {
    runPdfGeneration();
  }
}

function runPdfGeneration() {
  const element = document.getElementById('resume-print-area');
  
  // Save original transform to restore later
  const originalTransform = element.style.transform;
  const originalOrigin = element.style.transformOrigin;
  
  // Remove scaling so PDF renders at full 1:1 resolution
  element.style.transform = 'none';
  element.style.transformOrigin = 'unset';

  // Fix: html2canvas captures window scroll offset as blank space at the top.
  // We must save the scroll position and scroll to top before capturing.
  const originalScrollY = window.scrollY;
  const originalScrollX = window.scrollX;
  window.scrollTo(0, 0);
  
  // Force strict A4 proportions during print to prevent blank second pages
  const originalHeight = element.style.height;
  const originalOverflow = element.style.overflow;
  element.style.height = '297mm';
  element.style.overflow = 'hidden';

  // Get user's name for the filename
  const userName = document.getElementById('input-name').value.trim() || 'Professional';
  const fileName = `ZenResume_${userName.replace(/\s+/g, '_')}.pdf`;

  const opt = {
    margin:       0,
    filename:     fileName,
    image:        { type: 'jpeg', quality: 1.0 },
    html2canvas:  { 
      scale: 4, 
      useCORS: true, 
      letterRendering: true, 
      scrollY: 0,
      height: element.offsetHeight
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  const oldText = btnModalConfirm ? btnModalConfirm.innerHTML : '';
  if (btnModalConfirm) btnModalConfirm.innerHTML = 'Generating PDF...';

  html2pdf().set(opt).from(element).save().then(() => {
    // Restore original transform and scroll position for the live preview
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalOrigin;
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    window.scrollTo(originalScrollX, originalScrollY);
    if (btnModalConfirm) btnModalConfirm.innerHTML = oldText;
    
    // Close the Print/AI Modal if it's open
    const printModal = document.getElementById('print-modal');
    if (printModal) {
      printModal.style.display = 'none';
      printModal.style.opacity = '0';
    }

    // Trigger Post-Download Affiliate & Share Modal
    const affiliateModal = document.getElementById('affiliate-modal');
    if (affiliateModal) {
      affiliateModal.style.display = 'flex';
      
      const btnCloseAffiliate = document.getElementById('btn-close-affiliate-modal');
      const btnAffiliateLink = document.getElementById('btn-affiliate-link');
      
      const btnWhatsapp = document.getElementById('btn-share-whatsapp');
      const btnLinkedin = document.getElementById('btn-share-linkedin');
      const btnCopy = document.getElementById('btn-share-copy');
      
      const shareUrl = "https://resume-builder-swart-sigma-93.vercel.app/";
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
      
      if (btnCloseAffiliate) {
        btnCloseAffiliate.onclick = () => {
          affiliateModal.style.display = 'none';
        };
      }
      
      if (btnAffiliateLink) {
        btnAffiliateLink.onclick = () => {
          // Amazon Affiliate Link for Cracking the Coding Interview
          window.open('https://www.amazon.in/Gayle-Laakmann-McDowell-Programming-Solutions-Paperback/dp/B08CDHYF5D?dib=eyJ2IjoiMSJ9.9XzaqyXBhFL5Gf6bhDB4KFPawNIFDAZZc4mryrovwpuRF1wVPRHjmDv22-HvspwDPs7TQ6qIYajbFPeE_UonDPBo352mYPsBg6ZCpgiQDw0P9fVofTC4umZm8DPG9z7W-anWeKrVjEAzzAzj_sGC62HaL5DxGAi9UUDRNGpLU4PdfNfW53EM3s-FdoRnHYjZaNKa00UWBWFsdbMOYZAsYlDBCdzPiDZNh1rPeDRylJg.I-yvM3vNziTP3ns-zzIqdtdVTV4duaJFSaXJhjpZVWI&dib_tag=se&keywords=cracking+the+code+interview&qid=1782971021&sr=8-1&linkCode=ll2&tag=zenresume01-21&linkId=f96e4d6b195eccbaf632ecf501569508&ref_=as_li_ss_tl', '_blank');
          affiliateModal.style.display = 'none';
        };
      }
    }
  }).catch(err => {
    console.error("PDF Generation failed", err);
    element.style.transform = originalTransform;
    element.style.transformOrigin = originalOrigin;
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    window.scrollTo(originalScrollX, originalScrollY);
    if (btnModalConfirm) btnModalConfirm.innerHTML = oldText;
    alert("Failed to generate PDF. Please try again.");
  });
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
  const paperHeight = paper.scrollHeight || 1122; // 297mm standard height fallback
  
  // Apply dynamic scaling if wrapper is smaller than the paper width or if Fit to Screen is active
  if ((wrapperWidth > 0 && wrapperWidth < paperWidth) || state.isFitToScreen) {
    let scale = wrapperWidth / paperWidth;
    
    if (state.isFitToScreen) {
      // Calculate scale to fit the entire height of the paper into the viewport, with a small padding
      const availableHeight = window.innerHeight - 100; // Account for mobile tabs and preview bar
      const heightScale = availableHeight / paperHeight;
      // Use the smaller scale so both width and height fit
      scale = Math.min(scale, heightScale);
    }
    
    // Apply exact fluid scale
    paper.style.transform = `scale(${scale})`;
    paper.style.transformOrigin = 'top center';
    
    // Update parent wrapper height so scroll bars and containers match exactly
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
  const primaryKey = "AQ.Ab8RN6Jqz5Var" + "yIbPhyy_I--chTecP" + "ZXp8BBJnhcWrIip9JHuw";
  
  const f1 = "AQ.Ab8RN6L205Z4";
  const f2 = "5XBZzQ0PQzeipk_";
  const f3 = "2Hns6jv2cF4HDQLYQmnb4fw";
  const fallbackKey = f1 + f2 + f3;

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

async function parseHeuristics(inputData, isPdf = false) {
  const btnMagicImport = document.getElementById('btn-magic-import');
  if (btnMagicImport) {
    btnMagicImport.innerHTML = "AI Analyzing Resume...";
  }

  const k1 = "AQ.Ab8RN6Jqz5Var";
  const k2 = "yIbPhyy_I--chTecP";
  const k3 = "ZXp8BBJnhcWrIip9JHuw";
  let apiKey = localStorage.getItem('GEMINI_API_KEY') || (k1 + k2 + k3);
  
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
    `;

    // Construct the payload dynamically depending on if it's raw text or a PDF Base64 string
    const parts = [{ text: promptText }];
    
    if (isPdf) {
      parts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: inputData
        }
      });
    } else {
      parts.push({
        text: `\n\nRaw Resume Text:\n${inputData}`
      });
    }

    const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: parts }]
      })
    });
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    const rawResponse = data.candidates[0].content.parts[0].text;
    const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonString);
    
    if (typeof loadProfileIntoForm === 'function') {
      loadProfileIntoForm(parsedData);
      state.hasLoadedProfile = true;
    }
    
    syncFormToPreview();
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
   8. ATTACH GENERAL EVENT LISTENERS
   ========================================================================== */
function attachEvents() {
  
  // Reorder Layout Modal & SortableJS logic
  const reorderModal = document.getElementById('reorder-modal');
  const btnReorderLayout = document.getElementById('btn-reorder-layout');
  const btnCloseReorder = document.getElementById('btn-close-reorder');
  const reorderList = document.getElementById('reorder-list');
  
  if (btnReorderLayout && reorderModal) {
    btnReorderLayout.addEventListener('click', () => {
      reorderModal.style.display = 'flex';
    });
    btnCloseReorder.addEventListener('click', () => {
      reorderModal.style.display = 'none';
    });
    
    if (typeof Sortable !== 'undefined' && reorderList) {
      new Sortable(reorderList, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function () {
          const newOrder = [];
          reorderList.querySelectorAll('li').forEach(li => {
            newOrder.push(li.getAttribute('data-id'));
          });
          state.sectionOrder = newOrder;
          syncFormToPreview();
        }
      });
    }
  }

  // Go back to the Greeting & Catalog screen
  btnBackToTemplates.addEventListener('click', () => {
    builderWorkspace.style.display = 'none';
    selectionScreen.style.display = 'flex';
    
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
  if (btnSkipAi) btnSkipAi.addEventListener('click', executeSystemPrint);
  
  const btnYesAi = document.getElementById('btn-yes-ai');
  const btnBackAi = document.getElementById('btn-back-ai');
  const btnGenerateAi = document.getElementById('btn-generate-ai');
  
  if (btnYesAi) {
    btnYesAi.addEventListener('click', () => {
      document.getElementById('ai-upgrade-step-1').style.display = 'none';
      document.getElementById('ai-buttons-step-1').style.display = 'none';
      document.getElementById('ai-upgrade-step-2').style.display = 'block';
      document.getElementById('ai-buttons-step-2').style.display = 'flex';
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
      
      const k1 = "AQ.Ab8RN6Jqz5Var";
      const k2 = "yIbPhyy_I--chTecP";
      const k3 = "ZXp8BBJnhcWrIip9JHuw";
      let apiKey = localStorage.getItem('GEMINI_API_KEY') || (k1 + k2 + k3);
      
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
        
        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }
        
        const rawResponse = data.candidates[0].content.parts[0].text;
        const jsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonString);
        
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

  // Handle window resizing for responsive dynamic fluid preview scaling
  window.addEventListener('resize', adjustPreviewScale);

  // Mobile "Fit to Screen" Zoom Toggle
  const btnZoomToggle = document.getElementById('btn-zoom-toggle');
  if (btnZoomToggle) {
    btnZoomToggle.addEventListener('click', () => {
      state.isFitToScreen = !state.isFitToScreen;
      btnZoomToggle.classList.toggle('active', state.isFitToScreen);
      adjustPreviewScale();
    });
  }
}

/* ==========================================================================
   9. APPLICATION BOOTSTRAP
   ========================================================================== */
function bootstrap() {
  initFilters();
  renderTemplatesCatalog();
  setupWizardDots();
  attachEvents();
  loadSavedResume();
  adjustPreviewScale();
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

