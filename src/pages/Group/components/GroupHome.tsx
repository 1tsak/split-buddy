import React from "react";
import { useEffect, useState } from "react";
import { Expense } from "../../../utils/types";
import { sampleExpenses } from "../../../data/sampleExpenses";
import ExpensesGraph from "../components/ExpensesGraph";

const GroupHome = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    // For now, we use sample data
    setExpenses(sampleExpenses);
  }, []);
  return (
    <div className="flex flex-col p-5">
      <div className="flex">
        <div className="rounded-md bg-slate-100 p-5">
          
        </div>
        <ExpensesGraph expenses={expenses} />
      </div>
    </div>
  );
};

export default GroupHome;
