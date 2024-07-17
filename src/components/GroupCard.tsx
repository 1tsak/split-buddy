import React, { FC, useEffect, useState } from "react";
import { Group as IGroup } from "../utils/types";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getGroupMembers } from "../services/groupService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { Box, CircularProgress } from "@mui/material";
import { LuUsers } from "react-icons/lu";

export interface IGroupCardProps {
  group: IGroup;
}

const GroupCard: FC<IGroupCardProps> = ({ group }) => {
  const { name, id } = group;
  const [grpMembers, setgrpMembers] = useState<string[]>();
  const [user, loading] = useAuthState(auth);
  const [layoutLoading, setLoading] = useState<boolean>(true);
  const fetchData = async () => {
    const grpMembers1 = await getGroupMembers(id, user?.uid as string);
    setgrpMembers(grpMembers1);
    setLoading(false);
  };
  const navigate = useNavigate();
  const onClickCard = () => {
    navigate(id);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {
        <div
          onClick={onClickCard}
          className=" bg-main h-[100px] rounded-lg flex gap-4 text-white cursor-pointer overflow-hidden border-[1px] shadow-sm"
        >
          <div className="p-2 flex flex-col shrink-0 w-24 h-full justify-center items-center bg-white">
            <MdOutlinePeopleAlt className="text-4xl text-main" />
          </div>
          <div className="flex-auto p-2 mt-2 flex flex-col justify-between relative">
            <div className=" absolute top-2 right-5 flex gap-1 items-center">
              <p className="text-sm">{grpMembers && grpMembers.length}</p>
              <LuUsers />
            </div>
            <div className="font-bold text-xl  ">{name}</div>
            {/* <div className="max-w-full">
          You,{grpMembers && grpMembers.map((member)=>{
            return <span>{member},</span>
          })}
          {grpMembers.length > 0 ? '...' : ""}
        </div> */}
          </div>
        </div>
      }
    </>
  );
};

export default GroupCard;
