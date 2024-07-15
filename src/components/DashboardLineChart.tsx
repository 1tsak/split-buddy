import { LineChart } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import { getUserAmtData } from '../services/dashboardServices';
import { Box, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';


const DashboardLineChart = () => {
    const [chartData,setChartData] = useState<number[]>([]);
    const [user,_] = useAuthState(auth)
    const fetchData = async ()=>{
        const data = await getUserAmtData(user?.uid as string);
        const chartDat = data.map((dataPoint)=>dataPoint.value);
        setChartData(chartDat);
    }
    useEffect(()=>{
        fetchData();
    },[])
  return (
    <div className="border-main border-[1px] h-96 w-full rounded-lg">
              {chartData ? <LineChart 
                // xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: chartData,
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