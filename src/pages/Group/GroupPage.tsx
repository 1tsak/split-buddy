import { Outlet, useParams, Routes, Route } from "react-router-dom";
import Sider from "./components/Sider";
import useGroup from "../../hooks/useGroup";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { fetchGroupsData,fetchExpensesData,loading } = useGroup();

  useEffect(() => {
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

export default GroupPage;
