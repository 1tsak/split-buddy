import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Expense } from "../../types/types";
import React from "react";
import { calculateUserExpenses } from "../../utils/calculateExpenses";

interface ExpensesGraphProps {
  expenses: Expense[];
  expensesMap: {
    [key: string]: { username: string; totalAmountShared: number };
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ExpensesGraph: React.FC<ExpensesGraphProps> = ({
  expenses,
  expensesMap,
}) => {
  const userExpenses = calculateUserExpenses(expenses);

  const data = Object.keys(userExpenses).map((userId) => {
    const username = expensesMap[userId]?.username || "Unknown User";
    return {
      name: username,
      value: userExpenses[userId],
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Legend verticalAlign="top" align="center" />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesGraph;
