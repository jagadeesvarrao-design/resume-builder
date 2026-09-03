// firebase-service.js

// Global Friendly Action Modal Engine (UX Masterclass Standard)
window.showFriendlyNoticeModal = function(options = {}) {
  const {
    title = 'Notice',
    message = '',
    badgeText = 'ZenResume Notice',
    badgeIcon = 'fas fa-info-circle',
    type = 'info', // 'info', 'warning', 'success', 'danger'
    primaryBtnText = 'Got It',
    onPrimary = null,
    secondaryBtnText = null,
    onSecondary = null
  } = options;

  // Remove existing modal if open
  const existing = document.getElementById('zen-friendly-modal-root');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'zen-friendly-modal-root';
  backdrop.className = 'zen-friendly-modal-backdrop no-print';

  const badgeClass = 'badge-' + (type === 'error' ? 'danger' : type);

  backdrop.innerHTML = `
    <div class="zen-friendly-modal-card" role="dialog" aria-modal="true">
      <div class="zen-modal-badge ${badgeClass}">
        <i class="${badgeIcon}"></i>
        <span>${badgeText}</span>
      </div>
      <h3 class="zen-modal-title">${title}</h3>
      <div class="zen-modal-body">${message}</div>
      <div class="zen-modal-actions">
        <button type="button" class="btn-zen-modal-primary" id="zen-modal-btn-primary">
          ${primaryBtnText}
        </button>
        ${secondaryBtnText ? `<button type="button" class="btn-zen-modal-secondary" id="zen-modal-btn-secondary">${secondaryBtnText}</button>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeModal = () => {
    backdrop.style.opacity = '0';
    setTimeout(() => backdrop.remove(), 180);
  };

  const primaryBtn = document.getElementById('zen-modal-btn-primary');
  if (primaryBtn) {
    primaryBtn.onclick = () => {
      closeModal();
      if (typeof onPrimary === 'function') onPrimary();
    };
  }

  const secondaryBtn = document.getElementById('zen-modal-btn-secondary');
  if (secondaryBtn) {
    secondaryBtn.onclick = () => {
      closeModal();
      if (typeof onSecondary === 'function') onSecondary();
    };
  }

  // Close on backdrop click
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };

  // Close on ESC
  const onEsc = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onEsc);
    }
  };
  document.addEventListener('keydown', onEsc);
};

// Enhanced Global In-App Toast Engine (Floating Pill, Auto-Dismiss, Tap-to-Dismiss)
window.showToast = function(message, type = 'success', duration = 3500) {
  let toast = document.getElementById('toast-notification');
  let msgSpan = document.getElementById('toast-message');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'no-print';
    toast.innerHTML = '<i class="toast-icon fas fa-check-circle"></i><span id="toast-message"></span>';
    document.body.appendChild(toast);
    msgSpan = document.getElementById('toast-message');
  }

  const iconEl = toast.querySelector('i') || toast.querySelector('.toast-icon');
  
  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  
  // Custom styling per type
  toast.className = 'no-print zen-inapp-toast toast-' + type;
  if (iconEl) {
    if (type === 'error' || type === 'danger') {
      iconEl.className = 'toast-icon fas fa-circle-exclamation';
      toast.style.background = 'rgba(26, 12, 14, 0.95)';
      toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      toast.style.boxShadow = '0 12px 36px rgba(239, 68, 68, 0.25), 0 2px 8px rgba(0,0,0,0.5)';
      iconEl.style.color = '#EF4444';
    } else if (type === 'warning') {
      iconEl.className = 'toast-icon fas fa-triangle-exclamation';
      toast.style.background = 'rgba(26, 20, 10, 0.95)';
      toast.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      toast.style.boxShadow = '0 12px 36px rgba(245, 158, 11, 0.25), 0 2px 8px rgba(0,0,0,0.5)';
      iconEl.style.color = '#F59E0B';
    } else if (type === 'info') {
      iconEl.className = 'toast-icon fas fa-circle-info';
      toast.style.background = 'rgba(10, 20, 26, 0.95)';
      toast.style.borderColor = 'rgba(45, 212, 191, 0.4)';
      toast.style.boxShadow = '0 12px 36px rgba(45, 212, 191, 0.2), 0 2px 8px rgba(0,0,0,0.5)';
      iconEl.style.color = '#2DD4BF';
    } else {
      // Default: success / celebration
      iconEl.className = 'toast-icon fas fa-circle-check';
      toast.style.background = 'rgba(12, 24, 20, 0.95)';
      toast.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      toast.style.boxShadow = '0 12px 36px rgba(16, 185, 129, 0.2), 0 2px 8px rgba(0,0,0,0.5)';
      iconEl.style.color = '#10B981';
    }
  }
  
  if (msgSpan) msgSpan.innerHTML = message;
  const cookieBanner = document.getElementById('cookie-consent');
  const isCookieVisible = cookieBanner && window.getComputedStyle(cookieBanner).display !== 'none' && !cookieBanner.classList.contains('hidden');
  toast.style.bottom = isCookieVisible ? '88px' : '28px';
  toast.style.opacity = '1';
  toast.style.pointerEvents = 'auto';

  // Click toast to dismiss immediately
  toast.onclick = function() {
    toast.style.bottom = '-120px';
    toast.style.opacity = '0';
  };

  window._toastTimeout = setTimeout(() => {
    toast.style.bottom = '-120px';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
  }, duration);
};

