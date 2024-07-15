import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { Box, Typography, CircularProgress } from "@mui/material";
import HeroComponent from "../components/HeroComponent";
import DashboardLineChart from "../components/DashboardLineChart";
import DCardContainer from "../components/DCardContainer";
import TransactionContainer from "../components/TransactionContainer";

const DashboardPage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

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
    
      <div className="grid xl:grid-cols-[3.5fr_1.5fr]  gap-4 p-4 ">
        <div className="overflow-scroll max-h-[90vh]">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-extrabold">User Dashboard</h2>
              {/* <Button className=" text-main border-main p-1" variant="outlined">
              More
            </Button> */}
            </div>
            <div>
              <HeroComponent />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">Recent Bills</h2>
              <DCardContainer />
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
              <DashboardLineChart />
            </div>
          </div>
        </div>
        <div>
          <TransactionContainer />
        </div>
      </div>
    
  );
};

export default DashboardPage;
