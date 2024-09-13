// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "wifi-menu-ro.firebaseapp.com",
  projectId: "wifi-menu-ro",
  storageBucket: "wifi-menu-ro.appspot.com",
  messagingSenderId: "1034030119143",
  appId: "1:1034030119143:web:919f9bb51da57bc4f7ca42"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);