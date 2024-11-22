// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFu4Ml992Hzu_Q_bOvY3oazywSf80bpgU",
  authDomain: "missioncapstone-21b12.firebaseapp.com",
  projectId: "missioncapstone-21b12",
  storageBucket: "missioncapstone-21b12.appspot.com",
  messagingSenderId: "506405557115",
  appId: "1:506405557115:web:b5470dd2d578ce1f6123de",
  measurementId: "G-PHJZFXLN16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// eslint-disable-next-line no-unused-vars
const storage = getStorage(app);


export { db, auth };