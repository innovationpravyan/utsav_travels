import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBT5lx7-y8e5_oWbGYcLcoA9_aQeMRxT08",
  authDomain: "utsavtraveltourism.firebaseapp.com",
  projectId: "utsavtraveltourism",
  storageBucket: "utsavtraveltourism.firebasestorage.app",
  messagingSenderId: "334927607544",
  appId: "1:334927607544:web:f154a4606f17e279a16d0d",
  measurementId: "G-5NHBBVDZ7L"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
