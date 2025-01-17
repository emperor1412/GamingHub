import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Add the Firebase config and initialization before the App component
const firebaseConfig = {
  apiKey: "AIzaSyDD3PYowyQqVA6VGuG6b2YXcbWG_ZDjfTg",
  authDomain: "fslgaminghub.firebaseapp.com",
  projectId: "fslgaminghub",
  storageBucket: "fslgaminghub.firebasestorage.app",
  messagingSenderId: "971087549263",
  appId: "1:971087549263:web:cca7177731a95b2d7deb3a",
  measurementId: "G-0ZGTY3YXSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };