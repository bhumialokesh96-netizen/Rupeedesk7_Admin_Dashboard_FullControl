// Firebase initialization and exports (Rupeedesk7 project)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword as _signIn,
  createUserWithEmailAndPassword as _createUser,
  signOut as _signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ✅ Correct Firebase Web configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvuTedi4hNLDTHwNt3tElmZZmwmxBC_zo",
  authDomain: "rupeedesk7.firebaseapp.com",
  projectId: "rupeedesk7",
  storageBucket: "rupeedesk7.appspot.com", // ✅ fixed (.appspot.com)
  messagingSenderId: "1013963357851",
  appId: "1:1013963357851:web:494e3db14e9bfa29ed503e" // ✅ fixed (:web:)
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Auth helpers
export const signInWithEmailAndPassword = _signIn;
export const createUserWithEmailAndPassword = _createUser;
export const signOut = _signOut;

// ✅ Firestore helper functions
export async function fetchCollection(name) {
  const snap = await getDocs(collection(db, name));
  return snap;
}

export async function addDocument(collectionName, data) {
  try {
    return await addDoc(collection(db, collectionName), data);
  } catch (e) {
    console.error("❌ Error adding document:", e);
    alert("Error adding document: " + e.message);
  }
}

export async function setDocument(path, data) {
  try {
    return await setDoc(doc(db, path), data);
  } catch (e) {
    console.error("❌ Error setting document:", e);
    alert("Error setting document: " + e.message);
  }
}

export async function updateDocument(path, data) {
  try {
    return await updateDoc(doc(db, path), data);
  } catch (e) {
    console.error("❌ Error updating document:", e);
    alert("Error updating document: " + e.message);
  }
}

export async function deleteDocument(path) {
  try {
    return await deleteDoc(doc(db, path));
  } catch (e) {
    console.error("❌ Error deleting document:", e);
    alert("Error deleting document: " + e.message);
  }
}

export async function getDocument(path) {
  try {
    return await getDoc(doc(db, path));
  } catch (e) {
    console.error("❌ Error getting document:", e);
    alert("Error getting document: " + e.message);
  }
}