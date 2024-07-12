import React, { createContext, useState } from "react";
import { Expense, Group, GroupContextType } from "../utils/types";

export const GroupContext = createContext<GroupContextType | undefined>(
  undefined
);

const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [expenses, setExpensesData] = useState<Expense[] | null>(null);

  const setExpenses = (expenses: Expense[]) => {
    setExpensesData(expenses);
  };

  const setGroup = (group: Group) => {
    setGroupData(group);
  };

  return (
    <GroupContext.Provider value={{ groupData, setGroup,expenses,setExpenses }}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
