import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDgfPrVUt_B_MnPSteJeJLtnn7PzIatrwY",
  authDomain: "hernova-80407.firebaseapp.com",
  projectId: "hernova-80407",
  storageBucket: "hernova-80407.firebasestorage.app",
  messagingSenderId: "795437955001",
  appId: "1:795437955001:web:72eb15f731a50759bc2868",
  measurementId: "G-VG69GR7XSG"
};

// Initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
