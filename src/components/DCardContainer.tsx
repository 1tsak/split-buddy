import { useEffect, useState } from "react";
import DCard from "./DCard";
import { DCardType } from "../utils/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { getUserRecentBills } from "../services/dashboardServices";
import { Box, CircularProgress } from "@mui/material";

const DCardContainer = () => {
  const [bills, setBills] = useState<DCardType[]>();
  const [user, _] = useAuthState(auth);
  const fetchData = async () => {
    const billsData = await getUserRecentBills(user?.uid as string);
    setBills(billsData);
  };
  useEffect(() => {
    fetchData();
  },[]);
  if(bills && bills.length==0){
    return <div className="flex items-center justify-center">
        No Recent bill Data Available
    </div>
  }
  return (
    <div className="">
      {bills ? (
        <div className="grid grid-cols-2 min-h-8 lg:grid-cols-4 gap-4">
          {bills.map((bill, i) => {
            return <DCard data={bill} key={i} />;
          })}
        </div>
      ) : (
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
  );
};

export default DCardContainer;
