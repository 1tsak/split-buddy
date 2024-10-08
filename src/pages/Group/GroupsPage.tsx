import { Box, CircularProgress } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { getGroupMembers, getGroups } from "../../services/groupService";

import GroupCard from "../../components/Group/GroupCard";
import { Group as IGroup } from "../../types/types";
import NewGroupModal from "../../components/Group/NewGroupDialog";
import { auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

// import Walkthrough from "../components/WalkThrough";

const GroupsPage: FC = () => {
  const [user, loading] = useAuthState(auth);
  const [groups, setGroups] = useState<IGroup[]>();
  const [lding, setLoading] = useState<boolean>(true);
  const fetchData = async () => {
    const group = await getGroups(user?.uid);
    setGroups(group);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {lding ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <CircularProgress className="text-main" />
        </Box>
      ) : (
        <div className="my-4 mx-2">
          <div className="flex justify-between items-center mx-4">
            <h1 className="text-xl font-bold">Your Groups</h1>

            <NewGroupModal fetchData={fetchData} />
            
          </div>
          <div className="overflow-scroll grid grid-cols-1 md:grid-cols-[1fr_1fr] 2xl:grid-cols-[1fr_1fr_1fr] gap-4  max-h-[80vh] mx-5 mt-4">
            {groups
              ? groups.map((group, i) => {
                  return <GroupCard group={group} key={i} />;
                })
              : ""}
          </div>
        </div>
      )}
    </>
  );
};

export default GroupsPage;
