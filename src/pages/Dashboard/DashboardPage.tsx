import { Box, CircularProgress, Typography } from "@mui/material";
import {
  LineChartGroupType,
  PieChartDataType,
  RecentBillCardType,
} from "../../types/types";
import React, { useEffect, useState } from "react";
import {
  getDataForLineChart,
  getUserAmtData,
  getUserRecentBills,
  getUserTotalPaidAmt,
} from "../../services/dashboardServices";

import DashboardLineChart from "../../components/Dashboard/DashboardLineChart";
import HeroComponent from "../../components/Home/HeroComponent";
import RecentBillCardContainer from "../../components/Dashboard/RecentBillCardContainer";
import TransactionContainer from "../../components/Dashboard/TransactionContainer";
import Walkthrough from "../../components/Common/Walkthrough";
import { auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation(); // Add translation hook
  const [user, _] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [amt, setAmt] = useState<number>(0);
  const [pieChartData, setPieChartData] = useState<PieChartDataType[]>([]);
  const [bills, setBills] = useState<RecentBillCardType[]>([]);
  // const [chartData, setChartData] = useState<LineChartGroupType>();

  const [runWalkthrough, setRunWalkthrough] = useState(false); // State for Walkthrough

  const userId = user?.uid as string;

  const fetchData = () => {
    Promise.all([
      getUserTotalPaidAmt(userId),
      getUserAmtData(userId),
      getUserRecentBills(userId),
      getDataForLineChart(userId, null),
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
    const hasShownWalkthrough = localStorage.getItem(`shown${userId}`);
    if (hasShownWalkthrough === userId) {
      setRunWalkthrough(false);
    }else{
      setRunWalkthrough(true);
    }
  }, []);

  const handleFinishWalkthrough = () => {
    setRunWalkthrough(false);
    localStorage.setItem(`shown${userId}`, userId);
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
    <div className="grid xl:grid-cols-[3.5fr_1.5fr]  gap-4 p-4 ">
      <Walkthrough runWalkthrough={runWalkthrough} onFinish={handleFinishWalkthrough} />
      <div className="overflow-scroll p-4 max-h-[90vh]">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-2 step-1">
            <Typography variant="h6" fontWeight="bold">
              {t('dashboard.userDashboard')}
            </Typography>
          </div>
          <div>
            <HeroComponent amt={amt} pieChartData={pieChartData} />
          </div>
          <div>
            <Typography variant="h6" fontWeight="bold" mt={2}>
              {t('dashboard.recentBills')}
            </Typography>
            <RecentBillCardContainer bills={bills} />
          </div>
        </div>
        <div className="">
          <div className="flex justify-between mt-2">
            <div>
              <Typography variant="h6" fontWeight="bold" mt={2}>
                {t('dashboard.overview')}
              </Typography>
            </div>
            {/* <div>put buttons</div> */}
          </div>
          <div className="mt-2">
            <DashboardLineChart />
          </div>
        </div>
      </div>
      <div className="step-7">
        <TransactionContainer />
      </div>
    </div>
  );
};

export default DashboardPage;
