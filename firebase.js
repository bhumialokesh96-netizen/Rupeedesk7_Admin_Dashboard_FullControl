// Firebase initialization and exports (auto-generated from provided project)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword as _signIn, createUserWithEmailAndPassword as _createUser, signOut as _signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  "apiKey": "AIzaSyAvuTedi4hNLDTHwNt3tElmZZmwmxBC_zo",
  "authDomain": "rupeedesk7.firebaseapp.com",
  "projectId": "rupeedesk7",
  "storageBucket": "rupeedesk7.firebasestorage.app",
  "messagingSenderId": "1013963357851",
  "appId": "1:1013963351:android:494e3db14e9bfa29ed503e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// helper exports (wrap auth functions as named exports)
export const signInWithEmailAndPassword = _signIn;
export const createUserWithEmailAndPassword = _createUser;
export const signOut = _signOut;

// Firestore helper functions exported for admin.js
export async function fetchCollection(name) {
  const snap = await getDocs(collection(db, name));
  return snap;
}

export async function addDocument(collectionName, data) {
  return await addDoc(collection(db, collectionName), data);
}

export async function setDocument(path, data) {
  return await setDoc(doc(db, path), data);
}

export async function updateDocument(path, data) {
  return await updateDoc(doc(db, path), data);
}

export async function deleteDocument(path) {
  return await deleteDoc(doc(db, path));
}

export async function getDocument(path) {
  return await getDoc(doc(db, path));
}
