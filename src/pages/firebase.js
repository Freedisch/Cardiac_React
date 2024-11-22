// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
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
const storage = getStorage(app);
export const auth = getAuth(app);


export { db, storage };
