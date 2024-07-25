// write your firebase services here!

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { User } from "../types/types";
import { db } from "../firebaseConfig";

export const getUser = async (userId: string): Promise<User | null> => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return { id: userDocSnap.id, ...userDocSnap.data() } as User;
  } else {
    console.log("No such document!");
    return null;
  }
};
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
  } else {
    console.log('No such document!');
    return null;
  }
};