// utils/calculateExpenses.ts
import { Expense } from "./types";

export const calculateTotalExpenses = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateUserExpenses = (expenses: Expense[]) => {
  const userExpenses: { [userId: string]: number } = {};

  expenses.forEach(expense => {
    expense.splits.forEach(split => {
      if (!userExpenses[split.userId]) {
        userExpenses[split.userId] = 0;
      }
      userExpenses[split.userId] += split.amount;
    });
  });

  return userExpenses;
};
