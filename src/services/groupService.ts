// write your firebase services here!

import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Group as IGroup, User } from "../utils/types";
import { User as IUser } from "../utils/types";
import { getUser } from "./authService";

export const getGroupById = async (groupId: string): Promise<IGroup | null> => {
  const groupDocRef = doc(db, "groups", groupId);
  const groupDocSnap = await getDoc(groupDocRef);

  if (groupDocSnap.exists()) {
    return { id: groupDocSnap.id, ...groupDocSnap.data() } as IGroup;
  } else {
    console.log("No such document!");
    return null;
  }
};

const dbCollection = {
  groups: collection(db, "groups"),
  users: collection(db, "users"),
};

const getGroups = async (userId?: string): Promise<IGroup[]> => {
  const grpquery = query(
    dbCollection.groups,
    or(
      where("members", "array-contains", userId),
      where("createdBy", "==", userId)
    )
  );
  const groupSnapShot = await getDocs(grpquery);
  const groups: IGroup[] = new Array<IGroup>();
  groupSnapShot.forEach((group) => groups.push(group.data() as IGroup));
  return groups;
};

const getGroup = async (groupId: string): Promise<IGroup> => {
  const groupRef = await doc(dbCollection.groups, groupId);
  const group = await getDoc(groupRef);
  return group.data() as IGroup;
};

const createNewGroup = async (groupName: string, userId: string) => {
  const groupRef = doc(dbCollection.groups);
  await setDoc(groupRef, {
    id: groupRef.id,
    description: "",
    name: groupName,
    createdBy: userId,
    members: [userId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

const addMember = async (groupId: string, emailId: string) => {
  try {
    const userQuery = query(dbCollection.users, where("email", "==", emailId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      throw new Error("User Not found");
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data() as IUser;
    const userRef = doc(dbCollection.users, userData.id);
    const groupRef = doc(dbCollection.groups, groupId);

    await updateDoc(userRef, {
      groupsIn: arrayUnion(groupId),
    });

    await updateDoc(groupRef, {
      members: arrayUnion(userData.id),
    });

    console.log("User and group updated successfully");
  } catch (error) {
    throw error;
  }
};

const removeMembers = async (groupId: string, userId: string) => {
  try {
    const userRef = doc(dbCollection.users, userId);
    const groupRef = doc(dbCollection.groups, groupId);

    await updateDoc(userRef, {
      groupsIn: arrayRemove(groupId),
    });

    await updateDoc(groupRef, {
      members: arrayRemove(userId),
    });

    console.log("User and group updated successfully");
  } catch (error) {
    throw error;
  }
};

const deleteGroup = async (groupId: string) => {
  const groupRef = doc(dbCollection.groups, groupId);
  await deleteDoc(groupRef);
};

const getGroupMembers = async (
  groupId: string,
  userId: string
): Promise<string[]> => {
  const group: IGroup = await getGroup(groupId);
  const users: string[] = new Array<string>;
 for (const member of group.members){
  const user = await getUser(member)
  if(user?.id!=userId){
    users.push(user?.displayName as string)
  }
 }
  return users;
};
export {
  getGroups,
  getGroup,
  createNewGroup,
  deleteGroup,
  addMember,
  removeMembers,
  getGroupMembers,
};
