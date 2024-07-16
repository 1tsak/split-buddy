import React, { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { TransactionCardType } from "../utils/types";
import { getUserTransactoins } from "../services/dashboardServices";
import TransactionCard from "./TransactionCard";
import { Box, CircularProgress } from "@mui/material";

const TransactionContainer: FC = () => {
  const [user, loading] = useAuthState(auth);
  const [tData, setTData] = useState<TransactionCardType[]>();
  const fetchData = async () => {
    const data = await getUserTransactoins(user?.uid as string);
    setTData(data)
  };
  useEffect(() => {
    fetchData();
  }, []);

  if(tData && tData.length==0){
    return <div className="rounded-xl border-main border-[1px] p-2 flex-auto">
    <p className="text-2xl font-extrabold">Recent Transactions</p>
    <p className="text-gray-400 text-sm"></p>
    <div className="overflow-scroll min-h-[80vh] flex items-center justify-center max-h-[80-vh]">
      No Recent Transaction Data Available
    </div>
  </div>
  }

  return (
    <div className="rounded-xl border-main border-[1px] p-2 flex-auto">
      <p className="text-2xl font-extrabold">Recent Transactions</p>
      <p className="text-gray-400 text-sm"></p>
      <div className="overflow-scroll min-h-[80vh] max-h-[80vh]">
        {tData ? tData.map((trns,i)=>{
            return <TransactionCard key={i} data={trns}/>
        }) :(
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "24vh",
              }}
            >
              <CircularProgress className="text-main" />
            </Box>
          )}
      </div>
    </div>
  );
};

export default TransactionContainer;
