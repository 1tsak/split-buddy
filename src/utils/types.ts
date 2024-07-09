export interface User {
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Group {
    name: string;
    description: string;
    createdBy: string;
    admin: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Expense {
    title: string;
    amount: number;
    category: string;
    createdBy: string;
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
    read: boolean;
    createdAt: string;
  }
  
  
  export interface Balance {
    userId: string;
    balance: number;
    updatedAt: string;
  }
  