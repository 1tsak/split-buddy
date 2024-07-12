import { collection, getDocs, query } from "firebase/firestore";
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