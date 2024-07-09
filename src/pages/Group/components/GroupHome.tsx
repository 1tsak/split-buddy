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
    <div className="">
      <ExpensesGraph expenses={expenses} />
    </div>
  );
};

export default GroupHome;
