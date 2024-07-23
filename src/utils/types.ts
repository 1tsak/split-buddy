import { PieValueType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";
import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  groupsIn: string[];
  createdAt: string;
  updatedAt: string;
  deviceToken:string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdBy: string;
  groupId:string;
  billUrl : string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  splits: Split[];
}

export interface Split {
  userId: string;
  amount: number;
  paid: boolean;
}

export interface ExpenseMember extends Split {
  name: string;
}

export interface Notification {
  title: string;
  message: string;
  createdAt: string;
  groupId: string;
}

export interface Balance {
  id: string;
  userId: string;
  balance: number;
  updatedAt: string;
}

export interface GroupContextType {
  groupData: Group | null;
  expenses: Expense[] | null;
  setExpenses: (expenses: Expense[]) => void;
  setGroup: (group: Group) => void;
  fetchExpensesData: (groupId: string) => void;
  fetchGroupsData: (groupId: string) => void;
  loading: boolean;
}

export interface PieChartDataType extends MakeOptional<PieValueType, "id"> {

}

export interface DCardType {
  title: string;
  amount: number | string;
  grpId?: string;
}

export interface TransactionCardType{
  isGetting:boolean,
  amount:number | string,
  userName?:string,
  time?:Date
}

export interface TransactionGroupType{
  [key:string] : TransactionCardType[]
}

export interface LineChartType{
  amt:number,
  time:Date,
  isGetting:boolean;
}
export interface LineChartGroupType{
  [key:string] : number
}
