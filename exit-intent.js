/**
 * ZenResume - Smart Exit-Intent Recovery Engine
 * Strictly rate-limited via sessionStorage to trigger at most once per session
 * when a visitor is about to bounce without starting a resume.
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'zenresume_exit_intent_shown';

  function isEligibleForExitIntent() {
    // 1. Must not have triggered already in this session
    if (sessionStorage.getItem(STORAGE_KEY)) {
      return false;
    }

    // 2. Do not trigger if user is actively inside the builder editing their resume
    const builderWorkspace = document.getElementById('builder-workspace');
    if (builderWorkspace && builderWorkspace.style.display !== 'none' && builderWorkspace.style.display !== '') {
      return false;
    }

    // 3. Do not trigger if another modal is currently open
    const openModals = document.querySelectorAll('.modal-overlay[style*="display: flex"]');
    if (openModals && openModals.length > 0) {
      return false;
    }

    return true;
  }

  function triggerExitIntentModal() {
    if (!isEligibleForExitIntent()) return;

    // Mark as shown in sessionStorage so it never triggers again during this session
    sessionStorage.setItem(STORAGE_KEY, 'true');

    const modal = document.getElementById('exit-intent-modal');
    if (modal) {
      modal.style.display = 'flex';
      console.log('[ExitIntent] Recovery modal displayed (strictly capped once per session).');
    }
  }

  // Desktop: Trigger on mouse leaving viewport towards browser top tabs/address bar
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 15) {
      triggerExitIntentModal();
    }
  });

  // Mobile: Trigger when user has scrolled down and then stays idle near the top for 8s
  let mobileScrollTimer = null;
  window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
      clearTimeout(mobileScrollTimer);
      if (window.scrollY < 120 && isEligibleForExitIntent()) {
        mobileScrollTimer = setTimeout(function() {
          if (window.scrollY < 120) {
            triggerExitIntentModal();
          }
        }, 10000); // 10s idle near top on mobile
      }
    }
  }, { passive: true });

  // Helper to load 1-click blueprint directly from exit modal
  window.loadExitIntentBlueprint = function(roleKey) {
    const key = roleKey || 'tcs_fresher';
    if (typeof window.loadPreset === 'function') {
      window.loadPreset(key);
    } else if (typeof window.selectTemplateStyle === 'function') {
      window.selectTemplateStyle('software_fresher_minimalist');
      if (typeof window.enterApp === 'function') window.enterApp();
    }

    const modal = document.getElementById('exit-intent-modal');
    if (modal) modal.style.display = 'none';
  };

  window.closeExitIntentModal = function() {
    const modal = document.getElementById('exit-intent-modal');
    if (modal) modal.style.display = 'none';
  };

})();
