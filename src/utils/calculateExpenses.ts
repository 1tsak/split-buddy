// utils/calculateExpenses.ts
import { Expense } from "../types/types";

export const calculateTotalExpenses = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateUserExpenses = (expenses: Expense[]) => {
  const userExpenses: { [key: string]: number } = {};

  expenses.forEach((expense) => {
    expense.splits.forEach((split) => {
      if (!userExpenses[split.userId]) {
        userExpenses[split.userId] = 0;
      }
      userExpenses[split.userId] += Number(split.amount); // Ensure amount is treated as a number
    });
  });

  return userExpenses;
};
