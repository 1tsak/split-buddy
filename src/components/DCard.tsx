import React, { FC } from 'react'

import { FaHome } from "react-icons/fa";


const DCard:FC = () => {
  return (
    <div className='flex flex-col items-start p-8 pr-10 gap-2 rounded-xl bg-card-color'>
        <div className='bg-white p-4 rounded-full'>
        <FaHome />
        </div>
        <p className='text-2xl'>
            $6540.04
        </p>
        <p className='font-normal text-xl text-gray-500'>Card Title</p>
    </div>
  )
}

export default DCard