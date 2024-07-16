import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Expense, Split } from "../utils/types";
import { db } from "../firebaseConfig";

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
