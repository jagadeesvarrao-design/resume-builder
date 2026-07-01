// firebase-service.js
const firebaseConfig = {
  apiKey: "AIzaSyAb1ZRnxECLu7ANU3of1zUEKLqgzsvGNq0",
  authDomain: "resume-builder-5e101.firebaseapp.com",
  projectId: "resume-builder-5e101",
  storageBucket: "resume-builder-5e101.firebasestorage.app",
  messagingSenderId: "1054584407727",
  appId: "1:1054584407727:web:34ff0619478222eb5f365a",
  measurementId: "G-GV6BGEFRRW"
};

// Initialize Firebase using compat libraries (loaded via CDN in index.html)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Global user state
let currentUser = null;

// Handle redirect result for mobile logins robustly
auth.getRedirectResult().then((result) => {
  if (result && result.user) {
    console.log("Successfully logged in via redirect");
    // onAuthStateChanged will naturally pick this up
  }
}).catch((error) => {
  console.error("Redirect Auth Error:", error);
  if (error.code !== 'auth/redirect-cancelled-by-user') {
    alert("Login failed: " + error.message);
  }
});

// Authentication State Observer
auth.onAuthStateChanged(user => {
  currentUser = user;
  const loginOptions = document.getElementById('login-options');
  const profileDiv = document.getElementById('user-profile');
  const userName = document.getElementById('user-name');
  
  if (user) {
    if (loginOptions) loginOptions.style.display = 'none';
    if (profileDiv) {
      profileDiv.style.display = 'flex';
      // Use phone number if display name is missing
      if (userName) userName.textContent = user.displayName || user.phoneNumber || 'Professional';
      const avatar = document.getElementById('user-avatar');
      if (avatar) avatar.src = user.photoURL || 'https://via.placeholder.com/150';
    }
    
    // Attempt to load their resume from Firestore
    if (typeof loadResumeFromFirestore === 'function') {
      loadResumeFromFirestore();
    }
    
    // Automatically load data when user logs in
    if (!state.hasLoadedProfile && typeof loadSavedResume === 'function') {
      loadSavedResume();
      state.hasLoadedProfile = true;
    }
  } else {
    if (loginOptions) loginOptions.style.display = 'block';
    if (profileDiv) profileDiv.style.display = 'none';
    if (userName) userName.textContent = '';
    state.hasLoadedProfile = false;
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('btn-google-login');
  const logoutBtn = document.getElementById('btn-logout');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Must be called synchronously to avoid browser security blocking it
        auth.signInWithRedirect(provider).catch(err => {
          alert("REDIRECT BLOCKED: " + err.code + " - " + err.message);
          console.error("Redirect start error:", err);
        });
      } else {
        auth.signInWithPopup(provider).then((result) => {
          console.log("Logged in via popup", result.user.email);
        }).catch(error => {
          console.error("Popup Login Error:", error);
          if (error.code === 'auth/popup-blocked') {
            alert("Your browser blocked the Google Login popup. Please allow popups for this site.");
          } else if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
            alert("Failed to sign in. " + error.message);
          }
        });
      }
    });
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut();
    });
  }
});

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
      }
    }
  } catch (error) {
    console.error("Error loading from Firestore:", error);
  }
}
