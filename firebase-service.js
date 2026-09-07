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

// Universal Error Message Sanitizer: Guarantees zero technical/backend error leaks to users
window.getCleanErrorMessage = function(error, fallback = 'Operation completed.') {
  if (!error) return fallback;
  
  // Extract string or code
  const code = error.code || '';
  const rawMsg = typeof error === 'string' ? error : (error.message || '');

  // Auth Specific Human Mappings
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account is currently disabled. Please contact support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many login attempts. Please wait 1 minute before trying again.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/popup-blocked':
      return 'Sign-in pop-up was blocked by your browser. Please allow pop-ups.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
    case 'auth/internal-error':
      return 'Sign-In is temporarily offline for maintenance. You can continue creating your resume freely as a Guest!';
  }

  // Strip technical traces from raw messages if any
  let clean = rawMsg
    .replace(/^Firebase:\s*/i, '')
    .replace(/Error\s*\([^)]+\)\.?/gi, '')
    .replace(/auth\/[a-z-]+/gi, '')
    .replace(/\bat\s+[\w\d_$.<>]+\s+\([^)]+\)/gi, '')
    .trim();

  // If message contains internal stack or syntax words, fallback gracefully
  if (!clean || /token|credential|internal server|stack|undefined|null|eval|syntaxerror/i.test(clean)) {
    return fallback;
  }

  return clean;
};

// Global Safety Interceptor: Route ANY native browser alert to our elegant in-app toast
window.alert = function(message) {
  if (!message) return;
  const cleanMsg = window.getCleanErrorMessage(message, 'Notice');
  const isErr = /error|fail|invalid|warning|issue/i.test(String(cleanMsg));
  window.showToast(cleanMsg, isErr ? 'warning' : 'info', 4000);
};

// Central Auth Error Handler
function handleAuthError(error) {
  if (!error) return;
  const code = error.code || '';

  // Log detailed diagnostic to console for developers only
  console.warn('[ZenResume Auth Diagnostic]:', code || error);

  if (code === 'auth/popup-closed-by-user') {
    window.showToast('Sign-In window closed.', 'info', 2000);
    return;
  }

  if (code === 'auth/cancelled-popup-request') {
    // Redundant popup request, ignore gracefully
    return;
  }

  if (code === 'auth/popup-blocked') {
    window.showToast('Browser blocked the sign-in pop-up. Redirecting to Google...', 'info', 3000);
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider).catch(err => console.warn('[Firebase] Redirect retry note:', err));
    return;
  }

  if (code === 'auth/network-request-failed') {
    window.showToast('Network connection unstable. Your data is safely stored in browser storage.', 'warning', 4000);
    return;
  }

  if (code === 'auth/unauthorized-domain') {
    window.showToast('Google Sign-In is completing domain configuration. You can sign in using Email or continue as Guest!', 'info', 5000);
    if (typeof window.openEmailAuthModal === 'function') {
      setTimeout(window.openEmailAuthModal, 600);
    }
    return;
  }

  if (code === 'auth/operation-not-allowed' || code === 'auth/invalid-action') {
    window.showToast('Google Sign-In is completing setup. You can sign in using Email or continue as Guest!', 'info', 5000);
    if (typeof window.openEmailAuthModal === 'function') {
      setTimeout(window.openEmailAuthModal, 600);
    }
    return;
  }

  if (code === 'auth/configuration-not-found' || code === 'auth/internal-error') {
    window.showToast('Sign-In is temporarily offline for maintenance. You can build & export resumes completely free as a Guest!', 'info', 5000);
    return;
  }

  const cleanMessage = window.getCleanErrorMessage(error, 'Sign-In service is temporarily offline. All free builder tools remain active!');
  window.showToast(cleanMessage, 'info', 4000);
}

const firebaseConfig = {
  apiKey: "AIzaSyCIntlqH8b7lahyeRpXXkC5b9TWLoFuxyQ",
  authDomain: "myjobagant.firebaseapp.com",
  projectId: "myjobagant",
  storageBucket: "myjobagant.firebasestorage.app",
  messagingSenderId: "893799021913",
  appId: "1:893799021913:web:8a8b7a7d2dc5432b1e6048",
  measurementId: "G-Z90HSSD2P2"
};

