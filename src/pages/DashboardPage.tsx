import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import {
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import DCard from "../components/DCard";
import { LineChart } from "@mui/x-charts";
import TransactionCard from "../components/TransactionCard";
import HeroComponent from "../components/HeroComponent";
import DashboardLineChart from "../components/DashboardLineChart";
import DCardContainer from "../components/DCardContainer";

const DashboardPage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error.message}
      </Typography>
    );
  }

  return (
    <>
      <div className="grid xl:grid-cols-[3.5fr_1.5fr] mt-5 gap-4 p-4 overflow-scroll max-h-[90vh]">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-extrabold">User Dashboard</h2>
              {/* <Button className=" text-main border-main p-1" variant="outlined">
                More
              </Button> */}
            </div>
            <div>
              <HeroComponent/>
            </div>
            <div>
            <h2 className="text-2xl font-extrabold">Recent Bills</h2>
              <DCardContainer/>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between mt-2">
              <div>
                <h2 className="text-2xl font-extrabold mt-2">Overview</h2>
              </div>
              {/* <div>put buttons</div> */}
            </div>
            <div className="mt-2">
              <DashboardLineChart/>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-xl border-main border-[1px] p-2 flex-auto">
            <p className="text-2xl font-extrabold">Recent Transactions</p>
            <p className="text-gray-400 text-sm"></p>
            <div className="overflow-scroll h-[70vh]">
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
