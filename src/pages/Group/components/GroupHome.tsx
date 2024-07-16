import { useEffect, useState } from "react";
import { Expense } from "../../../utils/types";
import { sampleExpenses as chartExpenses } from "../../../data/sampleExpenses.ts";
import ExpensesGraph from "../components/ExpensesGraph";
import useGroup from "../../../hooks/useGroup";

import MembersList from "./MembersList.tsx";
import { LineChart } from "@mui/x-charts";

const GroupHome = () => {
  const { groupData,expenses } = useGroup();
  

  useEffect(() => {
  }, [groupData]);

  return (
    <div className="flex flex-col p-5 ">
      <div className="w-full flex px-8 justify-between items-center">
        <div className="font-light">
          <h2 className="text-lg font-semibold my-1 text-gray-700">Expenses</h2>
          <p className="font-regular">Total Expenses : 100RS</p>
          <p>Aakash Share : 55RS</p>
          <p>Abhishek Share : 45RS</p>
        </div>
        <MembersList />
      </div>
      <div className=" w-full flex px-2 justify-between items-center gap-5">
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          colors={["#687EEF"]}
          height={300}
        />
        <ExpensesGraph expenses={chartExpenses as any} />
      </div>
    </div>
  );
};

export default GroupHome;
