/**
 * ZenResume - Live Activity & Value Pulse (Strategy 5)
 * Continuous 30-second loop showcasing instant value, time saved, and zero-paywall relief.
 * Engineered to show visitors what they gain by using ZenResume's free ATS builder.
 */

(function() {
  'use strict';

  const PULSE_ACTIVITIES = [
    {
      icon: '💸',
      tag: 'SAVED ₹499',
      text: 'Candidate in <strong>Hyderabad</strong> exported a clean vector ATS resume for <strong>100% Free</strong> (avoided paid paywall traps).',
      time: 'Just now'
    },
    {
      icon: '⚡',
      tag: 'BUILT IN 3 MINS',
      text: 'Developer in <strong>Bengaluru</strong> generated <strong>Google XYZ bullet points</strong> in 10s without manual typing.',
      time: '1m ago'
    },
    {
      icon: '🚀',
      tag: 'AUTO-SYNCED',
      text: 'Fresher in <strong>Pune</strong> imported their <strong>GitHub profile & repositories</strong> into single-column ATS format in <strong>12 seconds</strong>.',
      time: '2m ago'
    },
    {
      icon: '🎯',
      tag: '99% ATS SCORE',
      text: 'TCS applicant in <strong>Chennai</strong> passed ATS scanner checks with <strong>zero parsing errors</strong>.',
      time: '4m ago'
    },
    {
      icon: '🛡️',
      tag: '100% PRIVATE',
      text: 'Job seeker in <strong>Visakhapatnam</strong> built their resume with <strong>zero data harvesting or spam emails</strong>.',
      time: '6m ago'
    },
    {
      icon: '📁',
      tag: 'TAILORED IN 1 CLICK',
      text: 'Data Analyst in <strong>Mumbai</strong> created <strong>2 tailored resume versions</strong> in 30 seconds.',
      time: '8m ago'
    },
    {
      icon: '✨',
      tag: '1-PAGE AUTO-FIT',
      text: 'Student in <strong>Delhi NCR</strong> auto-fitted an overflowing draft into <strong>1 perfect single page</strong>.',
      time: '10m ago'
    }
  ];

  let pulseContainer = null;
  let currentIndex = 0;
  let pulseTimer = null;
  let hideTimeout = null;

  function createPulseContainer() {
    if (document.getElementById('zenresume-live-pulse')) return;

    pulseContainer = document.createElement('div');
    pulseContainer.id = 'zenresume-live-pulse';
    pulseContainer.className = 'zenresume-live-pulse no-print';
    pulseContainer.setAttribute('aria-live', 'polite');
    pulseContainer.innerHTML = `
      <div class="pulse-card" id="pulse-card">
        <div class="pulse-avatar-box">
          <span class="pulse-live-ring"></span>
          <span id="pulse-icon" class="pulse-emoji">💸</span>
        </div>
        <div class="pulse-content-col">
          <div class="pulse-header-row">
            <span class="pulse-badge-live" id="pulse-tag"><span class="pulse-dot"></span> SAVED ₹499</span>
            <span id="pulse-time" class="pulse-time-text">Just now</span>
          </div>
          <p id="pulse-text" class="pulse-main-text">Candidate exported clean ATS resume for 100% Free.</p>
          <div class="pulse-action-hint">⚡ Click to build your free resume in 60s &rarr;</div>
        </div>
        <button type="button" class="pulse-close-btn" id="btn-pulse-close" aria-label="Dismiss">&times;</button>
      </div>
    `;

    document.body.appendChild(pulseContainer);

    const closeBtn = document.getElementById('btn-pulse-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeCurrentPulse();
      });
    }

    pulseContainer.addEventListener('click', function() {
      if (typeof window.enterApp === 'function' && document.body.classList.contains('in-editor') === false) {
        window.openOnboardingModal ? window.openOnboardingModal() : window.enterApp();
      }
    });
  }

  function showNextPulse() {
    if (!pulseContainer) return;

    // Only show when user is on landing page (hidden in editor)
    if (document.body.classList.contains('in-editor')) {
      pulseContainer.classList.remove('pulse-visible');
      return;
    }

    const item = PULSE_ACTIVITIES[currentIndex];
    currentIndex = (currentIndex + 1) % PULSE_ACTIVITIES.length;

    const iconEl = document.getElementById('pulse-icon');
    const tagEl = document.getElementById('pulse-tag');
    const textEl = document.getElementById('pulse-text');
    const timeEl = document.getElementById('pulse-time');

    if (iconEl) iconEl.textContent = item.icon;
    if (tagEl) tagEl.innerHTML = `<span class="pulse-dot"></span> ${item.tag}`;
    if (textEl) textEl.innerHTML = item.text;
    if (timeEl) timeEl.textContent = item.time;

    pulseContainer.classList.add('pulse-visible');

    // Stay visible for 7 seconds, then hide smoothly
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(function() {
      if (pulseContainer) {
        pulseContainer.classList.remove('pulse-visible');
      }
    }, 7000);
  }

  function closeCurrentPulse() {
    if (pulseContainer) {
      pulseContainer.classList.remove('pulse-visible');
    }
  }

  // Initial trigger after 3.5 seconds
  setTimeout(function() {
    createPulseContainer();
    showNextPulse();
    
    // Continuous 30-second interval loop as long as user is on landing page
    pulseTimer = setInterval(showNextPulse, 30000);
  }, 3500);

})();
