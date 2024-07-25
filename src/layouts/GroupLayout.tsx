import { Box, CircularProgress } from "@mui/material";
import { Outlet, Route, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Sider from "../components/Group/Sider";
import useGroup from "../hooks/useGroup";

const GroupLayout = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { fetchGroupsData,fetchExpensesData,loading } = useGroup();

  useEffect(() => {
    console.log("changhed")
    if (groupId) {
      fetchGroupsData(groupId);
      fetchExpensesData(groupId);
    }
  }, [groupId]);

  return (
    <div className="h-full overflow-hidden flex">
      <Sider />
      <div className="w-3/4 h-full">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "90vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default GroupLayout;
