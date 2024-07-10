// write your firebase services here!
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Group } from '../utils/types';

export const getGroupById = async (groupId: string): Promise<Group | null> => {
  const groupDocRef = doc(db, 'groups', groupId);
  const groupDocSnap = await getDoc(groupDocRef);

  if (groupDocSnap.exists()) {
    return { id: groupDocSnap.id, ...groupDocSnap.data() } as Group;
  } else {
    console.log('No such document!');
    return null;
  }
};