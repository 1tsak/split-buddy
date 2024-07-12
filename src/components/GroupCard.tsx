import React, { FC, useEffect, useState } from "react";
import { Group as IGroup } from "../utils/types";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getGroupMembers } from "../services/groupService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { Box, CircularProgress } from "@mui/material";

export interface IGroupCardProps {
  group: IGroup;
}

const GroupCard: FC<IGroupCardProps> = ({ group }) => {
  const { name, id } = group;
  const [grpMembers, setgrpMembers] = useState<string[]>();
  const [user,loading] = useAuthState(auth)
  const [layoutLoading,setLoading] = useState<boolean>(true);
  const fetchData = async () => {
    const grpMembers1 = await getGroupMembers(id,user?.uid as string);
    setgrpMembers(grpMembers1);
    setLoading(false)
  };
  const navigate = useNavigate();
  const onClickCard = () => {
    navigate(id);
  };
  useEffect(()=>{
    fetchData();
  },[])
  if(layoutLoading){
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return (<>
    {grpMembers && <div
      onClick={onClickCard}
      className=" bg-main h-[100px] rounded-lg flex gap-4 text-white cursor-pointer overflow-hidden border-[1px] shadow-sm"
    >
      <div className="p-2 flex flex-col shrink-0 w-24 h-full justify-center items-center bg-white">
        <MdOutlinePeopleAlt className="text-4xl text-main" />
      </div>
      <div className="flex-auto p-2 mt-2 flex flex-col justify-between">
        <p className="font-bold text-xl ">{name}</p>
        <div className="max-w-full">
          {grpMembers && grpMembers.map((member)=>{
            return <span>{member}</span>
          })}
          {grpMembers.length > 0 ? '...' : ""}
        </div>
      </div>
    </div>}
    </>
  );
};

export default GroupCard;
