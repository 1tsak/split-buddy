import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyB6YKFV3luacTIgBxb1zh0BO-3iOF-l2W0",
  authDomain: "split-buddy-101.firebaseapp.com",
  projectId: "split-buddy-101",
  storageBucket: "split-buddy-101.appspot.com",
  messagingSenderId: "938602674449",
  appId: "1:938602674449:web:2cdc8bfbc1272ed11b74b0",
  measurementId: "G-VZMV106E53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };