import React, { createContext, useState } from "react";
import { Group, GroupContextType } from "../utils/types";

export const GroupContext = createContext<GroupContextType | undefined>(
  undefined
);

const GroupProvider = ({ children }: { children: React.ReactNode }) => {
  const [groupData, setGroupData] = useState<Group | null>(null);

  const setGroup = (group: Group) => {
    setGroupData(group);
  };

  return (
    <GroupContext.Provider value={{ groupData, setGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupProvider;
