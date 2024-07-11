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
<<<<<<< HEAD
    dbCollection.groups,
    where("members", "array-contains", userId),

=======
    dbCollection.groups,or(where("members", "array-contains", userId),
    where("createdBy", "==", userId)),
>>>>>>> b1da234a0279196d8430d186e14ff9ffe2cf2ecb
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
    throw error
  }
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
