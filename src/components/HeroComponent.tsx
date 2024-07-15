import { PieChart } from '@mui/x-charts'
import React from 'react'

const HeroComponent = () => {
  return (
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
  )
}

export default HeroComponent