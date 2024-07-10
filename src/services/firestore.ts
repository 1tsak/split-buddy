import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "../utils/types";

export const createUserDocument = async (user: User) => {
  const userDoc = doc(db, "users", user.id);
  await setDoc(userDoc, {
    ...user,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};
