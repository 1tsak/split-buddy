// write your firebase services here!
import { Query, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Group as IGroup } from "../utils/types";

const groupDb = {
    groups:collection(db,'groups')
}

const getGroups = async (userId?:string):Promise<IGroup[]> =>{
    const grpquery = query(groupDb.groups,where("members",'array-contains',userId),where('createdBy',"==",userId))
    const groupSnapShot = await getDocs(grpquery);
    const groups:IGroup[] = new Array<IGroup>;
    groupSnapShot.forEach((group)=>groups.push(group.data() as IGroup));
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
        members:[userId],
        createdAt:serverTimestamp(),
        updatedAt:serverTimestamp(),

    })
}

const deleteGroup = async(groupId:string)=>{
    const groupRef = doc(groupDb.groups,groupId);
    await deleteDoc(groupRef)
}

export{getGroups,getGroup,createNewGroup,deleteGroup}


