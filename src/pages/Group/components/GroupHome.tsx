import { useEffect, useState } from "react";
import { Expense } from "../../../utils/types";
import { sampleExpenses } from "../../../data/sampleExpenses.ts";
import ExpensesGraph from "../components/ExpensesGraph";
import useGroup from "../../../hooks/useGroup";

import MembersList from "./MembersList.tsx";

const GroupHome = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { groupData } = useGroup();

  useEffect(() => {
    setExpenses(sampleExpenses);
  }, [groupData]);

  return (
    <div className="flex flex-col p-5 ">
      <div className="flex px-2 justify-between items-center gap-5">
        <div className="font-light">
          <h2 className="text-lg font-semibold my-1 text-gray-700">Expenses</h2>
          <p className="font-regular">Total Expenses : 100RS</p>
          <p>Aakash Share : 55RS</p>
          <p>Abhishek Share : 45RS</p>
        </div>

        <div className="h-60">
          <ExpensesGraph expenses={expenses} />
        </div>
      </div>
      <MembersList />
    </div>
  );
};

export default GroupHome;
