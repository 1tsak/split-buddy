import { LineChart } from '@mui/x-charts'
import React, { FC, useEffect, useState } from 'react'
import { getUserAmtData } from '../services/dashboardServices';
import { Box, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { LineChartGroupType } from '../utils/types';

interface DashboardLineChartProps{
  chartData:LineChartGroupType
}

const DashboardLineChart:FC<DashboardLineChartProps> = ({chartData}) => {
    // const [chartData,setChartData] = useState<number[]>([]);
    // const [user,_] = useAuthState(auth)
    // const fetchData = async ()=>{
    //     const data = await getUserAmtData(user?.uid as string);
    //     const chartDat = data.map((dataPoint)=>dataPoint.value);
    //     setChartData(chartDat);
    // }
    // useEffect(()=>{
    //     fetchData();
    // },[])
    const data = Object.keys(chartData).map(date=>{
      return chartData[date]
    })
    const dayData = Object.keys(chartData).map(date=>{
      return Math.floor(Number(date))
    })
  return (
    <div className="border-main border-[1px] h-96 w-full rounded-lg">
              {chartData ? <LineChart 
                xAxis={[{ data: dayData,tickMinStep:1}]}
                series={[
                  { label:'Day wise Expense',
                    data: data,
                    color: "#687EEF",
                  },
                ]}
              />: <Box
              sx={{
                display: "flex",
              }}
            >
              <CircularProgress className="text-white" />
            </Box>}
            </div>
  )
}

export default DashboardLineChart