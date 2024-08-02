import React, { FC } from 'react'
import { TransactionCardType } from '../../types/types'
import { CiCalendarDate } from 'react-icons/ci'
import TransactionCard from './TransactionCard'

interface ITransactionDateContainerProps{
    transactions:TransactionCardType[]
    date:string
}

const TransactionDateContainer:FC<ITransactionDateContainerProps> = ({transactions,date}) => {

  return (
    <div className='flex flex-col flex-grow'>   
       <div className='flex gap-2 items-center justify-start'>
        <CiCalendarDate className='text-xl'/>
        <p className='font-bolder text-xl'>{date}</p>
       </div>
       <div>
        {transactions.map((t,i)=>{
            return <TransactionCard data={t} key={i}/>
        })}
       </div>
    </div>
  )
}

export default TransactionDateContainer