import React, { FC } from "react";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { sampleGroupData } from "../data/sampleExpenses";
import GroupCard from "../components/GroupCard";
import NewGroupModal from "../components/NewGroupDialog";

const GroupHomePage: FC = () => {
  return (
    <div className="m-2">
      <div className="flex justify-between items-center mx-4">
        <h1 className="text-2xl font-bold">Your Groups</h1>

        <NewGroupModal />
      </div>
      <div className="overflow-scroll h-[80vh] mx-5 mt-2">
        {sampleGroupData.map((group, i) => {
          return <GroupCard group={group} key={i} />;
        })}
      </div>
    </div>
  );
};

export default GroupHomePage;
