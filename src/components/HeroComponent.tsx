import { PieChart, PieValueType } from "@mui/x-charts";
import React, { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import {
  getUserAmtData,
  getUserTotalPaidAmt,
} from "../services/dashboardServices";
import { Box, CircularProgress } from "@mui/material";
import { PieChartDataType } from "../utils/types";
import { MakeOptional } from "@mui/x-charts/internals";

interface IHeroComponetProps{
  amt:number;
  pieChartData:PieChartDataType[],
}

const HeroComponent:FC<IHeroComponetProps> = ({amt,pieChartData}) => {
  // const [loading, setLoading] = useState(true);
  // const [user,_] = useAuthState(auth);
  // const [amt, setAmt] = useState<number>(0);
  // const [pieChartData, setPieChartData] = useState<PieChartDataType[]>();
  // async function fetchData() {
  //   const data = await getUserTotalPaidAmt(user?.uid as string);
  //   const chartData = await getUserAmtData(user?.uid as string);
  //   setAmt(data);
  //   setPieChartData(chartData);
  //   setLoading(false);
  // }
  // useEffect(() => {
  //   fetchData();
  // }, []);


  return (
    <div className="bg-main rounded-lg h-[32vh] sm:h-[30vh] flex flex-col sm:flex-row overflow-hidden">
      <div className="flex justify-center items-center">
        {pieChartData ? (
          <PieChart
          
            slotProps={{
              noDataOverlay: {
                message: "No Data Available",
                sx: { color: "white",fill:'white',display:'flex',justifyContent:'center',alignItems:'center'},
              },
            }}
            width={(20/100) * window.innerWidth}
            height={(20/100) *window.innerHeight}
            className="text-white"
            colors={["white"]}
            series={[
              {
                data: pieChartData as MakeOptional<PieValueType, "id">[],
                innerRadius: '80%',
                outerRadius: '100%',
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 360,
                cx:'80%',
                
              },
            ]}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              width: "300px",
            }}
          >
            <CircularProgress className="text-white text-2xl" />
          </Box>
        )}
      </div>
      <div className="flex-auto flex items-center text-white">
        <div className="text-center sm:text-start flex-grow">
          <p className="font-thin text-lg min-w-64">
            Your Paid Amount Till Now
          </p>
          <p className="text-3xl sm:text-6xl 2xl:text-8xl font-bold flex justify-center items-center overflow-hidden">
            ₹
            {amt}
          </p>
          <p className="font-thin text-lg">Showing your Amount in INR</p>
        </div>
      </div>
      <div className="shrink-0 mt-8">
        <img height={200} className="" src="/dboard_curve2.png" alt="none" />
      </div>
    </div>
  );
};

export default HeroComponent;
