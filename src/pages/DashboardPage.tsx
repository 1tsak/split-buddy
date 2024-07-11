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
import { signOut } from "firebase/auth";
import { PieChart } from "@mui/x-charts/PieChart";

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
      <div className="grid grid-cols-[4fr_1fr] mt-5 gap-2 p-4">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-extrabold">DashBoard</h2>
              <Button className=" text-main border-main p-1" variant="outlined">
                More
              </Button>
            </div>
            <div>
              <div className="bg-main rounded-lg h-[30vh] flex overflow-hidden">
                <div><PieChart width={300}
  height={300} colors={["white"]} 
                  series={[
                    {
                      data: [{ id:1,value: 10 }, {id:2, value: 10 },{id:3, value: 10, color: "white" }, { id:4,value: 40 }],
                      innerRadius:80,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 360,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                /></div>
                <div className="flex-auto flex items-center text-white">
                  <div>
                    <p className="font-thin text-lg ml-2">My Balance</p>
                    <p className="text-8xl font-bold">$10000.00</p>
                  </div>  
                </div>
                <div className="shrink-0">
                  <img height={200} className="md:hidden lg:inline" src="/dboard_curve2.png" alt="none" />
                </div>
              </div>
            </div>
            <div>small cards</div>
          </div>
          <div>
            <div>Income + left right</div>
            <div>
            
            </div>
          </div>
        </div>
        <div>
          <div>Transactions</div>
          <div>Current Results</div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
