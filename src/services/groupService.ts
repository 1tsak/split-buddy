// write your firebase services here!

import {
  Query,
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Group as IGroup } from "../utils/types";
import { User as IUser } from "../utils/types";

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
    where("members", "array-contains", userId),

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
  const userQuery = query(dbCollection.users, where("email", "==", emailId));
  const user = await getDocs(userQuery);
  if (user.empty) throw new Error("User Not found");
  const userData = user.docs.map((user) => user.data())[0] as IUser;
  const userRef = doc(dbCollection.users, userData.id);
  await setDoc(userRef, {
    groupsIn: arrayUnion(groupId),
  });
  const groupRef = doc(dbCollection.groups, groupId);
  await setDoc(groupRef, {
    members: arrayUnion(userData.id),
  });
};

const removeMembers = async (
  groupId: string,
  emailId?: string,
  userId?: string
) => {
  const userQuery = query(
    dbCollection.users,
    where("email", "==", emailId || userId)
  );
  const user = await getDocs(userQuery);
  if (user.empty) throw new Error("User Not found");
  const userData = user.docs.map((user) => user.data())[0] as IUser;
  const userRef = doc(dbCollection.users, userData.id);
  await setDoc(userRef, {
    groupsIn: arrayRemove(groupId),
  });
  const groupRef = doc(dbCollection.groups, groupId);
  await setDoc(groupRef, {
    members: arrayRemove(userData.id),
  });
};

const deleteGroup = async (groupId: string) => {
  const groupRef = doc(dbCollection.groups, groupId);
  await deleteDoc(groupRef);
};

export {
  getGroups,
  getGroup,
  createNewGroup,
  deleteGroup,
  addMember,
  removeMembers,
};
