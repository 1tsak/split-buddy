import { PieValueType } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  groupsIn: string[];
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
  splits: Split[];
}

export interface Split {
  userId: string;
  amount: number;
  paid: boolean;
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
  expenses:Expense[];
  setExpenses:(expenses:Expense[])=>void;
  setGroup: (group: Group) => void;
}

export interface PieChartDataType extends MakeOptional<PieValueType,"id">{
}

export interface DCardType {
  title:string,
  amount:number | string,
  grpId?:string,
}

export interface TransactionCardType{
  isGetting:boolean,
  amount:number | string,
  userName?:string,
}