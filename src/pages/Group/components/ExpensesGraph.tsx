// components/ExpensesGraph.tsx
import React from 'react';
import { BarChart, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Expense } from '../../../utils/types';
import { calculateUserExpenses } from '../../../utils/calculateExpenses';

interface ExpensesGraphProps {
  expenses: Expense[];
}



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const RADIAN = Math.PI / 180;

const ExpensesGraph: React.FC<ExpensesGraphProps> = ({ expenses }) => {
  const userExpenses = calculateUserExpenses(expenses);
  const data = Object.keys(userExpenses).map(userId => ({
    name: userId,
    value: userExpenses[userId],
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
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
  );
};


export default ExpensesGraph;