// Safe Firebase Initialization
let auth = null;
let db = null;
let currentUser = null;
let unsubscribeSubscription = null;
let isGoogleAuthInProgress = false;
let lastAuthenticatedUid = null;

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

    // Ensure Local Persistence for frictionless session retention
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(err => {
      console.warn("[Firebase] Persistence note:", err);
    });

    // Check for incoming redirect authentication results (Mobile fallback)
    auth.getRedirectResult().then(result => {
      if (result && result.user) {
        console.log("[Firebase] Logged in via redirect:", result.user.email);
        handleAuthStateChange(result.user);
        window.showToast("Cloud Sync Active! Welcome, " + (result.user.displayName || result.user.email), "success");
      }
    }).catch(err => {
      console.warn("[Firebase] Redirect sign-in check:", err);
      if (err && err.code && err.code !== 'auth/null-user') {
        handleAuthError(err);
      }
    });

    // Attach Auth State Observer
    auth.onAuthStateChanged(handleAuthStateChange);

    // Auto-open login if query param ?login=1 or ?auth=google is present
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('login') === '1' || urlParams.get('auth') === 'google') {
        setTimeout(() => {
          if (!currentUser && typeof window.triggerGoogleLogin === 'function') {
            window.triggerGoogleLogin();
          }
        }, 300);
      }
    } catch (e) {}

  } catch (err) {
    console.warn("[Firebase] Service initialization note:", err);
  }
}

// Global Google Sign-In Trigger (Uses direct Popup with Local Persistence and Redirect Fallback)
window.triggerGoogleLogin = async function() {
  if (isGoogleAuthInProgress) {
    console.log("[Firebase] Auth trigger debounced.");
    return;
  }
  isGoogleAuthInProgress = true;
  setTimeout(() => { isGoogleAuthInProgress = false; }, 8000);

  if (!auth || typeof firebase === 'undefined') {
    initFirebaseService();
    if (!auth) {
      isGoogleAuthInProgress = false;
      window.showToast("Sign-In service is initializing. Please tap again in a moment.", "info");
      return;
    }
  }

  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    // 1. Ensure Persistence is LOCAL
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    // 2. Open Popup for instantaneous, cross-domain safe authentication
    const result = await auth.signInWithPopup(provider);
    isGoogleAuthInProgress = false;

    if (result && result.user) {
      console.log("[Firebase] Sign-in successful:", result.user.email);
      handleAuthStateChange(result.user);
      const name = result.user.displayName || result.user.email || 'Professional';
      window.showToast(`Login Successful! Welcome, ${name}`, 'success');
      if (typeof window.closeEmailAuthModal === 'function') {
        window.closeEmailAuthModal();
      }
    }
  } catch (err) {
    isGoogleAuthInProgress = false;
    console.warn("[Firebase Google Auth Result]:", err);

    if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request')) {
      // User closed popup or cancelled, no intrusive alert needed
      return;
    }

    if (err && err.code === 'auth/popup-blocked') {
      window.showToast("Browser blocked pop-up. Redirecting to Google Sign-In...", "info", 2500);
      try {
        await auth.signInWithRedirect(provider);
      } catch (redirErr) {
        handleAuthError(redirErr);
      }
      return;
    }

    handleAuthError(err);
  }
};

