import {
  and,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  DCardType,
  Expense,
  LineChartGroupType,
  LineChartType,
  PieChartDataType,
  TransactionCardType,
  TransactionGroupType,
} from "../utils/types";
import moment from "moment";
import { DateRange } from "rsuite/esm/DateRangePicker";

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
        amt += Number(split.amount);
      }
    });
  });
  console.log(amt);
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
  // Update query to order by updatedAt or createdAt field and limit to the most recent 4
  const query1 = query(
    dbCollection.expenses,
    where('createdBy', '==', userId),
    orderBy('updatedAt', 'desc'), // or 'createdAt' if that's the correct field
    limit(4)
  );

  const data: DCardType[] = [];
  const snapShot = await getDocs(query1);
  snapShot.forEach((expense) => {
    const exp: Expense = expense.data() as Expense;
    data.push({ title: exp.title, amount: exp.amount });
  });

  return data;
};

const getUserTransactoins = async (
  userId: string
): Promise<TransactionGroupType> => {
  const data = new Array<TransactionCardType>();
  const query1 = query(dbCollection.expenses, orderBy("createdAt", "desc"));
  const snapShot = await getDocs(query1);

  snapShot.forEach((expense) => {
    const exp = expense.data() as Expense;

    const splits = exp.splits;
    if (exp.createdBy == userId) {
      splits.forEach((split) => {
        if (split.userId != userId) {
          data.push({
            amount: split.amount,
            isGetting: true,
            time: exp.createdAt.toDate(),
          });
        }
      });
    } else {
      splits.forEach((split) => {
        if (split.userId == userId) {
          data.push({
            amount: split.amount,
            isGetting: false,
            time: exp.createdAt.toDate(),
          });
        }
      });
    }
  });
  const groups = data.reduce<TransactionGroupType>((group, item) => {
    const date = moment(item.time).format("DD-MMMM");
    if (!group[date]) {
      group[date] = [];
    }

    group[date].push(item);

    return group;
  }, {});

  // for(const dt of data){
  //   const user = await getUser(dt.userName as string);
  //   dt.userName = user?.displayName
  // }

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

  return groups;
};

const getDataForLineChart = async (
  userId: string,
  dateR: DateRange
): Promise<LineChartGroupType> => {
  if (!dateR || dateR==null) return { "16": 22 };
  console.log("called"
  )
  const fromDate = Timestamp.fromDate(dateR[0]);
  const toDate = Timestamp.fromDate(dateR[1])
  const query1 = query(
    dbCollection.expenses,
    and(where("createdAt","<",new Date('2024-7-18')),where("createdAt", ">", new Date('2024-7-15')),
    ),orderBy("createdAt", "desc"),
  );
  console.log("first")
  const snapShot = await getDocs(query1);
  const data = new Array<LineChartType>();
  snapShot.forEach((expense) => {
    const exp = expense.data() as Expense;
    console.log(exp,"exp");
    const splits = exp.splits;
    if (exp.createdBy == userId) {
      splits.forEach((split) => {
        if (split.userId != userId) {
          data.push({
            amt: split.amount,
            isGetting: true,
            time: exp.createdAt.toDate(),
          });
        }
      });
    } else {
      splits.forEach((split) => {
        if (split.userId == userId) {
          data.push({
            amt: split.amount,
            isGetting: false,
            time: exp.createdAt.toDate(),
          });
        }
      });
    }
  });

  const groups = data.reduce<LineChartGroupType>((group, item) => {
    const date = moment(item.time).format("DD");
    if (!group[date]) {
      group[date] = 0;
    }

    if (item.isGetting) {
      group[date] += Number(item.amt);
    } else {
      group[date] -= Number(item.amt);
    }

    return group;
  }, {});

  
  return groups;
};

export {
  getUserTotalPaidAmt,
  getUserAmtData,
  getUserRecentBills,
  getUserTransactoins,
  getDataForLineChart,
};
