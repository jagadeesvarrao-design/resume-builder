/**
 * ZenResume - Animated Interactive Editor Navigator ("ZenGuide 🧭")
 * An animated AI career navigator that guides first-time users step-by-step
 * through the editor, explaining form inputs, XYZ bullet formulas, ATS scoring,
 * and vector PDF export without requiring trial-and-error exploration.
 */

(function() {
  'use strict';

  const TOUR_COMPLETED_KEY = 'zenresume_tour_completed_v1';

  const TOUR_STEPS = [
    {
      id: 'step-contact',
      target: '#form-step-1',
      title: '👤 Smart Contact & ATS Header',
      desc: 'ATS screening bots require a clean, single-column contact header with zero tables or nested textboxes. Your Name, Email, Phone, and LinkedIn/GitHub URLs are parsed here cleanly.',
      tip: 'Pro-Tip: Keep your target role title aligned with the exact job description you are applying for.',
      badge: 'Step 1 of 4'
    },
    {
      id: 'step-experience',
      target: '#form-step-3',
      title: '💼 Experience & Google XYZ Formula',
      desc: 'Never write vague job descriptions. Use our built-in <strong>Google XYZ Formula</strong>: <em>"Accomplished [X], as measured by [Y], by doing [Z]"</em> with strong action verbs.',
      tip: 'Pro-Tip: Click the ⚡ AI Bullet Suggester button in each job entry to auto-generate high-scoring bullets.',
      badge: 'Step 2 of 4'
    },
    {
      id: 'step-skills',
      target: '#form-step-2',
      title: '🛠️ Skills & Targeted ATS Keywords',
      desc: 'Recruiters search candidate pools using keyword filters. Categorize your technical proficiencies, frameworks, cloud tools, and soft skills into clean comma-separated lists.',
      tip: 'Pro-Tip: Match at least 70% of the keywords mentioned in your target job description.',
      badge: 'Step 3 of 4'
    },
    {
      id: 'step-download',
      target: '#btn-print-resume',
      title: '📥 100% Vector ATS PDF Export',
      desc: 'When ready, click <strong>Download PDF</strong> to generate a machine-readable vector PDF. Zero watermarks, zero hidden paywalls, 100% free and stored privately in your browser.',
      tip: 'Pro-Tip: In the print dialog, uncheck "Headers & Footers" for the cleanest recruiter presentation.',
      badge: 'Step 4 of 4'
    }
  ];

  let currentTourIndex = 0;

  function createTourOverlay() {
    let overlay = document.getElementById('zenguide-tour-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'zenguide-tour-overlay';
      overlay.className = 'zenguide-overlay no-print';
      overlay.innerHTML = `
        <div class="zenguide-card" id="zenguide-card">
          <div class="zenguide-header">
            <div class="zenguide-avatar-wrap">
              <div class="zenguide-avatar-pulse"></div>
              <div class="zenguide-avatar">🧭</div>
            </div>
            <div class="zenguide-header-text">
              <div class="zenguide-badge" id="zenguide-step-badge">Step 1 of 4</div>
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
            <div class="zenguide-dots" id="zenguide-dots">
              <span class="zenguide-dot active"></span>
              <span class="zenguide-dot"></span>
              <span class="zenguide-dot"></span>
              <span class="zenguide-dot"></span>
            </div>
            <button type="button" class="zenguide-btn-primary" id="zenguide-next-btn" onclick="window.nextZenGuideStep()">
              Next Step <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function renderTourStep(index) {
    if (index < 0 || index >= TOUR_STEPS.length) return;
    currentTourIndex = index;

    const step = TOUR_STEPS[index];
    const overlay = createTourOverlay();
    overlay.style.display = 'flex';

    document.getElementById('zenguide-step-badge').textContent = step.badge;
    document.getElementById('zenguide-title').innerHTML = step.title;
    document.getElementById('zenguide-desc').innerHTML = step.desc;
    document.getElementById('zenguide-tip').innerHTML = step.tip;

    // Update buttons
    const prevBtn = document.getElementById('zenguide-prev-btn');
    const nextBtn = document.getElementById('zenguide-next-btn');

    if (prevBtn) {
      prevBtn.style.display = index === 0 ? 'none' : 'inline-flex';
    }

    if (nextBtn) {
      if (index === TOUR_STEPS.length - 1) {
        nextBtn.innerHTML = '⚡ Start Building Resume! <i class="fas fa-check"></i>';
        nextBtn.classList.add('btn-finish');
      } else {
        nextBtn.innerHTML = 'Next Step <i class="fas fa-arrow-right"></i>';
        nextBtn.classList.remove('btn-finish');
      }
    }

    // Update dots
    const dotsContainer = document.getElementById('zenguide-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = TOUR_STEPS.map((_, i) => 
        `<span class="zenguide-dot ${i === index ? 'active' : ''}" onclick="window.jumpToZenGuideStep(${i})"></span>`
      ).join('');
    }

    // Optional Spotlight Scroll
    try {
      if (step.target) {
        const targetEl = document.querySelector(step.target);
        if (targetEl && targetEl.offsetParent !== null) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } catch (e) {}
  }

  window.startZenGuideTour = function(force = true) {
    if (!force && localStorage.getItem(TOUR_COMPLETED_KEY)) {
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

  window.jumpToZenGuideStep = function(index) {
    renderTourStep(index);
  };

  window.closeZenGuideTour = function() {
    const overlay = document.getElementById('zenguide-tour-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  };

  // Auto-launch tour on first entry into builder workspace
  window.checkAutoLaunchTour = function() {
    const hasSeenTour = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!hasSeenTour) {
      setTimeout(function() {
        const builderWorkspace = document.getElementById('builder-workspace');
        if (builderWorkspace && builderWorkspace.style.display !== 'none') {
          window.startZenGuideTour(false);
        }
      }, 900);
    }
  };

})();
