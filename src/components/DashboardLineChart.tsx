import { LineChart } from '@mui/x-charts'
import React from 'react'


const DashboardLineChart = () => {
  return (
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
  )
}

export default DashboardLineChart