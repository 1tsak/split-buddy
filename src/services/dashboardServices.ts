import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  DCardType,
  Expense,
  PieChartDataType,
  TransactionCardType,
} from "../utils/types";
import { sampleExpenses } from "../data/sampleExpenses";

const dbCollection = {
  expenses: collection(db, "expenses"),
};

const getUserTotalPaidAmt = async (userId: string): Promise<number> => {
  const expensesSnapShot = await getDocs(dbCollection.expenses);
  let amt = 0;
  expensesSnapShot.forEach((expense) => {
    const splits = (expense.data() as Expense).splits;
    splits.forEach((split) => {
      if (split.userId == userId && split.paid == true) {
        amt += split.amount;
      }
    });
  });
  console.log(amt)
  // sampleExpenses.forEach(sampleExpenses=>{
  //     const splits = sampleExpenses.splits;
  //     splits.forEach(sp=>{
  //         if(userId == sp.userId && sp.paid==true){
  //             amt+=sp.amount;
  //         }
  //     })
  // })
  return amt;
};

const getUserAmtData = async (userId: string): Promise<PieChartDataType[]> => {
  const expensesSnapShot = await getDocs(dbCollection.expenses);
  const data = new Array<PieChartDataType>();
  expensesSnapShot.forEach((expense) => {
    const splits = (expense.data() as Expense).splits;
    splits.forEach((split) => {
      if (split.userId == userId && split.paid == true) {
        data.push({ id: Math.random(), value: +split.amount });
      }
    });
  });

  // sampleExpenses.forEach(expense=>{
  //     const splits = expense.splits;

  //     splits.forEach((split) => {
  //         if (split.userId == userId && split.paid==true) {
  //             data.push({value:+split.amount})

  //           }
  //     });
  // })
  return data;
};

const getUserRecentBills = async (userId: string): Promise<DCardType[]> => {
  const query1 = query(dbCollection.expenses, where("createdBy", "==", userId));
  const data = new Array<DCardType>();
  const snapShot = await getDocs(query1);
  snapShot.forEach((expense) => {
    const exp: Expense = expense.data() as Expense;
    data.push({ title: exp.title, amount: exp.amount });
  });

  // sampleExpenses.forEach((exp,i)=>{
  //     if(exp.createdBy == userId){
  //         data.push({title:exp.title,amount:exp.amount});
  //     }
  // })
  // splicing the data before sending so the the user only see 4 objects
  data.splice(4, data.length);
  return data;
};

const getUserTransactoins = async (
  userId: string
): Promise<TransactionCardType[]> => {
  const data = new Array<TransactionCardType>();
  const snapShot = await getDocs(dbCollection.expenses);
  snapShot.forEach((expense) => {
    const exp = expense.data() as Expense;
    const splits = exp.splits;
    if (exp.createdBy == userId) {
      splits.forEach((split) => {
        if (split.userId != userId) {
          data.push({ amount: split.amount, isGetting: true });
        }
      });
    } else {
      splits.forEach(split=>{
        if(split.userId==userId){
          data.push({amount:split.amount,isGetting:false})
        }
      })
    }
  });
  // sampleExpenses.forEach((expense) => {
  //   const exp = expense
  //   const splits = exp.splits;
  //   if (exp.createdBy == userId) {
  //     splits.forEach((split) => {
  //       if (split.userId != userId) {
  //         data.push({ amount: split.amount, isGetting: true });
  //       }
  //     });
  //   } else {
  //     splits.forEach(split=>{
  //       if(split.userId==userId){
  //         data.push({amount:split.amount,isGetting:false})
  //       }
  //     })
  //   }
  // });
  return data;
};

export { getUserTotalPaidAmt, getUserAmtData, getUserRecentBills,getUserTransactoins };
