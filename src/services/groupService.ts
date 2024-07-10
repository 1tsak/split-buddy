// write your firebase services here!
import { Query, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Group as IGroup } from "../utils/types";

const groupDb = {
    groups:collection(db,'groups')
}

const getGroups = async (userId?:string):Promise<IGroup[]> =>{
    const groupQuery = await getDocs(groupDb.groups);
    const groups:IGroup[] = new Array<IGroup>;
    groupQuery.forEach((group)=>groups.push(group.data() as IGroup));
    return groups;
}

const getGroup = async (groupId:string):Promise<IGroup> =>{
    const groupRef = await doc(groupDb.groups,groupId);
    const group =await getDoc(groupRef);
    return group.data() as IGroup;
}

const createNewGroup = async(groupName:string,userId:string)=>{
    const groupRef = doc(groupDb.groups)
    await setDoc(groupRef,{
        id:groupRef.id,
        description:'',
        name:groupName,
        createdBy:userId,
        members:[],
        createdAt:serverTimestamp(),
        updatedAt:serverTimestamp(),

    })
}

const deleteGroup = async(groupId:string)=>{
    const groupRef = doc(groupDb.groups,groupId);
    await deleteDoc(groupRef)
}

export{getGroups,createNewGroup,deleteGroup}


