import { CiMoneyBill } from "react-icons/ci";
import { FC } from "react";
import { RecentBillCardType } from "../../types/types";

interface IRecentBillCardProps{
  data:RecentBillCardType;
}

const RecentBillCard:FC<IRecentBillCardProps> = ({data}) => {
  const {amount,title} = data;
  return (
    <div className='flex flex-col items-center justify-center p-8 pr-10 gap-2 rounded-xl bg-card-color'>
        <div className='bg-white p-4 rounded-full'>
        <CiMoneyBill className="text-3xl"/>
        </div>
        <p className='text-2xl'>
        ₹{amount}
        </p>
        <p className='font-normal items-center text-center text-l text-nowrap text-gray-500'>{title}</p>
    </div>
  )
}

export default RecentBillCard