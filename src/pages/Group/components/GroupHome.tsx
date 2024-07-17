import { useEffect, useState } from "react";
import { Expense, Split } from "../../../utils/types";
import { sampleExpenses } from "../../../data/sampleExpenses.ts";
import ExpensesGraph from "../components/ExpensesGraph";
import useGroup from "../../../hooks/useGroup";

import MembersList from "./MembersList.tsx";
import { LineChart } from "@mui/x-charts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig.ts";
import { AiOutlineUser } from "react-icons/ai";

const GroupHome = () => {
  // const [expenses, setExpenses] = useState<Expense[]>([]);
  const { groupData, expenses } = useGroup();
  const totalExpenses = expenses
    ? expenses.reduce((total, expense) => {
        const splitAmounts = expense.splits.map((split: Split) => split.amount);
        const totalSplitAmount = splitAmounts.reduce(
          (sum, amount) => sum + Number(amount),
          0
        );
        return total + totalSplitAmount;
      }, 0)
    : 0;
  const [expensesMap, setExpensesMap] = useState<{
    [userId: string]: {
      userId: string;
      username: string;
      totalAmountShared: number;
    };
  }>({});

  const fetchUsersFromExpenses = async (
    groupId: string,
    expenses: Expense[]
  ) => {
    const expensesMap: {
      [userId: string]: {
        userId: string;
        username: string;
        totalAmountShared: number;
      };
    } = {};

    // Filter expenses by groupId
    const filteredExpenses = expenses.filter(
      (expense) => expense.groupId === groupId
    );

    for (const expense of filteredExpenses) {
      for (const split of expense.splits) {
        if (!expensesMap[split.userId]) {
          expensesMap[split.userId] = {
            userId: split.userId,
            username: "",
            totalAmountShared: 0,
          };
        }
        expensesMap[split.userId].totalAmountShared += Number(split.amount);
      }
    }

    // Fetch user names asynchronously
    const fetchUserNames = async () => {
      const userIds = Object.keys(expensesMap);
      await Promise.all(
        userIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          const userData = userDoc.data();
          if (userData) {
            expensesMap[userId].username =
              userData.displayName || "Unknown User";
          }
        })
      );
    };

    // Call fetchUserNames function
    await fetchUserNames();

    return expensesMap;
  };

  useEffect(() => {
    if (groupData?.id && expenses) {
      const fetchExpensesMap = async () => {
        const map = await fetchUsersFromExpenses(groupData?.id, expenses);
        setExpensesMap(map);
      };
      fetchExpensesMap();
    }
  }, [groupData, expenses]);

  return (
    <div className="flex flex-col p-5 ">
      <div className="w-full pt-5 flex px-8 justify-between items-center">
        {Object.keys(expensesMap).length === 0 ? (
          <p className="font-regular">No Expense Found</p>
        ) : (
          <div className="font-light">
            {totalExpenses && (
              <p className="text-lg font-semibold">
                Total Expenses: ₹{totalExpenses}
              </p>
            )}
            <br />
            {Object.values(expensesMap).map((userData) => (
              <div key={userData.userId} className="flex items-center gap-2">
                <AiOutlineUser size={20} />
                <span>{userData.username}</span>
                <span>Share: ₹{userData.totalAmountShared} </span>
              </div>
            ))}
          </div>
        )}
        <MembersList />
      </div>
      <div className=" w-full flex px-2 justify-between items-center gap-5">
        {/* <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          colors={["#687EEF"]}
          height={300}
        /> */}
        <div className="w-full flex flex-col mt-16 items-center mr-[5rem] justify-center">
          {expenses && expensesMap && (
            <ExpensesGraph
              expenses={expenses}
              expensesMap={expensesMap as any}
            />
          )}
          <p className="p-2 font-light text-gray-400">User Expenses Chart</p>
        </div>
      </div>
    </div>
  );
};

export default GroupHome;
