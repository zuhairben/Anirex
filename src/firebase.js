// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmL1kWpUWUKrXRZDkWQl06yX4wbBFdUuQ",
  authDomain: "anirex-b0cee.firebaseapp.com",
  projectId: "anirex-b0cee",
  storageBucket: "anirex-b0cee.firebasestorage.app",
  messagingSenderId: "231774490162",
  appId: "1:231774490162:web:24b1a02fc51ef0ccf1762b",
  measurementId: "G-DE2GB6X2ZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);