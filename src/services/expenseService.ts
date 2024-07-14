import { addDoc, collection, doc, getDocs, query, serverTimestamp } from "firebase/firestore";
import { Expense } from "../utils/types";
import { db } from "../firebaseConfig";

export const fetchExpenses = async (groupId: string): Promise<Expense[]> => {
  const expensesCollection = collection(db, `expenses`);
  const expensesQuery = query(expensesCollection);
  const querySnapshot = await getDocs(expensesQuery);

  const expenses: Expense[] = [];
  querySnapshot.forEach((doc) => {
    expenses.push({ id: doc.id, ...doc.data() } as Expense);
  });

  return expenses;
};


export const addExpense = async (groupId: string, expense: Expense) => {
  try {
    const expensesCollectionRef = collection(doc(db, 'groups', groupId), 'expenses');
    const expenseWithTimestamp = {
      ...expense,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(expensesCollectionRef, expenseWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error('Error adding expense: ', error);
    throw new Error('Error adding expense');
  }
};

