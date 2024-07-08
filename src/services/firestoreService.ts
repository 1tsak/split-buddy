// src/services/firestoreService.ts
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Add new user
export const addUser = async (user: { uid: string; email: string; displayName: string; photoURL: string }) => {
  await addDoc(collection(db, 'users'), user);
};

// Get all groups for a user
export const getUserGroups = async (userId: string) => {
  const querySnapshot = await getDocs(collection(db, 'groups'));
  return querySnapshot.docs.map((doc) => doc.data());
};

// Add new group
export const addGroup = async (group: { name: string; description: string; createdBy: string; members: string[] }) => {
  await addDoc(collection(db, 'groups'), group);
};

// Add new expense to a group
export const addExpense = async (groupId: string, expense: { title: string; amount: number; category: string; createdBy: string; splits: { userId: string; amount: number; paid: boolean }[] }) => {
  await addDoc(collection(db, `groups/${groupId}/expenses`), expense);
};

// Update balance for a user in a group
export const updateUserBalance = async (groupId: string, userId: string, balance: number) => {
  await updateDoc(doc(db, `groups/${groupId}/balances/${userId}`), { balance });
};
