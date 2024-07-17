import { CiMoneyBill } from "react-icons/ci";
import { CiHome } from "react-icons/ci";
import useGroup from "../../../hooks/useGroup";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Expense } from "../../../utils/types";
import { Box, CircularProgress } from "@mui/material";
import { format, isToday, isYesterday } from 'date-fns';

const Sider = () => {
  const { groupData, expenses, loading } = useGroup();

  useEffect(() => {
    console.log(groupData);
  }, [groupData]);

  const sortedExpenses = expenses
    ? [...expenses].sort((a:any, b:any) => b.updatedAt.seconds - a.updatedAt.seconds)
    : [];

  const getExpenseLabel = (timestamp: any) => {
    const date = new Date(timestamp.seconds * 1000);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  const groupedExpenses = sortedExpenses.reduce((acc: any, expense) => {
    const label = getExpenseLabel(expense.updatedAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(expense);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-hidden w-1/4 bg-slate-100 pt-4">
      <h1 className="text-center text-xl text-slate-700">{groupData?.name}</h1>
      <p className="text-sm text-center text-slate-500">
        {groupData?.description}
      </p>
      <div className="flex flex-col gap-3 flex-1 mt-12">
        <Link to={`/group/${groupData?.id}`}>
          <div className="w-full px-5 py-2 bg-slate-50 font-light cursor-pointer border-b text-gray-700 border-slate-200 flex items-center gap-2">
            <CiHome />
            <span>Home</span>
          </div>
        </Link>
        <h2 className="px-2 mt-4 text-lg text-center text-gray-500">Bills</h2>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ul className="p-2 text-gray-700 flex flex-col h-full overflow-y-scroll cursor-pointer font-light">
            {Object.keys(groupedExpenses).map((label) => (
              <div key={label}>
                <p className="font-light text-sm p-2 text-gray-400">{label}</p>
                {groupedExpenses[label].map((expense: Expense) => (
                  <Link to={`bill/${expense.id}`} key={expense.id}>
                    <li className="border-b slate-300 p-3 flex justify-between items-center gap-2">
                      <div className="flex gap-2 items-center">
                        <CiMoneyBill size={18} />
                        <span>{expense.title}</span>
                      </div>
                      <span>₹{expense.amount}</span>
                    </li>
                  </Link>
                ))}
              </div>
            ))}
            {sortedExpenses.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                No expenses to show!
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sider;
