import { LineChart, ResponsiveChartContainer } from "@mui/x-charts";
import React, { FC, SyntheticEvent, useEffect, useState } from "react";
import {
  getDataForLineChart,
  getUserAmtData,
} from "../services/dashboardServices";
import { Box, CircularProgress, hslToRgb } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { LineChartGroupType } from "../utils/types";
import DatePickerComp from "./DatePicker";
import { DateRange } from "rsuite/esm/DateRangePicker";

interface DashboardLineChartProps {
  chartData: LineChartGroupType;
}

const DashboardLineChart: FC = () => {
  const [chartData, setChartData] = useState<LineChartGroupType>();
  const [user, _] = useAuthState(auth);
  const [dateValue, setDateValue] = useState<DateRange | null>([
    new Date(),
    new Date(),
  ]);
  const fetchData = async () => {
    const data = await getDataForLineChart(
      user?.uid as string,
      dateValue as DateRange
    );
    setChartData(data);
  };

  useEffect(() => {
    fetchData();
  }, [dateValue]);

  // data manipulation
  let seriesData: number[] = [];
  let dayData: number[] = [];
  if (chartData) {
    seriesData = Object.keys(chartData).map((date) => {
      return chartData[date];
    });
    dayData = Object.keys(chartData).map((date) => {
      return Math.floor(Number(date));
    });
  }

  const handleChange = (
    value: DateRange | null,
    event: SyntheticEvent<Element, Event>
  ) => {
    setDateValue(value);
    
  };

  return (
    <div className="  w-full flex flex-col justify-center items-center p-5">
      <div className="flex justify-center gap-4">
        <DatePickerComp dateValue={dateValue} setdateValue={handleChange} />
      </div>

      {chartData ? (
        <div className="w-full flex justify-center">
          <LineChart
            height={300}
            margin={{left:100,right:100}}
            xAxis={[{ data: dayData, tickMinStep: 1 }]}
            series={[
              {area:true, label: "Day wise Expense", data: seriesData, color: hslToRgb('hsl(230, 81%, 90%)') },
            ]}
          />
        </div>
      ) : (
        //     <ResponsiveChartContainer>
        // </ResponsiveChartContainer>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <CircularProgress className="text-white" />
        </Box>
      )}
    </div>
  );
};

export default DashboardLineChart;