// Global Logout Trigger
window.triggerLogout = function() {
  if (auth) {
    lastAuthenticatedUid = null;
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

function updateUserAvatar(user) {
  const avatarImg = document.getElementById('nav-user-avatar');
  const initialDiv = document.getElementById('nav-user-avatar-initial');
  const mobileImg = document.getElementById('mobile-user-avatar');
  const mobileInitialDiv = document.getElementById('mobile-user-avatar-initial');

  const name = user ? (user.displayName || user.email || 'User') : 'User';
  const initial = (name.trim().charAt(0) || 'U').toUpperCase();

  if (initialDiv) {
    initialDiv.textContent = initial;
    initialDiv.style.display = 'flex';
  }
  if (mobileInitialDiv) {
    mobileInitialDiv.textContent = initial;
    mobileInitialDiv.style.display = 'flex';
  }

  if (user && user.photoURL) {
    if (avatarImg) {
      avatarImg.referrerPolicy = 'no-referrer';
      avatarImg.onload = function() {
        avatarImg.style.display = 'block';
        if (initialDiv) initialDiv.style.display = 'none';
      };
      avatarImg.onerror = function() {
        avatarImg.style.display = 'none';
        if (initialDiv) initialDiv.style.display = 'flex';
      };
      avatarImg.src = user.photoURL;
    }
    if (mobileImg) {
      mobileImg.referrerPolicy = 'no-referrer';
      mobileImg.onload = function() {
        mobileImg.style.display = 'block';
        if (mobileInitialDiv) mobileInitialDiv.style.display = 'none';
      };
      mobileImg.onerror = function() {
        mobileImg.style.display = 'none';
        if (mobileInitialDiv) mobileInitialDiv.style.display = 'flex';
      };
      mobileImg.src = user.photoURL;
    }
  } else {
    if (avatarImg) avatarImg.style.display = 'none';
    if (mobileImg) mobileImg.style.display = 'none';
  }
}

function handleAuthStateChange(user) {
  const previousUser = currentUser;
  currentUser = user;
  
  // Landing Header Auth Elements
  const landingLoginBtn = document.getElementById('btn-landing-login');
  const landingProfileDiv = document.getElementById('nav-user-profile');
  const landingUserName = document.getElementById('nav-user-name');
  const mobileLoggedOutRow = document.getElementById('mobile-drawer-auth-loggedout');
  const mobileLoggedInRow = document.getElementById('mobile-drawer-auth-loggedin');
  const mobileUserName = document.getElementById('mobile-user-name');

  updateGreetingBanner(user);
  
  if (user) {
    let displayName = user.displayName || user.phoneNumber;
    if (!displayName && user.email) {
      const emailName = user.email.split('@')[0];
      displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    const shortName = (displayName || 'User').split(' ')[0];

    // Update Desktop/Laptop Header Auth UI
    if (landingLoginBtn) {
      landingLoginBtn.classList.add('zen-auth-hidden');
      landingLoginBtn.style.setProperty('display', 'none', 'important');
    }
    if (landingProfileDiv) {
      landingProfileDiv.classList.add('zen-auth-visible');
      landingProfileDiv.style.setProperty('display', 'inline-flex', 'important');
      if (landingUserName) {
        landingUserName.textContent = shortName;
        landingProfileDiv.title = `Logged in as ${displayName} (${user.email || ''})`;
      }
    }

    // Update Mobile Drawer Auth UI
    if (mobileLoggedOutRow) {
      mobileLoggedOutRow.style.setProperty('display', 'none', 'important');
    }
    if (mobileLoggedInRow) {
      mobileLoggedInRow.style.setProperty('display', 'flex', 'important');
      if (mobileUserName) mobileUserName.textContent = displayName || 'User';
    }

    // Update Avatars with zero broken image fallback
    updateUserAvatar(user);

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

    // Show greeting toast when user state newly transitions to logged in
    if (lastAuthenticatedUid !== user.uid) {
      lastAuthenticatedUid = user.uid;
      if (!sessionStorage.getItem('loginGreetingShown')) {
        window.showToast(`Login Successful! Welcome, ${user.displayName || user.email || 'Professional'}`, 'success');
        sessionStorage.setItem('loginGreetingShown', 'true');
      }
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

    // Auto-resume pending payment if user initiated checkout prior to authentication
    try {
      const pendingActionStr = sessionStorage.getItem('zen_pending_auth_action');
      if (pendingActionStr) {
        sessionStorage.removeItem('zen_pending_auth_action');
        const actionData = JSON.parse(pendingActionStr);
        if (actionData && actionData.type === 'payment') {
          setTimeout(() => {
            if (typeof window.openProPaymentModal === 'function') {
              window.openProPaymentModal(actionData.planKey || 'sprint');
            }
            if (actionData.method === 'card' || actionData.method === 'secondary') {
              if (window.PaymentMediator && typeof window.PaymentMediator.processRazorpayCard === 'function') {
                window.PaymentMediator.processRazorpayCard(actionData.planKey, actionData.currency);
              }
            } else if (actionData.method === 'upi' || actionData.method === 'primary') {
              if (window.PaymentMediator && typeof window.PaymentMediator.openIndianCheckout === 'function') {
                window.PaymentMediator.openIndianCheckout(actionData.planKey);
              } else if (typeof window.openUPIPaymentModal === 'function') {
                window.openUPIPaymentModal(actionData.planKey);
              }
            }
          }, 600);
        }
      }
    } catch (e) {
      console.warn('Pending auth action restoration error:', e);
    }
  } else {
    lastAuthenticatedUid = null;
    // Cancel subscription observer on logout
    if (unsubscribeSubscription) {
      unsubscribeSubscription();
      unsubscribeSubscription = null;
    }
    if (window.state) window.state.isPremium = false;
    document.dispatchEvent(new CustomEvent('zensuite_premium_status', { detail: { isPremium: false } }));
    updatePremiumUI(false);

    // Reset Landing Header Auth UI
    if (landingLoginBtn) {
      landingLoginBtn.classList.remove('zen-auth-hidden');
      landingLoginBtn.style.setProperty('display', 'inline-flex', 'important');
    }
    if (landingProfileDiv) {
      landingProfileDiv.classList.remove('zen-auth-visible');
      landingProfileDiv.style.setProperty('display', 'none', 'important');
    }
    if (landingUserName) landingUserName.textContent = '';

    // Reset Mobile Drawer Auth UI
    if (mobileLoggedOutRow) {
      mobileLoggedOutRow.style.setProperty('display', 'flex', 'important');
    }
    if (mobileLoggedInRow) {
      mobileLoggedInRow.style.setProperty('display', 'none', 'important');
    }

    updateUserAvatar(null);

    if (window.state) {
      window.state.hasLoadedProfile = false;
    }
  }
}

// Initialize immediately or on load
initFirebaseService();

// Delegated click binding that ensures clicks ALWAYS register without duplicate firing
document.addEventListener('click', (e) => {
  const loginTarget = e.target.closest('#btn-landing-login, #btn-mobile-drawer-login, #btn-google-login, [data-action="google-login"]');
  if (loginTarget) {
    if (!loginTarget.getAttribute('onclick')) {
      e.preventDefault();
      window.triggerGoogleLogin();
    }
    return;
  }

  const logoutTarget = e.target.closest('#btn-landing-logout, #btn-logout, [data-action="logout"]');
  if (logoutTarget) {
    e.preventDefault();
    window.triggerLogout();
    return;
  }
});

// Global Authentication State & Gatekeeper Helpers
window.isUserAuthenticated = function() {
  try {
    return typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser !== null;
  } catch (e) {
    return false;
  }
};

window.requireUserAuth = function(onAuthenticated, actionData) {
  if (window.isUserAuthenticated()) {
    if (typeof onAuthenticated === 'function') {
      onAuthenticated(firebase.auth().currentUser);
    }
    return true;
  }

  // Save pending action to sessionStorage for auto-continuation after login
  if (actionData) {
    try {
      sessionStorage.setItem('zen_pending_auth_action', JSON.stringify(actionData));
    } catch (e) {}
  }

  // Close payment modals so login modal is prominent
  if (typeof window.closeProPaymentModal === 'function') window.closeProPaymentModal();
  if (typeof window.closeUPIPaymentModal === 'function') window.closeUPIPaymentModal();
  const intlModal = document.getElementById('international-checkout-modal');
  if (intlModal) intlModal.style.display = 'none';

  if (typeof window.showToast === 'function') {
    window.showToast('Please sign in or create an account to activate your subscription.', 'info', 5000);
  }

  if (typeof window.openEmailAuthModal === 'function') {
    window.openEmailAuthModal();
  }
  return false;
};

// Global Email Modal Controls
window.openEmailAuthModal = function() {
  const emailModal = document.getElementById('email-login-modal');
  const emailError = document.getElementById('email-auth-error');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  if (emailModal) emailModal.style.display = 'flex';
  if (emailError) emailError.style.display = 'none';
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';
};

window.closeEmailAuthModal = function() {
  const emailModal = document.getElementById('email-login-modal');
  if (emailModal) emailModal.style.display = 'none';
};

// Email/Password Auth Logic
function initEmailAuth() {
  const btnShowEmailLogin = document.getElementById('btn-show-email-login');
  const emailModal = document.getElementById('email-login-modal');
  const btnCloseEmailModal = document.getElementById('btn-close-email-modal');
  const btnToggleEmailMode = document.getElementById('btn-toggle-email-mode');
  const btnSubmitEmail = document.getElementById('btn-submit-email');
  const btnModalGoogle = document.getElementById('btn-modal-google-login');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const emailError = document.getElementById('email-auth-error');
  const emailTitle = document.getElementById('email-modal-title');
  const emailToggleText = document.getElementById('email-toggle-text');
  
  let isCreateMode = false;

  if (btnShowEmailLogin) {
    btnShowEmailLogin.addEventListener('click', (e) => {
      e.preventDefault();
      window.openEmailAuthModal();
    });
  }

  if (btnCloseEmailModal) {
    btnCloseEmailModal.addEventListener('click', (e) => {
      e.preventDefault();
      window.closeEmailAuthModal();
    });
  }

  if (btnModalGoogle) {
    btnModalGoogle.addEventListener('click', (e) => {
      e.preventDefault();
      window.triggerGoogleLogin();
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
        
        window.closeEmailAuthModal();
        window.showToast("Login Successful! Welcome, " + email);
        
      } catch (error) {
        console.warn("[Firebase Email Auth Diagnostic]:", error);
        if (emailError) {
          emailError.textContent = window.getCleanErrorMessage(error, 'Incorrect email or password. Please try again.');
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
    const mobileBadge = document.getElementById('mobile-user-premium-badge');
    if (mobileBadge) mobileBadge.style.display = 'inline-flex';
  } else {
    document.body.classList.remove('zensuite-premium-active');
    const badge = document.getElementById('nav-user-premium-badge');
    if (badge) badge.style.display = 'none';
    const mobileBadge = document.getElementById('mobile-user-premium-badge');
    if (mobileBadge) mobileBadge.style.display = 'none';
  }
}

// User Account & Subscription Profile Modal Engine
window.openUserProfileModal = async function() {
  const modal = document.getElementById('user-profile-modal');
  if (!modal) return;

  const user = (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
  if (!user) {
    if (typeof window.openEmailAuthModal === 'function') window.openEmailAuthModal();
    return;
  }

  // Populate basic user info
  const nameEl = document.getElementById('profile-modal-user-name');
  const emailEl = document.getElementById('profile-modal-user-email');
  const avatarImg = document.getElementById('profile-modal-avatar-img');
  const avatarInitial = document.getElementById('profile-modal-avatar-initial');

  const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'Professional');
  if (nameEl) nameEl.textContent = displayName;
  if (emailEl) emailEl.textContent = user.email || (user.phoneNumber || 'Authenticated User');

  if (avatarImg && avatarInitial) {
    if (user.photoURL) {
      avatarImg.src = user.photoURL;
      avatarImg.style.display = 'block';
      avatarInitial.style.display = 'none';
      avatarImg.onerror = () => {
        avatarImg.style.display = 'none';
        avatarInitial.style.display = 'flex';
      };
    } else {
      avatarImg.style.display = 'none';
      avatarInitial.style.display = 'flex';
      avatarInitial.textContent = (displayName.charAt(0) || 'U').toUpperCase();
    }
  }

  // Retrieve Subscription Details from Firestore (or Local Fallback)
  let subData = null;
  try {
    if (typeof db !== 'undefined' && db && user.uid) {
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists && doc.data()?.subscription) {
        subData = doc.data().subscription;
      }
    }
  } catch (e) {
    console.warn('[ProfileModal] Firestore read fallback:', e);
  }

  // Local storage fallback if offline or Firestore query is pending
  const localTier = localStorage.getItem('zen_user_tier') || 'free';
  const localExpiryMs = parseInt(localStorage.getItem('zen_tier_expiry') || '0', 10);

  let planKey = subData?.plan || (localTier !== 'free' ? localTier : 'free');
  let expDate = null;

  if (subData?.expiresAt) {
    expDate = subData.expiresAt.toDate ? subData.expiresAt.toDate() : new Date(subData.expiresAt);
  } else if (localExpiryMs > 0) {
    expDate = new Date(localExpiryMs);
  }

  const now = new Date();
  const isActive = expDate && expDate > now && (subData?.status === 'active' || localTier !== 'free');

  // DOM Elements for subscription details
  const planNameEl = document.getElementById('profile-modal-plan-name');
  const planSubEl = document.getElementById('profile-modal-plan-subtitle');
  const badgeTextEl = document.getElementById('profile-modal-badge-text');
  const timeLeftEl = document.getElementById('profile-modal-time-left');
  const expiryDateEl = document.getElementById('profile-modal-expiry-date');
  const upgradeBtnText = document.getElementById('profile-modal-upgrade-btn-text');
  const pulseEl = document.getElementById('profile-modal-active-pulse');

  const planTitles = {
    day: { name: '⚡ 1-Day Sprint', subtitle: '24-Hour Full ATS & AI Access Pass' },
    sprint: { name: '⚡ 7-Day Fast Track', subtitle: '1-Week Full Career Stack & ATS Pass' },
    suite: { name: '⭐ Entire ZenSuite', subtitle: '1-Month Full Career Ecosystem Access' },
    free: { name: '🌱 Free Starter Plan', subtitle: 'Standard Single-Column ATS Editor' }
  };

  if (isActive && expDate) {
    const planInfo = planTitles[planKey] || planTitles.sprint;
    if (planNameEl) planNameEl.textContent = planInfo.name;
    if (planSubEl) planSubEl.textContent = planInfo.subtitle;
    if (badgeTextEl) badgeTextEl.textContent = 'PRO ACTIVE';

    // Calculate remaining duration
    const remainingMs = expDate.getTime() - now.getTime();
    const totalMinutes = Math.floor(remainingMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} Day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
    if (parts.length === 0 && minutes > 0) parts.push(`${minutes} Minute${minutes > 1 ? 's' : ''}`);
    const timeFormatted = parts.join(', ') + ' Left';

    if (timeLeftEl) timeLeftEl.textContent = timeFormatted || '< 1 Minute Left';

    // Format Expiration Date
    const dateFormatted = expDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + expDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (expiryDateEl) expiryDateEl.textContent = dateFormatted;
    if (upgradeBtnText) upgradeBtnText.textContent = '⚡ Extend / Upgrade Plan (Zero Lost Time)';
    if (pulseEl) {
      pulseEl.style.display = 'inline-flex';
      pulseEl.style.background = 'rgba(16, 185, 129, 0.1)';
      pulseEl.style.color = '#10B981';
      pulseEl.innerHTML = '<span style="width: 7px; height: 7px; background: #10B981; border-radius: 50%; display: inline-block;"></span> Active';
    }
  } else {
    // Free / Expired
    const planInfo = planTitles.free;
    if (planNameEl) planNameEl.textContent = planInfo.name;
    if (planSubEl) planSubEl.textContent = planInfo.subtitle;
    if (badgeTextEl) badgeTextEl.textContent = 'FREE TIER';
    if (timeLeftEl) timeLeftEl.textContent = expDate ? 'Plan Expired' : 'No active paid pass';
    if (expiryDateEl) expiryDateEl.textContent = expDate ? expDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Lifetime Free Access';
    if (upgradeBtnText) upgradeBtnText.textContent = '🚀 Upgrade to Pro (Unlock AI & Unlimited Downloads)';
    if (pulseEl) {
      pulseEl.style.display = 'inline-flex';
      pulseEl.style.background = 'rgba(100, 116, 139, 0.1)';
      pulseEl.style.color = '#64748B';
      pulseEl.innerHTML = '<span style="width: 7px; height: 7px; background: #94A3B8; border-radius: 50%; display: inline-block;"></span> Free';
    }
  }

  modal.style.display = 'flex';
};

window.closeUserProfileModal = function() {
  const modal = document.getElementById('user-profile-modal');
  if (modal) modal.style.display = 'none';
};

// Global click outside listener for user profile modal
document.addEventListener('click', function(e) {
  const profileModal = document.getElementById('user-profile-modal');
  if (profileModal && e.target === profileModal) {
    window.closeUserProfileModal();
  }
});
