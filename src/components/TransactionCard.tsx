import React, { FC } from 'react'

const TransactionCard:FC = () => {
  return (
    <div className='flex gap-2 p-2 items-center'> 
        <div className='rounded-lg overflow-hidden bg-yellow-400 p-3'>
            icon
        </div>
        <div className='flex-grow'>
            <p className='font-bold'>Super</p>
            <p className='text-sm text-gray-400 font-thin'>2 min ago</p>
        </div>
        <div >
            <p className='text-red-800'>-345.00</p>
        </div>
    </div>
  )
}

export default TransactionCard