// write your firebase services here!

import { Group as IGroup, User } from "../types/types";
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

import { User as IUser } from "../types/types";
import { db } from "../firebaseConfig";
import { getUser } from "./authService";
import { ref } from "firebase/storage";
import { use } from "i18next";

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





// by abhishek mei kuch delete kia
const getGroups = async (userId?: string): Promise<IGroup[]> => {
  const grpquery = query(
    dbCollection.groups,
    where("members", "array-contains", userId)
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

const createNewGroup = async (groupName: string,groupDescription:string, userId: string) => {
  const groupRef = doc(dbCollection.groups);
  await setDoc(groupRef, {
    id: groupRef.id,
    description: groupDescription,
    name: groupName,
    createdBy: userId,
    members: [userId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const userRef = doc(dbCollection.users, userId);
  await updateDoc(userRef, {
    groupsIn: arrayUnion(groupRef.id),
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
  const groupData = await getGroupById(groupId);
  if (groupData) {
    const groupMembers = groupData.members || [];
    const leaveGroupAll = groupMembers.map((member) => leaveGroup(groupId, member));
    await Promise.all(leaveGroupAll);
    // console.log(groupData);

    // Delete the group document
    await deleteDoc(groupRef);
    console.log(`Group ${groupId} deleted successfully`);
  } else {
    console.log(`Group ${groupId} does not exist`);
  }
};

const leaveGroup = async(groupId: string, userId: string) =>{
  try {
    
    const groupRef = doc(dbCollection.groups, groupId);
    const userRef = doc(dbCollection.users, userId);

    await updateDoc(groupRef, {
      members: arrayRemove(userId)
    })
    await updateDoc(userRef, {
      groupsIn : arrayRemove(groupId),
    });
    console.log(`Group left succcessfully`);
  }catch(error){
    console.log(`Error in leaving group`);
  }

}


export const getGroupMemberByGroupId = async (groupId: string): Promise<User[]> => {
  try {
    const group: IGroup = await getGroup(groupId);
    const userdetail = group.members.map((userid) => {
      return getUser(userid);
    });
    const groupMember:any = await Promise.all(userdetail);
    if(!groupMember) return [];
    else return groupMember;
  } catch (error) {
    console.error(`Error fetching group by ID ${groupId}:`, error);
    return [];
  }
};


const getGroupMembers = async (
  groupId: string,
  userId: string
): Promise<string[]> => {
  const group: IGroup = await getGroup(groupId);
  const users: string[] = new Array<string>();
  for (const member of group.members) {
    const user = await getUser(member);
    if (user?.id != userId) {
      users.push(user?.displayName as string);
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
  leaveGroup
};
 

