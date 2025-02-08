import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Add the Firebase config and initialization before the App component
const firebaseConfig = {
  apiKey: "AIzaSyBHqWXjirqUYVUzsm4-6gZ9k0ahxp65U-o",
  authDomain: "fslgamehub-e7094.firebaseapp.com",
  projectId: "fslgamehub-e7094",
  storageBucket: "fslgamehub-e7094.firebasestorage.app",
  messagingSenderId: "445933254471",
  appId: "1:445933254471:web:a172bbf124ee74fc2e3e62",
  measurementId: "G-T3VRTPGJJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };