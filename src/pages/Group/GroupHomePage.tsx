import { Expense, Split } from "../../types/types.ts";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import { AiOutlineUser } from "react-icons/ai";
import ExpensesGraph from "../../components/Group/ExpensesGraph.tsx";
import { LineChart } from "@mui/x-charts";
import MembersList from "../../components/Group/MembersList.tsx";
import { db } from "../../firebaseConfig.ts";
import useGroup from "../../hooks/useGroup.ts";
import { useTranslation } from "react-i18next";

const GroupHomePage = () => {
  const { t } = useTranslation();
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
              userData.displayName || t("unknownUser");
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
        console.log(map);
        setExpensesMap(map);
      };
      fetchExpensesMap();
    }
  }, [groupData, expenses]);

  return (
    <div className="flex flex-col p-5 ">
      <div className="w-full pt-5 flex px-8 justify-between items-center">
        {Object.keys(expensesMap).length === 0 ? (
          <p className="font-regular">{t("noExpensesFound")}</p>
        ) : (
          <div className="font-light">
            {totalExpenses && (
              <p className="text-lg font-semibold">
                {t("totalExpenses")}: ₹{totalExpenses}
              </p>
            )}
            <br />
            {Object.values(expensesMap).map((userData) => (
              <div key={userData.userId} className="flex items-center gap-2">
                <AiOutlineUser size={20} />
                <span>{userData.username}</span>
                <span>
                  {t("share")}: ₹{userData.totalAmountShared}{" "}
                </span>
              </div>
            ))}
          </div>
        )}
        <MembersList />
      </div>
      <div className="w-full flex px-2 justify-between items-center gap-5">
        <div className="w-full flex flex-col mt-16 items-center mr-[5rem] justify-center">
          {expenses && expensesMap && (
            <ExpensesGraph
              expenses={expenses}
              expensesMap={expensesMap as any}
            />
          )}
          <p className="p-2 font-light text-gray-400">
            {t("userExpensesChart")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupHomePage;
