import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { Box, Typography, CircularProgress } from "@mui/material";
import HeroComponent from "../components/HeroComponent";
import DashboardLineChart from "../components/DashboardLineChart";
import DCardContainer from "../components/DCardContainer";
import TransactionContainer from "../components/TransactionContainer";
import Walkthrough from "../components/Walkthrough";
import { getDataForLineChart, getUserAmtData, getUserRecentBills, getUserTotalPaidAmt } from "../services/dashboardServices";
import { DCardType, LineChartGroupType, PieChartDataType } from "../utils/types";

const DashboardPage: React.FC = () => {
  const [user, _] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [amt, setAmt] = useState<number>(0);
  const [pieChartData, setPieChartData] = useState<PieChartDataType[]>([]);
  const [bills, setBills] = useState<DCardType[]>([]);
  // const [chartData, setChartData] = useState<LineChartGroupType>();

  const [runWalkthrough, setRunWalkthrough] = useState(false); // State for Walkthrough

  const userId = user?.uid as string;

  const fetchData = () => {
    Promise.all([
      getUserTotalPaidAmt(userId),
      getUserAmtData(userId),
      getUserRecentBills(userId),
      getDataForLineChart(userId,null),
    ]).then((values) => {
      setAmt(values[0]);
      setPieChartData(values[1]);
      setBills(values[2]);
      // setChartData(values[3]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFinishWalkthrough = () => {
    setRunWalkthrough(false);
    console.log('Walkthrough finished');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <CircularProgress className="text-main text-5xl" />
      </Box>
    );
  }

  return (
    <div className="grid xl:grid-cols-[3.5fr_1.5fr] gap-4 p-4">
      <Walkthrough runWalkthrough={runWalkthrough} onFinish={handleFinishWalkthrough} />
      <div className="overflow-scroll max-h-[90vh]">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-2 step1">
            <h2 className="text-2xl font-extrabold">User Dashboard</h2>
            {/* <Button className="text-main border-main p-1" variant="outlined">
              More
            </Button> */}
          </div>
          <div className="">
            <HeroComponent amt={amt} pieChartData={pieChartData} />
          </div>
          <div className="">
            <h2 className="text-2xl font-extrabold">Recent Bills</h2>
            <DCardContainer bills={bills} />
          </div>
        </div>
        <div>
          <div className="flex justify-between mt-2 ">
            <div>
              <h2 className="text-2xl font-extrabold mt-2">Overview</h2>
            </div>
            {/* <div>put buttons</div> */}
          </div>
          <div className="mt-2">
            <DashboardLineChart />
          </div>
        </div>
      </div>
      <div className="step7">
        <TransactionContainer />
      </div>
    </div>
  );
};

export default DashboardPage;
