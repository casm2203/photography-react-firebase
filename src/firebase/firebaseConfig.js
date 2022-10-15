// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAulJydb-9BUZT6JnMjbVXvrQZocxz2gvU",
  authDomain: "photography-react.firebaseapp.com",
  projectId: "photography-react",
  storageBucket: "photography-react.appspot.com",
  messagingSenderId: "364183445855",
  appId: "1:364183445855:web:44ed61e478e974d6f896ea"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db }