// Global Safety Interceptor: Route ANY native browser alert to our elegant in-app toast
window.alert = function(message) {
  const isErr = /error|fail|invalid|warning|unauthorized|blocked/i.test(String(message));
  window.showToast(message, isErr ? 'warning' : 'info', 4000);
};

function formatAuthErrorMessage(error) {
  if (!error) return;

  if (error.code === 'auth/unauthorized-domain') {
    console.warn(`[Firebase Developer Notice] Domain "${window.location.hostname}" is not yet added under Firebase Console > Authentication > Settings > Authorized Domains.`);
    
    // Display reassuring, non-alarming user modal
    window.showFriendlyNoticeModal({
      title: 'Cloud Sync in Maintenance',
      badgeText: '100% Free Offline Access',
      badgeIcon: 'fas fa-shield-halved',
      type: 'info',
      message: 'Google Sign-In is temporarily offline for maintenance. ZenResume is <strong>100% Local-First</strong> — you can continue building, editing, and downloading all 71 ATS resume templates offline for free without logging in!',
      primaryBtnText: '⚡ Continue Building Free',
      secondaryBtnText: 'Dismiss'
    });
    return;
  }

  if (error.code === 'auth/popup-blocked') {
    window.showToast('Your browser blocked the sign-in pop-up. Tap Sign In again to retry.', 'warning', 4500);
    return;
  }

  if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
    window.showToast('Sign-In window closed. You can sign in anytime or continue building free.', 'info', 3000);
    return;
  }

  if (error.code === 'auth/network-request-failed') {
    window.showToast('Network connection unstable. Your data is safely stored offline.', 'warning', 4000);
    return;
  }

  window.showToast('Sign-In service is temporarily offline. All free builder tools remain active!', 'info', 4000);
}

const firebaseConfig = {
  apiKey: "AIzaSyAb1ZRnxECLu7ANU3of1zUEKLqgzsvGNq0",
  authDomain: "resume-builder-5e101.firebaseapp.com",
  projectId: "resume-builder-5e101",
  storageBucket: "resume-builder-5e101.firebasestorage.app",
  messagingSenderId: "1054584407727",
  appId: "1:1054584407727:web:34ff0619478222eb5f365a",
  measurementId: "G-GV6BGEFRRW"
};

// Safe Firebase Initialization
let auth = null;
let db = null;
let currentUser = null;
let unsubscribeSubscription = null;

