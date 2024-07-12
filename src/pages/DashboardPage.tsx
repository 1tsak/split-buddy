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
      <div className="grid xl:grid-cols-[3.5fr_1.5fr] mt-5 gap-4 p-4 overflow-scroll max-h-[88vh]">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-extrabold">User Dashboard</h2>
              <Button className=" text-main border-main p-1" variant="outlined">
                More
              </Button>
            </div>
            <div>
              <div className="bg-main rounded-lg h-[30vh] flex flex-col sm:flex-row overflow-hidden">
                <div className="flex justify-center items-center">
                  <PieChart sx={{height:"100px"}}
                    width={300}
                    height={200}
                    colors={["white"]}
                    series={[
                      {
                        data: [
                          { id: 1, value: 10 },
                          { id: 2, value: 10 },
                          { id: 3, value: 10, color: "white" },
                          { id: 4, value: 40 },
                        ],
                        innerRadius: 70,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: -90,
                        endAngle: 360,
                        cx: 140,
                      },
                    ]}
                  />
                </div>
                <div className="flex-auto flex items-center text-white">
                  <div className="text-center sm:text-start flex-grow">
                    <p className="font-thin text-lg ml-2">My Balance</p>
                    <p className="text-4xl sm:text-6xl 2xl:text-8xl font-bold">$10000.00</p>
                    <p className="font-thin text-lg ml-2">
                      Showing your balance in USD
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-8">
                  <img
                    height={200}
                    className=""
                    src="/dboard_curve2.png"
                    alt="none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-around mt-2">
              <DCard />
              <DCard />
              <DCard />
              <DCard />
            </div>
          </div>
          <div className="">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">Income Overview</h2>
              </div>
              <div>put buttons</div>
            </div>
            <div className="border-main border-[1px] h-96 w-full rounded-lg">
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5, 4, 8, 1, 10],
                    color: "#687EEF",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-xl border-main border-[1px] p-2">
            <p className="text-2xl font-extrabold">Transactions</p>
            <p className="text-gray-400 text-sm">Recent expenses</p>
            <div>
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
              <TransactionCard />
            </div>
          </div>
          
          <div>
            <p className="text-2xl font-extrabold">Current Results</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
