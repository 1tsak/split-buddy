import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const updateUserProfile = async (user: any, profile: { displayName: string; photoURL: string }) => {
  return updateProfile(user, profile);
};

