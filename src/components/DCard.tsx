import React, { FC } from 'react'

import { FaHome } from "react-icons/fa";


const DCard:FC = () => {
  return (
    <div className='flex flex-col items-start p-8 rounded-xl bg-secondary'>
        <div className='bg-white p-4 rounded-full'>
        <FaHome />
        </div>
        <p>
            $6540.04
        </p>
        <p className='font-thin ml-1 text-gray-500'>Card Title</p>
    </div>
  )
}

export default DCard