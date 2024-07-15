import { PieChart, PieValueType } from '@mui/x-charts'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { getUserAmtData, getUserTotalPaidAmt } from '../services/dashboardServices';
import { Box, CircularProgress } from '@mui/material';
import { PieChartDataType } from '../utils/types';
import { MakeOptional } from '@mui/x-charts/internals';

const HeroComponent = () => {
  const [loading,setLoading] = useState(true);
  // const [user,_] = useAuthState(auth);
  const [amt,setAmt] = useState<number>(0);
  const [pieChartData,setPieChartData] = useState<PieChartDataType[]>();
  async function fetchData(){
    const data = await getUserTotalPaidAmt('userId1');
    const chartData = await getUserAmtData('userId1');
    setAmt(data);
    setPieChartData(chartData)
    console.log(chartData)
    setLoading(false)
  }
  useEffect(()=>{
    fetchData()
  },[])

  

  return (
    <div className="bg-main rounded-lg h-[30vh] flex flex-col sm:flex-row overflow-hidden">
                <div className="flex justify-center items-center">
                  {pieChartData ? <PieChart sx={{height:"100px"}}
                    width={300}
                    height={200}
                    colors={["white"]}
                    series={[
                      {
                        data: pieChartData as MakeOptional<PieValueType,"id">[],
                        innerRadius: 70,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: -90,
                        endAngle: 360,
                        cx: 140,
                      },
                    ]}
                  /> :<Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <CircularProgress className='text-white' />
                </Box> }
                </div>
                <div className="flex-auto flex items-center text-white">
                  <div className="text-center sm:text-start flex-grow">
                    <p className="font-thin text-lg ml-2 min-w-64">Your Paid Amount Till Now</p>
                    <p className="text-4xl sm:text-6xl 2xl:text-8xl font-bold flex items-center">{'₹'}{loading ? <Box
        sx={{
          display: "flex",
        }}
      >
        <CircularProgress className='text-white' />
      </Box> :amt}</p>
                    <p className="font-thin text-lg ml-2">
                      Showing your balance in INR
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
  )
}

export default HeroComponent