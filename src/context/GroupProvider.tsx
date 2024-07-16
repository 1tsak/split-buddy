import React, { createContext, useState } from "react";
import { Expense, ExpenseMember, Group, GroupContextType, Split } from "../utils/types";
import { fetchExpenses } from "../services/expenseService";
import { getGroupById } from "../services/groupService";
import { getUser } from "../services/authService";

export const GroupContext = createContext<GroupContextType | undefined>(
  undefined
);


const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [groupData, setGroupData] = useState<Group | null>(null);
  const [expenses, setExpensesData] = useState<Expense[] | null>(null);
  const [expenseMembers, setExpenseMembers] = useState<ExpenseMember[] | null>(null);
  const [loading, setLoading] = useState(false);

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
  const fetchExpenseMembersData = async (expenseData:Expense[]) => {
    // setLoading(true);
    // try {
    //   const membersData:ExpenseMember[] = await Promise.all(
    //     expenseData.splits.map(async (split) => {
    //       const userData = await getUser(split.userId);
    //       return {
    //         userId: split.userId,
    //         name: userData?.displayName || "Unknown User",
    //         amount: split.amount,
    //         paid: split.paid,
    //       };
    //     })
    //   );
    //   setExpenseMembers(membersData);
    //   setLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    // }
  };

  return (
    <GroupContext.Provider
      value={{
        groupData,
        setGroup,
        expenses,
        setExpenses,
        fetchExpensesData,
        fetchGroupsData,
        expenseMembers,
        fetchExpenseMembersData,
        loading
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
