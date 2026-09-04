/**
 * ZenResume - Universal Cross-Device Editor Navigator ("ZenGuide 🧭")
 * Engineered to work seamlessly across all smartphones, tablets, laptops, and desktops.
 * Intelligently switches mobile tabs, anchors next to active buttons, and spotlights controls.
 * Strictly auto-launches only for first-time visitors who have not seen the tour.
 */

(function() {
  'use strict';

  const TOUR_SEEN_KEY = 'zenresume_tour_seen_v4';

  const TOUR_STEPS = [
    {
      targetId: 'btn-back-to-templates',
      panel: 'edit',
      title: '← Templates Gallery',
      desc: 'Click here anytime to return to the template gallery and switch between 63+ ATS blueprint styles categorized by role and industry.',
      tip: 'Your typed data is always auto-saved in your browser before switching.',
      badge: 'Step 1 of 12'
    },
    {
      targetId: 'select-profile-version',
      panel: 'edit',
      title: '📁 Multi-Profile Vault',
      desc: 'Manage multiple tailored resume versions (e.g. Full-Stack Dev, TCS Fresher, Data Analyst). Click <strong>+</strong> to save a new tailored version.',
      tip: 'Tailoring your resume to each job description increases interview callbacks by 3x.',
      badge: 'Step 2 of 12'
    },
    {
      targetId: 'select-layout-inline',
      panel: 'edit',
      title: '🎨 Instant Style Switcher',
      desc: 'Switch between Single-Column ATS, Serene Modern, Bold Executive, and Tech Grid layouts in 1 click without losing any of your typed data.',
      tip: 'All styles maintain strict single-column vector hierarchy for ATS parsing.',
      badge: 'Step 3 of 12'
    },
    {
      targetId: 'btn-magic-import',
      panel: 'edit',
      title: '✨ Gemini AI Magic Import',
      desc: 'Upload an existing messy PDF or paste raw text. Built-in AI automatically extracts contact details, experience, projects, and skills into the form in 10 seconds.',
      tip: 'Saves 15+ minutes of manual copy-pasting.',
      badge: 'Step 4 of 12'
    },
    {
      targetId: 'btn-open-ats-matcher',
      panel: 'edit',
      title: '🎯 Target Job ATS Matcher',
      desc: 'Paste the job description of your target role. The matcher highlights keyword overlap, missing skills, and calculates your recruiter match score.',
      tip: 'Aim for an ATS match score of 75%+ before submitting your application.',
      badge: 'Step 5 of 12'
    },
    {
      targetId: 'btn-reorder-layout',
      panel: 'edit',
      title: '☰ Reorder Sections',
      desc: 'Drag & drop or use arrows to change section hierarchy (e.g. putting Projects above Experience for freshers, or Certifications near the top).',
      tip: 'Freshers should place Education & Projects first; experienced pros should place Work Experience first.',
      badge: 'Step 6 of 12'
    },
    {
      targetId: 'btn-export-json',
      panel: 'edit',
      title: '💾 Backup JSON File',
      desc: 'ZenResume is 100% private and local-first with zero server database tracking. Click <strong>Backup</strong> to download an offline JSON backup of your resume.',
      tip: 'Keep this backup file safe on your computer or Google Drive.',
      badge: 'Step 7 of 12'
    },
    {
      targetId: 'btn-import-json',
      panel: 'edit',
      title: '📥 Restore Resume Backup',
      desc: 'Upload a previously downloaded JSON backup file to instantly reload your complete resume details on any computer, tablet, or phone.',
      tip: 'Seamlessly transfer your resume across different devices.',
      badge: 'Step 8 of 12'
    },
    {
      targetId: 'btn-reset-defaults',
      panel: 'edit',
      title: '↺ Clear / Reset Form',
      desc: 'Clear the form fields with one click to start completely fresh with a clean blank canvas.',
      tip: 'You can always restore your data from a backup JSON file.',
      badge: 'Step 9 of 12'
    },
    {
      targetId: 'wizard-progress-dots',
      panel: 'edit',
      title: '📑 Form Wizard Steps',
      desc: 'Jump directly between Personal Details, Summary, Skills, Experience, Projects, Education, and Certifications.',
      tip: 'Look for the ⚡ AI Bullet Suggester inside each section to generate Google XYZ bullets.',
      badge: 'Step 10 of 12'
    },
    {
      targetId: 'btn-spacing-toggle',
      panel: 'preview',
      title: '⚙️ Spacing & Fit to 1 Page',
      desc: 'Fine-tune page margins, section gaps, line spacing, font scale, or click <strong>⚡ Fit to 1 Single Page</strong> to automatically fit your content perfectly onto one page.',
      tip: 'Prevents awkward 2-line overflow onto a blank second page.',
      badge: 'Step 11 of 12'
    },
    {
      targetId: 'btn-trigger-download',
      panel: 'preview',
      title: '📥 Download 100% Vector PDF',
      desc: 'Generate a crisp, machine-parsable vector PDF with 100% text readability for ATS bots, zero watermarks, and zero hidden fees.',
      tip: 'In browser print settings, uncheck "Headers and Footers" for the cleanest result.',
      badge: 'Step 12 of 12'
    }
  ];

  let currentTourIndex = 0;
  let activeSpotlightEl = null;

  function ensureTourOverlay() {
    let overlay = document.getElementById('zenguide-tour-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'zenguide-tour-overlay';
      overlay.className = 'zenguide-overlay no-print';
      overlay.innerHTML = `
        <div class="zenguide-pointer-arrow" id="zenguide-pointer-arrow"></div>
        <div class="zenguide-card" id="zenguide-card">
          <div class="zenguide-header">
            <div class="zenguide-avatar-wrap">
              <div class="zenguide-avatar-pulse"></div>
              <div class="zenguide-avatar">🧭</div>
            </div>
            <div class="zenguide-header-text">
              <div class="zenguide-badge" id="zenguide-step-badge">Step 1 of 12</div>
              <h4 class="zenguide-title" id="zenguide-title">ZenGuide Navigator</h4>
            </div>
            <button type="button" class="zenguide-close-btn" onclick="window.closeZenGuideTour()" aria-label="Close Guided Tour">&times;</button>
          </div>
          <div class="zenguide-body">
            <p class="zenguide-desc" id="zenguide-desc"></p>
            <div class="zenguide-tip-box" id="zenguide-tip-box">
              <i class="fas fa-lightbulb" style="color: #F59E0B; font-size: 13px;"></i>
              <span id="zenguide-tip"></span>
            </div>
          </div>
          <div class="zenguide-footer">
            <button type="button" class="zenguide-btn-secondary" id="zenguide-prev-btn" onclick="window.prevZenGuideStep()">
              <i class="fas fa-arrow-left"></i> Back
            </button>
            <div class="zenguide-step-counter" id="zenguide-step-counter">1 / 12</div>
            <button type="button" class="zenguide-btn-primary" id="zenguide-next-btn" onclick="window.nextZenGuideStep()">
              Next Button <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function clearSpotlight() {
    if (activeSpotlightEl) {
      activeSpotlightEl.classList.remove('zenguide-spotlight-active');
      activeSpotlightEl = null;
    }
    const allActive = document.querySelectorAll('.zenguide-spotlight-active');
    allActive.forEach(el => el.classList.remove('zenguide-spotlight-active'));
  }

  function positionTourCard(targetEl, overlay) {
    const card = document.getElementById('zenguide-card');
    const arrow = document.getElementById('zenguide-pointer-arrow');
    if (!overlay || !card) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Mobile / Smartphone / Tablet layout: fixed bottom drawer
      overlay.style.position = 'fixed';
      overlay.style.top = 'auto';
      overlay.style.bottom = '12px';
      overlay.style.left = '10px';
      overlay.style.right = '10px';
      overlay.style.width = 'calc(100vw - 20px)';
      overlay.style.maxWidth = '100%';
      overlay.style.zIndex = '999999';

      if (arrow) arrow.style.display = 'none';
      return;
    }

    // Desktop / Laptop: Anchor directly to target button
    if (!targetEl) {
      overlay.style.position = 'fixed';
      overlay.style.top = '40px';
      overlay.style.right = '40px';
      overlay.style.left = 'auto';
      overlay.style.bottom = 'auto';
      overlay.style.width = '360px';
      overlay.style.zIndex = '999999';
      if (arrow) arrow.style.display = 'none';
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const cardWidth = 360;
    const cardHeight = card.offsetHeight || 220;

    let top = 0;
    let left = 0;
    let arrowClass = 'arrow-top';

    if (rect.bottom + cardHeight + 20 < window.innerHeight) {
      top = rect.bottom + 14;
      arrowClass = 'arrow-top';
    } else if (rect.top - cardHeight - 20 > 0) {
      top = rect.top - cardHeight - 14;
      arrowClass = 'arrow-bottom';
    } else {
      top = Math.max(20, (window.innerHeight - cardHeight) / 2);
      arrowClass = 'hidden';
    }

    const targetCenterX = rect.left + rect.width / 2;
    left = targetCenterX - cardWidth / 2;

    if (left < 20) left = 20;
    if (left + cardWidth > window.innerWidth - 20) {
      left = window.innerWidth - cardWidth - 20;
    }

    overlay.style.position = 'fixed';
    overlay.style.top = top + 'px';
    overlay.style.left = left + 'px';
    overlay.style.right = 'auto';
    overlay.style.bottom = 'auto';
    overlay.style.width = cardWidth + 'px';
    overlay.style.zIndex = '999999';

    if (arrow) {
      arrow.style.display = 'block';
      const arrowLeft = Math.max(25, Math.min(cardWidth - 25, targetCenterX - left));
      arrow.style.left = arrowLeft + 'px';
      arrow.className = 'zenguide-pointer-arrow ' + arrowClass;
    }
  }

  function renderTourStep(index) {
    if (index < 0 || index >= TOUR_STEPS.length) return;
    currentTourIndex = index;

    clearSpotlight();

    const step = TOUR_STEPS[index];
    const overlay = ensureTourOverlay();
    overlay.style.display = 'block';

    // Switch mobile workspace tab if necessary
    if (window.innerWidth <= 768 && typeof window.setMobileTab === 'function') {
      window.setMobileTab(step.panel);
    }

    const badgeEl = document.getElementById('zenguide-step-badge');
    const titleEl = document.getElementById('zenguide-title');
    const descEl = document.getElementById('zenguide-desc');
    const tipEl = document.getElementById('zenguide-tip');
    const counterEl = document.getElementById('zenguide-step-counter');

    if (badgeEl) badgeEl.textContent = step.badge;
    if (titleEl) titleEl.innerHTML = step.title;
    if (descEl) descEl.innerHTML = step.desc;
    if (tipEl) tipEl.innerHTML = step.tip;
    if (counterEl) counterEl.textContent = (index + 1) + ' / ' + TOUR_STEPS.length;

    const prevBtn = document.getElementById('zenguide-prev-btn');
    const nextBtn = document.getElementById('zenguide-next-btn');

    if (prevBtn) {
      prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    }

    if (nextBtn) {
      if (index === TOUR_STEPS.length - 1) {
        nextBtn.innerHTML = '⚡ Done! Start Building <i class="fas fa-check"></i>';
        nextBtn.classList.add('btn-finish');
      } else {
        nextBtn.innerHTML = 'Next Button <i class="fas fa-arrow-right"></i>';
        nextBtn.classList.remove('btn-finish');
      }
    }

    setTimeout(function() {
      const targetEl = document.getElementById(step.targetId);
      if (targetEl) {
        activeSpotlightEl = targetEl;
        targetEl.classList.add('zenguide-spotlight-active');
        
        try {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } catch (e) {}

        setTimeout(function() {
          positionTourCard(targetEl, overlay);
        }, 120);
      } else {
        positionTourCard(null, overlay);
      }
    }, 80);
  }

  window.startZenGuideTour = function(force) {
    if (force === undefined) force = true;
    if (!force && localStorage.getItem(TOUR_SEEN_KEY)) {
      return;
    }
    renderTourStep(0);
  };

  window.nextZenGuideStep = function() {
    if (currentTourIndex < TOUR_STEPS.length - 1) {
      renderTourStep(currentTourIndex + 1);
    } else {
      window.closeZenGuideTour();
    }
  };

  window.prevZenGuideStep = function() {
    if (currentTourIndex > 0) {
      renderTourStep(currentTourIndex - 1);
    }
  };

  window.closeZenGuideTour = function() {
    clearSpotlight();
    const overlay = document.getElementById('zenguide-tour-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    // Permanently remember tour is seen on this device
    localStorage.setItem(TOUR_SEEN_KEY, 'true');
  };

  window.checkAutoLaunchTour = function() {
    // Only auto-launch for users who haven't completed or dismissed the tour
    const hasSeen = localStorage.getItem(TOUR_SEEN_KEY);
    if (hasSeen) {
      return;
    }

    setTimeout(function() {
      const builderWorkspace = document.getElementById('builder-workspace');
      if (document.body.classList.contains('in-editor') && builderWorkspace && builderWorkspace.style.display !== 'none' && builderWorkspace.style.display !== '') {
        window.startZenGuideTour(false);
      }
    }, 600);
  };

  window.addEventListener('resize', function() {
    const overlay = document.getElementById('zenguide-tour-overlay');
    if (overlay && overlay.style.display !== 'none') {
      positionTourCard(activeSpotlightEl, overlay);
    }
  });

})();