function initFirebaseService() {
  if (typeof firebase === 'undefined' || !firebase.initializeApp) {
    console.warn("[Firebase] SDKs not yet ready, retrying in 80ms...");
    setTimeout(initFirebaseService, 80);
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    db = firebase.firestore();

    // Check for incoming redirect authentication results (Essential for Mobile!)
    auth.getRedirectResult().then(result => {
      if (result && result.user) {
        console.log("[Firebase] Logged in via redirect:", result.user.email);
        window.showToast("Cloud Sync Active! Welcome, " + (result.user.displayName || result.user.email), "success");
      }
    }).catch(err => {
      console.warn("[Firebase] Redirect sign-in check:", err);
      if (err && err.code) {
        window.showToast(formatAuthErrorMessage(err), "warning", 6000);
      }
    });

    // Attach Auth State Observer
    auth.onAuthStateChanged(handleAuthStateChange);

  } catch (err) {
    console.error("[Firebase] Initialization error:", err);
  }
}

// Global Google Sign-In Trigger (Callable from any button, mobile drawer, or script)
window.triggerGoogleLogin = function() {
  if (!auth || typeof firebase === 'undefined') {
    console.warn("[Firebase] Auth not ready yet. Initializing...");
    initFirebaseService();
    if (!auth) {
      window.showToast("Sign-In service is initializing. Please tap again in a moment.", "info");
      return;
    }
  }

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  // Try popup first across both mobile & desktop for smooth, zero-page-reload login
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("[Firebase] Logged in successfully via popup:", result.user.email);
      window.showToast("Cloud Sync Active! Welcome, " + (result.user.displayName || result.user.email), "success");
      // Auto-close mobile drawer if open
      if (typeof window.toggleMobileMenu === 'function') {
        window.toggleMobileMenu(true);
      }
    })
    .catch((error) => {
      console.warn("[Firebase] Popup sign-in error, attempting redirect fallback:", error);
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/cancelled-popup-request' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/internal-error') {
        // Smooth redirect fallback for mobile browsers blocking popups
        auth.signInWithRedirect(provider).catch(redirectErr => {
          console.error("[Firebase] Redirect sign-in error:", redirectErr);
          window.showToast(formatAuthErrorMessage(redirectErr || error), "warning", 6000);
        });
      } else {
        window.showToast(formatAuthErrorMessage(error), "warning", 6000);
      }
    });
};

// Global Logout Trigger
window.triggerLogout = function() {
  if (auth) {
    sessionStorage.removeItem('loginGreetingShown');
    auth.signOut().then(() => {
      window.showToast("Signed out successfully.", "info");
    }).catch(err => console.error("Sign-out error:", err));
  }
};

function updateGreetingBanner(user) {
  const banner = document.getElementById('greeting-banner');
  if (!banner) return;
  
  const hour = new Date().getHours();
  let timeOfDay = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeOfDay = 'Good afternoon';
  } else if (hour >= 17) {
    timeOfDay = 'Good evening';
  }
  
  let name = 'Professional';
  if (user) {
    if (user.displayName) {
      name = user.displayName;
    } else if (user.email) {
      const emailName = user.email.split('@')[0];
      name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
  }
  
  banner.textContent = `${timeOfDay}, ${name}`;
}

// Call initially
updateGreetingBanner(null);

