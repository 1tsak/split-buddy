import React, { FC } from 'react'
import { GiPayMoney } from "react-icons/gi";
import { MdAttachMoney } from 'react-icons/md';

interface ITransactionCardProps{
  money:number,
}

const TransactionCard:FC = () => {
  return (
    <div className='flex gap-2 p-2 items-center'> 
        <div className='rounded-lg overflow-hidden bg-green-400 p-3'>
            <MdAttachMoney className='text-white text-xl font-bolder'/>
        </div>
        <div className='flex-grow'>
            <p className='font-bold'>Super</p>
            <p className='text-sm text-gray-400 font-thin'>2 min ago</p>
        </div>
        <div >
            <p className='text-green-500'>-345.00</p>
        </div>
    </div>
  )
}

export default TransactionCard