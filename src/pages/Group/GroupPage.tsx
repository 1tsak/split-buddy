import { Outlet, useParams, Routes, Route } from "react-router-dom";
import Sider from "./components/Sider";
import useGroup from "../../hooks/useGroup";
import { useEffect, useState } from "react";
import { getGroupById } from "../../services/groupService";
import { fetchExpenses } from "../../services/expenseService";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { setGroup, setExpenses } = useGroup();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (groupId) {
        setLoading(true);
        const group = await getGroupById(groupId);
        if (group) setGroup(group);
        const expenses = await fetchExpenses(groupId);
        console.log(expenses)
        setExpenses(expenses);
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [groupId]);

  return (
    <div className="h-full flex">
      <Sider />
      <div className="w-3/4 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default GroupPage;