function handleAuthStateChange(user) {
  currentUser = user;
  
  // Landing Header Auth Elements
  const landingLoginBtn = document.getElementById('btn-landing-login');
  const landingProfileDiv = document.getElementById('nav-user-profile');
  const landingUserName = document.getElementById('nav-user-name');
  const landingUserAvatar = document.getElementById('nav-user-avatar');
  const mobileDrawerLogin = document.getElementById('btn-mobile-drawer-login');

  updateGreetingBanner(user);
  
  if (user) {
    let displayName = user.displayName || user.phoneNumber;
    if (!displayName && user.email) {
      const emailName = user.email.split('@')[0];
      displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    // Update Landing Header Auth UI
    if (landingLoginBtn) landingLoginBtn.style.display = 'none';
    if (mobileDrawerLogin) mobileDrawerLogin.style.display = 'none';
    if (landingProfileDiv) {
      landingProfileDiv.style.display = 'inline-flex';
      if (landingUserName) landingUserName.textContent = (displayName || 'User').split(' ')[0];
      if (landingUserAvatar) landingUserAvatar.src = user.photoURL || 'https://via.placeholder.com/150';
    }

    // Cancel old subscription observer before setting new one
    if (unsubscribeSubscription) {
      unsubscribeSubscription();
      unsubscribeSubscription = null;
    }

    // Real-time Firestore subscription listener
    if (db) {
      unsubscribeSubscription = db.collection('users').doc(user.uid).onSnapshot(doc => {
        let isPremium = false;
        if (doc.exists) {
          const data = doc.data();
          if (data.subscription && data.subscription.status === 'active') {
            const expiresAt = data.subscription.expiresAt;
            if (expiresAt) {
              const expDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
              if (expDate > new Date()) {
                isPremium = true;
              }
            }
          }
        }
        if (window.state) window.state.isPremium = isPremium;
        document.dispatchEvent(new CustomEvent('zensuite_premium_status', { detail: { isPremium } }));
        updatePremiumUI(isPremium);
      }, err => {
        console.warn('[ZenSuite] Subscription listener error:', err);
      });
    }

    // Show greeting toast if hasn't been shown this session
    if (!sessionStorage.getItem('loginGreetingShown')) {
      window.showToast(`Login Successful! Welcome, ${user.displayName || user.email || 'Professional'}`);
      sessionStorage.setItem('loginGreetingShown', 'true');
    }
    
    // Attempt to load their resume from Firestore
    if (typeof loadResumeFromFirestore === 'function') {
      loadResumeFromFirestore();
    }
    
    // Automatically load data when user logs in
    if (window.state && !window.state.hasLoadedProfile && typeof loadSavedResume === 'function') {
      loadSavedResume();
      window.state.hasLoadedProfile = true;
    }
  } else {
    // Cancel subscription observer on logout
    if (unsubscribeSubscription) {
      unsubscribeSubscription();
      unsubscribeSubscription = null;
    }
    if (window.state) window.state.isPremium = false;
    document.dispatchEvent(new CustomEvent('zensuite_premium_status', { detail: { isPremium: false } }));
    updatePremiumUI(false);

    // Reset Landing Header Auth UI
    if (landingLoginBtn) landingLoginBtn.style.display = 'inline-flex';
    if (mobileDrawerLogin) mobileDrawerLogin.style.display = 'inline-flex';
    if (landingProfileDiv) landingProfileDiv.style.display = 'none';
    if (landingUserName) landingUserName.textContent = '';

    if (window.state) {
      window.state.hasLoadedProfile = false;
    }
  }
}

// Initialize immediately or on load
initFirebaseService();

// Delegated click binding that ensures clicks ALWAYS register
document.addEventListener('click', (e) => {
  const loginTarget = e.target.closest('#btn-landing-login, #btn-mobile-drawer-login, #btn-google-login, [data-action="google-login"]');
  if (loginTarget) {
    e.preventDefault();
    window.triggerGoogleLogin();
    return;
  }

  const logoutTarget = e.target.closest('#btn-landing-logout, #btn-logout, [data-action="logout"]');
  if (logoutTarget) {
    e.preventDefault();
    window.triggerLogout();
    return;
  }
});

// Email/Password Auth Logic
function initEmailAuth() {
  const btnShowEmailLogin = document.getElementById('btn-show-email-login');
  const emailModal = document.getElementById('email-login-modal');
  const btnCloseEmailModal = document.getElementById('btn-close-email-modal');
  const btnToggleEmailMode = document.getElementById('btn-toggle-email-mode');
  const btnSubmitEmail = document.getElementById('btn-submit-email');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const emailError = document.getElementById('email-auth-error');
  const emailTitle = document.getElementById('email-modal-title');
  const emailToggleText = document.getElementById('email-toggle-text');
  
  let isCreateMode = false;

  if (btnShowEmailLogin && emailModal) {
    btnShowEmailLogin.addEventListener('click', () => {
      emailModal.style.display = 'flex';
      if (emailError) emailError.style.display = 'none';
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    });
  }

  if (btnCloseEmailModal && emailModal) {
    btnCloseEmailModal.addEventListener('click', () => {
      emailModal.style.display = 'none';
    });
  }

  if (btnToggleEmailMode) {
    btnToggleEmailMode.addEventListener('click', (e) => {
      e.preventDefault();
      isCreateMode = !isCreateMode;
      if (emailError) emailError.style.display = 'none';
      
      if (isCreateMode) {
        if (emailTitle) emailTitle.textContent = 'Create an Account';
        if (btnSubmitEmail) btnSubmitEmail.textContent = 'Sign Up';
        if (emailToggleText) emailToggleText.textContent = 'Already have an account?';
        btnToggleEmailMode.textContent = 'Log in';
      } else {
        if (emailTitle) emailTitle.textContent = 'Sign in to ZenResume';
        if (btnSubmitEmail) btnSubmitEmail.textContent = 'Sign In';
        if (emailToggleText) emailToggleText.textContent = "Don't have an account?";
        btnToggleEmailMode.textContent = 'Create one';
      }
    });
  }

  if (btnSubmitEmail) {
    let authAttempts = [];
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_TIME = 60 * 1000; // 1 minute

    btnSubmitEmail.addEventListener('click', async () => {
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      
      if (!email || !password) {
        if (emailError) {
          emailError.textContent = 'Please enter both email and password.';
          emailError.style.display = 'block';
        }
        return;
      }

      const now = Date.now();
      authAttempts = authAttempts.filter(t => now - t < LOCKOUT_TIME);
      if (authAttempts.length >= MAX_ATTEMPTS) {
        if (emailError) {
          emailError.textContent = 'Too many authentication attempts. Please wait 1 minute before trying again.';
          emailError.style.display = 'block';
        }
        return;
      }
      authAttempts.push(now);
      
      try {
        btnSubmitEmail.disabled = true;
        btnSubmitEmail.textContent = 'Please wait...';
        if (emailError) emailError.style.display = 'none';
        
        if (isCreateMode) {
          await auth.createUserWithEmailAndPassword(email, password);
        } else {
          await auth.signInWithEmailAndPassword(email, password);
        }
        
        if (emailModal) emailModal.style.display = 'none';
        window.showToast("Login Successful! Welcome, " + email);
        
      } catch (error) {
        console.error("Email Auth Error:", error);
        if (emailError) {
          emailError.textContent = error.message;
          emailError.style.display = 'block';
        }
      } finally {
        btnSubmitEmail.disabled = false;
        btnSubmitEmail.textContent = isCreateMode ? 'Sign Up' : 'Sign In';
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailAuth);
} else {
  initEmailAuth();
}

// Firestore functions
async function saveResumeToFirestore(stateObj) {
  if (!currentUser) return; // Only save if logged in
  
  try {
    await db.collection('users').doc(currentUser.uid).set({
      resumeData: stateObj,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Visual feedback for cloud sync
    const statusEl = document.querySelector('.preview-status');
    if (statusEl) {
      statusEl.innerHTML = '<span class="status-pulse" style="background-color: #2ecc71;"></span> Saved to Cloud';
      setTimeout(() => {
        statusEl.innerHTML = '<span class="status-pulse"></span> Live Syncing Preview';
      }, 2000);
    }
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
}

async function loadResumeFromFirestore() {
  if (!currentUser) return;
  
  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();
    if (doc.exists) {
      const data = doc.data();
      if (data.resumeData && typeof hydrateStateFromData === 'function') {
        hydrateStateFromData(data.resumeData);
        console.log("Resume loaded successfully");
      }
    }
  } catch (error) {
    console.error("Error loading resume:", error);
  }
}



function updatePremiumUI(isPremium) {
  if (isPremium) {
    document.body.classList.add('zensuite-premium-active');
    const badge = document.getElementById('nav-user-premium-badge');
    if (badge) badge.style.display = 'inline-flex';
  } else {
    document.body.classList.remove('zensuite-premium-active');
    const badge = document.getElementById('nav-user-premium-badge');
    if (badge) badge.style.display = 'none';
  }
}
