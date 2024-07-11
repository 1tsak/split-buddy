// services/firebaseAuth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

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
