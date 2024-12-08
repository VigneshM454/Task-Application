import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
//import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-FHSYQSzDlLyWykOqX21VUdEqgET4FoM",
  authDomain: "login1-8e6e5.firebaseapp.com",
  projectId: "login1-8e6e5",
  storageBucket: "login1-8e6e5.appspot.com",
  messagingSenderId: "1089293229516",
  appId: "1:1089293229516:web:4fae2702215b13b5a91169"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//console.log('firebase.apps.length');
//console.log(firebase.apps.length);
export const auth=getAuth();
//export const db=getFirestore();
export default app;