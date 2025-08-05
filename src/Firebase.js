import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Add the Firebase config and initialization before the App component
const firebaseConfig = {
  apiKey: "AIzaSyBrzjKG4k9x16Amf8qc6-Ea-jfjUP_A178",
  authDomain: "fsl-game-hub-line.firebaseapp.com",
  projectId: "fsl-game-hub-line",
  storageBucket: "fsl-game-hub-line.firebasestorage.app",
  messagingSenderId: "248848253220",
  appId: "1:248848253220:web:dfbd9c15d7be7603a2f3b1",
  measurementId: "G-6M8THKTCXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };