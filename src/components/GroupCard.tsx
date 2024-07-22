import { FC } from "react";
import { Group as IGroup } from "../utils/types";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { LuUsers } from "react-icons/lu";

export interface IGroupCardProps {
  group: IGroup;
}

const GroupCard: FC<IGroupCardProps> = ({ group }) => {
  const { name, id, description, members } = group;
  const navigate = useNavigate();
  const onClickCard = () => {
    navigate(id);
  };

  return (
    <>
      {
        <div
          onClick={onClickCard}
          className=" bg-white h-[100px] rounded-lg flex gap-4 text-white cursor-pointer overflow-hidden border-[1px] shadow-sm"
        >
          <div className="p-2 flex flex-col shrink-0 w-24 h-full justify-center items-center bg-white">
            <MdOutlinePeopleAlt className="text-4xl text-main" />
          </div>
          <div className="flex-auto p-2 mt-2 flex flex-col justify-between relative text-slate-500">
            <div className=" absolute top-2 right-5 flex gap-1 items-center">
              <p className="text-sm">{members.length}</p>
              <LuUsers />
            </div>
            <div className="m-w-[600px] flex flex-col gap-1">
              <div className="font-bold text-xl  ">{name}</div>
              <div className="font-light text-sm  ">{description}</div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default GroupCard;
