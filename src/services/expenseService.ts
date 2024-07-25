import { Expense, Split } from "../types/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const fetchExpenses = async (groupId: string): Promise<Expense[]> => {
  const expensesCollection = collection(db, "expenses");
  const expensesQuery = query(
    expensesCollection,
    where("groupId", "==", groupId)
  );
  const querySnapshot = await getDocs(expensesQuery);

  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push({ id: doc.id, ...doc.data() } as Expense);
  });

  return expenses;
};

export const addExpense = async (expense: Expense) => {
  try {
    const expensesCollectionRef = collection(db, "expenses");
    const expenseWithTimestamp = {
      ...expense,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(expensesCollectionRef, expenseWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw new Error("Error adding expense");
  }
};

export const uploadImage = async (file:File) => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw new Error("Error uploading image");
  }
};

export const addBillImage = async (url : string, expenseId: string)=>{
  try {
    const expenseDocRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseDocRef, {
      billUrl: url,
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    console.error("Error adding expense img: ", error);
    throw new Error("Error adding image ");
  }
}
export const updateExpenseAmounts =async (expenseId:string,updatedSplits:Split[])=>{
  try {
    const expenseDocRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseDocRef, {
      splits:updatedSplits,
      updatedAt: serverTimestamp(),
    });

  } catch (error) {
    console.error("Error updating expense: ", error);
    throw new Error("Error updating expense. ");
  }
}
export const markBillPaid = async (
  expenseId: string,
  updatedSplits: Split[]
) => {
  try {
    const expenseDocRef = doc(db, "expenses", expenseId);
    await updateDoc(expenseDocRef, { splits: updatedSplits });
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw new Error("Error adding expense");
  }
};
