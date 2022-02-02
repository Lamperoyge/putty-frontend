import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyByWFQIUO2LctxrSOn5fUrDMrgTgW5lxI0",
  authDomain: "dev-putty.firebaseapp.com",
  projectId: "dev-putty",
  storageBucket: "dev-putty.appspot.com",
  messagingSenderId: "266055450680",
  appId: "1:266055450680:web:f3280790427c9072b3e6cd",
  measurementId: "G-BHDS20ZN0R",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
