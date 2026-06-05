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

// Setup auth listeners
auth.onAuthStateChanged(user => {
  currentUser = user;
  const loginOptions = document.getElementById('login-options');
  const profileDiv = document.getElementById('user-profile');
  
  if (user) {
    // User is signed in
    if (loginOptions) loginOptions.style.display = 'none';
    if (profileDiv) {
      profileDiv.style.display = 'flex';
      // Use phone number if display name is missing
      document.getElementById('user-name').textContent = user.displayName || user.phoneNumber || 'Professional';
      document.getElementById('user-avatar').src = user.photoURL || 'https://via.placeholder.com/150';
    }
    
    // Attempt to load their resume from Firestore
    loadResumeFromFirestore();
  } else {
    // No user is signed in
    if (loginOptions) loginOptions.style.display = 'flex';
    if (profileDiv) profileDiv.style.display = 'none';
  }
});

// Login/Logout Handlers
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('btn-google-login');
  const logoutBtn = document.getElementById('btn-logout');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).catch(error => {
        console.error("Login Error:", error);
        alert("Failed to sign in. " + error.message);
      });
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
