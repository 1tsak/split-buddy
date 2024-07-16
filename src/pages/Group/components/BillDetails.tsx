import React, { useEffect, useState } from "react";
import BillSplit from "./BillSplit";
import useGroup from "../../../hooks/useGroup";
import { useParams } from "react-router-dom";
import { Expense, Split } from "../../../utils/types";
import { getAuth } from "firebase/auth";

const BillDetails = () => {
  const { expenses } = useGroup();
  const { billId } = useParams<{ billId: string }>();
  const { groupData } = useGroup();
  const [expense, setExpense] = useState<Expense>();
  const auth = getAuth();

  useEffect(() => {
    setExpense(
      expenses?.filter((expense: Expense) => expense.id === billId)[0]
    );
  }, [expenses]);
  return (
    <div className="p-5 h-full w-full flex flex-col">
      <h1 className="text-center text-lg font-semibold text-gray-600">
        {groupData?.name}
      </h1>
      <div className="grid">
      {expense && expense.splits && expense.splits
        .filter((split: Split) => split.userId === auth.currentUser?.uid)
        .map((split: Split) => (
          <BillSplit key={split.userId} expenseData={expense} splitData={split} />
        ))}

      </div>
    </div>
  );
};

export default BillDetails;
