/**
 * ZenResume - Universal Cross-Device Editor Navigator ("ZenGuide 🧭")
 * Engineered to work seamlessly across all smartphones, tablets, laptops, and desktops.
 * Intelligently switches mobile tabs, anchors next to active buttons, and spotlights controls.
 * Replaces lengthy tours with a high-impact, 4-step core onboarding journey.
 */

(function() {
  'use strict';

  const TOUR_SEEN_KEY = 'zenresume_tour_seen_v5';

  const TOUR_STEPS = [
    {
      targetId: 'select-layout-inline',
      panel: 'edit',
      title: '🎨 1. Choose Your ATS Style',
      desc: 'Switch between <strong>Minimalist Classic</strong>, <strong>Serene Modern</strong>, <strong>Bold Executive</strong>, and <strong>Tech Grid</strong> in 1 click. Your data automatically re-formats without losing any typed content.',
      tip: 'All layouts maintain strict single-column vector hierarchy for 100% ATS parser readability.',
      badge: 'Step 1 of 4 • Layouts'
    },
    {
      targetId: 'btn-magic-import',
      panel: 'edit',
      title: '✨ 2. Fill Details or AI Import',
      desc: 'Type step-by-step in the section tabs below, or click <strong>AI Import</strong> to upload an existing PDF resume or GitHub username to auto-populate the form in 10 seconds!',
      tip: 'Look for the ⚡ AI Bullet Suggester inside Experience & Projects to generate quantified Google XYZ bullets.',
      badge: 'Step 2 of 4 • Smart Input'
    },
    {
      targetId: 'editor-realtime-ats',
      panel: 'edit',
      title: '🎯 3. Real-Time ATS Score & Matcher',
      desc: 'Watch your <strong>ATS Health Meter</strong> calculate in real time as you add action verbs and metrics. Click <strong>ATS Matcher</strong> to paste any target job description and detect missing keywords.',
      tip: 'Aim for a score of 85%+ to maximize recruiter callback rates on Workday, Taleo, and Greenhouse.',
      badge: 'Step 3 of 4 • ATS Health'
    },
    {
      targetId: 'btn-trigger-download',
      panel: 'preview',
      title: '📥 4. Instant 100% Free Vector PDF',
      desc: 'Click <strong>Download PDF</strong> to export a high-fidelity, machine-parsable vector PDF directly to your device. <strong>Zero paywalls, zero watermarks, 100% free always.</strong>',
      tip: 'In your browser print dialog, uncheck "Headers and Footers" for the cleanest professional finish.',
      badge: 'Step 4 of 4 • Instant Export'
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
              <div class="zenguide-badge" id="zenguide-step-badge">Step 1 of 4</div>
              <h4 class="zenguide-title" id="zenguide-title">ZenGuide Quick Tour</h4>
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
            <div class="zenguide-step-counter" id="zenguide-step-counter">1 / 4</div>
            <button type="button" class="zenguide-btn-primary" id="zenguide-next-btn" onclick="window.nextZenGuideStep()">
              Next <i class="fas fa-arrow-right"></i>
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
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
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
