import { useParams } from "react-router-dom";
import Sider from "./components/Sider";

import GroupHome from "./components/GroupHome";
import useGroup from "../../hooks/useGroup";
import { useEffect } from "react";
import { getGroupById } from "../../services/groupService";

const GroupPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { setGroup } = useGroup();

  useEffect(() => {
    const fetchGroupData = async () => {
      if (groupId) {
        const group = await getGroupById(groupId);
        if (group) setGroup(group);
      }
    };
    fetchGroupData();
  }, [groupId]);
  return (
    <div className="h-full flex">
      <Sider />
      <div className="w-3/4 h-full">
        <GroupHome />
      </div>
    </div>
  );
};

export default GroupPage;
