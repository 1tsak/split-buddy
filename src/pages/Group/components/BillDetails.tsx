import React, { useEffect, useState } from "react";
import BillSplit from "./BillSplit";
import useGroup from "../../../hooks/useGroup";
import { useParams } from "react-router-dom";
import { Expense, Split } from "../../../utils/types";
import { getAuth } from "firebase/auth";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const BillDetails = () => {
  const { expenses } = useGroup();
  const { billId } = useParams<{ billId: string }>();
  const { groupData } = useGroup();
  const [expense, setExpense] = useState<Expense | undefined>(undefined);
  const auth = getAuth();
  const { t } = useTranslation(); // Add translation hook

  useEffect(() => {
    if (expenses && billId) {
      const foundExpense = expenses.find((expense: Expense) => expense.id === billId);
      setExpense(foundExpense);
    }
  }, [expenses, billId]);

  return (
    <div className="p-5 h-full w-full flex flex-col">
      <h1 className="text-center text-lg font-semibold text-gray-600">
        {groupData?.name || t('billDetails.groupNamePlaceholder')}
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
