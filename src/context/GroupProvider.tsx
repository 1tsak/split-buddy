import {
  Expense,
  ExpenseMember,
  Group,
  GroupContextType,
  Split,
} from "../types/types";
import React, { createContext, useEffect, useState } from "react";

import { fetchExpenses } from "../services/expenseService";
import { getGroupById } from "../services/groupService";
// import { getUser } from "../services/authService";
import { useParams } from "react-router-dom";

export const GroupContext = createContext<GroupContextType | undefined>(
  undefined
);

const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [expenses, setExpensesData] = useState<Expense[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { groupId } = useParams<{ groupId: string }>();
  const setExpenses = (expenses: Expense[]) => {
    setExpensesData(expenses);
  };

  const setGroup = (group: Group) => {
    setGroupData(group);
  };

  const fetchGroupsData = async (groupId: string) => {
    if (groupId) {
      setLoading(true);
      try {
        const group = await getGroupById(groupId);
        if (group) setGroup(group);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };
  const fetchExpensesData = async (groupId: string) => {
    setLoading(true);
    try {
      const expensesRes: Expense[] = await fetchExpenses(groupId);
      console.log(expenses);
      if (expensesRes) setExpenses(expensesRes);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(groupId);
    if (!groupId) {
      setGroupData(null);
    }
  }, [groupId]);

  return (
    <GroupContext.Provider
      value={{
        groupData,
        setGroup,
        expenses,
        setExpenses,
        fetchExpensesData,
        fetchGroupsData,
        loading,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
