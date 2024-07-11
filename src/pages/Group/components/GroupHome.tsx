import React from "react";
import { useEffect, useState } from "react";
import { Expense } from "../../../utils/types";
import { sampleExpenses } from "../../../data/sampleExpenses.ts";
import ExpensesGraph from "../components/ExpensesGraph";
import { FaPlus } from "react-icons/fa6";
import useGroup from "../../../hooks/useGroup";

const GroupHome = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { groupData } = useGroup();
  useEffect(() => {
    // For now, we use sample data
    setExpenses(sampleGroupData);
  }, []);
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
      <div className="flex flex-col items-start gap-3 rounded-md w-1/2 h-fit bg-slate-100 p-5">
        <h2 className="py-2 text-slate-500">Members</h2>
        <ul className="flex flex-wrap gap-2 font-light">
          <li className="p-2  border border-slate-300 rounded">Aakash Jha</li>
          <li className="p-2 border border-slate-300 rounded">
            Abhishek Krishnan Rathuar
          </li>
          <li className="p-2 border border-slate-300 rounded">
            Abhishek Krishnan Rathuar
          </li>
          <li className="p-2 border border-slate-300 rounded">
            Abhishek Krishnan Rathuar
          </li>
        </ul>
        <button className="bg-main px-4 py-2 text-sm font-semibold rounded-sm text-white flex items-center gap-2">
          <FaPlus size={16} />
          <span>Add a Member</span>
        </button>
      </div>
    </div>
  );
};

export default GroupHome;
