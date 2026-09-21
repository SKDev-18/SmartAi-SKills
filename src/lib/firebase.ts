import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8oV1OWZRvb7lMTkXG6nlybuderj5x98s",
  authDomain: "learnflow-bf3f7.firebaseapp.com",
  databaseURL: "https://learnflow-bf3f7-default-rtdb.firebaseio.com",
  projectId: "learnflow-bf3f7",
  storageBucket: "learnflow-bf3f7.firebasestorage.app",
  messagingSenderId: "781782138277",
  appId: "1:781782138277:web:f964c310ea72325c01fc4c"
};

// Initialize Firebase safely for SSR/Next.js
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
  app,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
};
