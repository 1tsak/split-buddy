import { FC } from 'react';
import { MdAttachMoney } from 'react-icons/md';
import { TransactionCardType } from '../utils/types';

interface ITransactionCardProps{
  data:TransactionCardType,
}




const TransactionCard:FC<ITransactionCardProps> = ({data}) => {
  const {amount,isGetting} = data;
  return (
    <div className='flex gap-2 p-2 items-center'> 
        <div className={`rounded-lg overflow-hidden p-3 ${isGetting ? 'bg-green-400': 'bg-red-400'} `}>
            <MdAttachMoney className='text-white text-xl font-bolder'/>
        </div>
        <div className='flex-grow flex justify-start items-center'>
            <p className='font-bold'>{isGetting ? "Received" : 'Send'}</p>
            {/* <p className='text-sm text-gray-400 font-thin'>2 min ago</p> */}
        </div>
        <div >
            <p className={isGetting ? 'text-green-500': 'text-red-500'}>{isGetting?"":'-'}₹{amount}</p>
        </div>
    </div>
  )
}

export default TransactionCard