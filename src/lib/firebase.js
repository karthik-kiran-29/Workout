// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.API_KEY,
  authDomain: import.meta.AUTH_DOMAIN,
  projectId: import.meta.PROJECT_ID,
  storageBucket: import.meta.STORAGE_BUCKET,
  messagingSenderId: import.meta.MESSAGING_ID,
  appId: import.meta.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

import { collection, addDoc } from "firebase/firestore"; 

export async function addData(form){
    try {
  const docRef = await addDoc(collection(db, "contacts"), form);
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
}
