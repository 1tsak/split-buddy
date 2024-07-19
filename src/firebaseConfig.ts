import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {getMessaging} from 'firebase/messaging';
import { requestPermission } from './services/notiService';


const firebaseConfig = {
  apiKey: "AIzaSyBy7MqPrSiamySmvsadcj9_JCr5gGGOCgM",
  authDomain: "split-buddy-315cb.firebaseapp.com",
  projectId: "split-buddy-315cb",
  storageBucket: "split-buddy-315cb.appspot.com",
  messagingSenderId: "358215945843",
  appId: "1:358215945843:web:2122bffeb655b080ea6406",
  measurementId: "G-V6Z530SZBG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
export { auth, db, storage ,messaging,firebaseConfig};