import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PieChartDataType, RecentBillCardType } from "../../types/types";
import {
  getUserAmtData,
  getUserRecentBills,
  getUserTotalPaidAmt,
} from "../../services/dashboardServices";
import { getAuth } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export interface DashboardState {
  dashBoardState: {
    amount: number;
    bills: RecentBillCardType[];
    pieChartData: PieChartDataType[];
  };
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DashboardState = {
  dashBoardState: {
    amount: 0,
    bills: [],
    pieChartData: [],
  },
  status: "loading",
};

export const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { amount, bills, pieChartData } = action.payload;
        state.dashBoardState.amount = amount;
        console.log(amount)
        state.dashBoardState.bills = bills;
        state.dashBoardState.pieChartData = pieChartData;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const fetchUserData = createAsyncThunk<{
  amount: number;
  bills: RecentBillCardType[];
  pieChartData: PieChartDataType[];
}>("dashboardSlice/fetchUserData", async () => {
  const userUid = auth.currentUser?.uid as string;

  const amount = await getUserTotalPaidAmt(userUid);
  
  
    const bills = await getUserRecentBills(userUid);
  const pieChartData = await getUserAmtData(userUid);
  console.log(bills,pieChartData,"pdata")
  return { amount, bills, pieChartData };
  
});

// export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
