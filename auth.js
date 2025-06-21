import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6zraP3KBgkAut4s81rM01KeSROBp2Z2U",
    authDomain: "apma-music.firebaseapp.com",
    projectId: "apma-music",
    storageBucket: "apma-music.appspot.com",
    messagingSenderId: "32855672499",
    appId: "1:32855672499:web:b5d053f3f1840b000e12c6",
    measurementId: "G-DS0PMWB0D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Check if Firebase is properly initialized
if (!app || !auth) {
    console.error("Firebase initialization failed");
    throw new Error("Firebase initialization failed");
}

const googleBtn = document.getElementById("sign-in-btn");
const signOutBtn = document.getElementById("sign-out-btn");

googleBtn.addEventListener("click", function() {
    googleBtn.disabled = true; // Disable button to prevent multiple clicks
    signInWithPopup(auth, provider)
        .then((result) => {
            alert("Signed in as: " + result.user.displayName);
            
            // Refresh library if it's currently displayed
            setTimeout(() => {
                const mainContent = document.querySelector('.main-content');
                const libraryTitle = mainContent.querySelector('h2');
                
                if (libraryTitle && libraryTitle.textContent === 'Your Library') {
                    // Call displayLibrary function directly if it exists globally
                    if (typeof window.displayLibrary === 'function') {
                        window.displayLibrary();
                    }
                }
            }, 1000); // Small delay to ensure Firebase auth state is updated
            
        })
        .catch((error) => {
            alert("Sign in failed: " + error.message);
        })
        .finally(() => {
            googleBtn.disabled = false; // Re-enable button
        });
});

// Sign out functionality
signOutBtn.addEventListener("click", function() {
    auth.signOut().then(() => {
        alert("Signed out successfully!");
    }).catch((error) => {
        alert("Sign out failed: " + error.message);
    });
});

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    const userInfo = document.getElementById("user-info");
    const userAvatar = document.getElementById("user-avatar");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    
    if (user) {
        // User is signed in
        googleBtn.style.display = "none";
        signOutBtn.style.display = "block";
        signOutBtn.textContent = `Sign Out (${user.displayName})`;
        
        // Show user info
        userInfo.style.display = "block";
        userAvatar.textContent = user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();
        userName.textContent = user.displayName || "User";
        userEmail.textContent = user.email;
    } else {
        // User is signed out
        googleBtn.style.display = "block";
        signOutBtn.style.display = "none";
        userInfo.style.display = "none";
        
        // Refresh library if it's currently displayed to show sign-in message
        setTimeout(() => {
            const mainContent = document.querySelector('.main-content');
            const libraryTitle = mainContent.querySelector('h2');
            
            if (libraryTitle && libraryTitle.textContent === 'Your Library') {
                // Call displayLibrary function directly if it exists globally
                if (typeof window.displayLibrary === 'function') {
                    window.displayLibrary();
                }
            }
        }, 500);
    }
});

// Export app for use in other modules
export { app };