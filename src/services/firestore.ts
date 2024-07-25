import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { User } from "../types/types";
import { db } from "../firebaseConfig";

export const createUserDocument = async (user: User) => {
  const userDoc = doc(db, "users", user.id);
  await setDoc(userDoc, {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};
