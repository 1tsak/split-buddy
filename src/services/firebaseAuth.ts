import { auth, db } from "../firebaseConfig";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await handleUserProfile(result);
  return result;
};

export const signInWithGithub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  await handleUserProfile(result);
  return result;
};

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const updateUserProfile = async (user: any, profile: { displayName: string; photoURL: string }) => {
  await updateProfile(user, profile);
  const userDocRef = doc(db, "users", user.uid);
  return updateDoc(userDocRef, profile);
};

export const checkUserExists = async (email: string) => {
  const usersCollection = collection(db, "users");
  const userQuery = query(usersCollection, where("email", "==", email));
  const userDocs = await getDocs(userQuery);
  
  return !userDocs.empty; // Returns true if at least one document exists
};

const handleUserProfile = async (userCredential: UserCredential) => {
  const user = userCredential.user;
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const newUser = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      groupsIn: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, newUser);
  } else {
    await updateDoc(userDocRef, { updatedAt: new Date().toISOString() });
  }
};
