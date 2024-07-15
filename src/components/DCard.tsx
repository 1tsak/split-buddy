import { FC } from "react";
import { CiMoneyBill } from "react-icons/ci";
import { DCardType } from "../utils/types";


interface IDCardProps{
  data:DCardType;
}

const DCard:FC<IDCardProps> = ({data}) => {
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

export default DCard