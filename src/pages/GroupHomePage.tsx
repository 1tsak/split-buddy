import React, { FC, useEffect, useState } from "react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { sampleGroupData } from "../data/sampleExpenses";
import GroupCard from "../components/GroupCard";
import NewGroupModal from "../components/NewGroupDialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import {Group as IGroup} from "../utils/types"
import { getGroups } from "../services/groupService";


const GroupHomePage: FC = () => {
    const [user,loading] = useAuthState(auth);
    const [groups,setGroups] = useState<IGroup[]>()
    const fetchData = async()=>{
        const group = await getGroups(user?.uid);
        setGroups(group);
    }
    useEffect(()=>{
        fetchData()
    },[])
  return (
    <div className="m-2">
      <div className="flex justify-between items-center mx-4">
        <h1 className="text-2xl font-bold">Your Groups</h1>

        <NewGroupModal fetchData={fetchData}/>
      </div>
      <div className="overflow-scroll grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr] gap-4  max-h-[80vh] mx-5 mt-2">
        {groups && groups.map((group, i) => {
          return <GroupCard group={group} key={i} />;
        })}
      </div>
    </div>
  );
};

export default GroupHomePage;
