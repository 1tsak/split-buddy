import React, { FC } from 'react'
import { Group as IGroup } from '../utils/types'
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export interface IGroupCardProps{
    group:IGroup;
}

const GroupCard:FC<IGroupCardProps> = ({group}) => {
    const {name,members,id} = group;
    const navigate = useNavigate();
    const onClickCard = ()=>{
      navigate(id);
    }
  return (
    <div onClick={onClickCard} className=' bg-main h-[100px] rounded-lg flex gap-4 items-center text-white p-2 cursor-pointer'>
        <div className='p-2  rounded-full w-16 h-16 flex flex-col justify-center items-center bg-secondary'>
           
        <MdOutlinePeopleAlt className='text-3xl'/>
        </div>
        <div className='flex-auto '>
            <p className='font-bold text-xl '>{name}</p>
        </div>
    </div>
  )
}

export default GroupCard