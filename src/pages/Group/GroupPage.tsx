import { useParams } from "react-router-dom";
import Sider from "./components/Sider";

import GroupHome from "./components/GroupHome";

const GroupPage = () => {
  const params = useParams();


  console.log(params);
  return (
    <div className="h-full flex">
      <Sider />
      <div className="w-3/4 h-full">
       <GroupHome/>
      </div>
    </div>
  );
};

export default GroupPage;
