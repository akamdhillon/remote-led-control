import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD_5oHmjF6UAwi6F87sL6AGO9maxBh37Fk",
  authDomain: "leddatatransfer.firebaseapp.com",
  projectId: "leddatatransfer",
  storageBucket: "leddatatransfer.appspot.com",
  messagingSenderId: "418573255324",
  appId: "1:418573255324:web:0db1357af244c0817a6359",
  measurementId: "G-FM98P41BHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
