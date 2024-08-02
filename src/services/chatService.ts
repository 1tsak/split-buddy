// src/services/chatService.ts

import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
  } from "firebase/firestore";
  import { db, auth } from "../firebaseConfig";
  
  export const getChatMessages = (groupId: string, callback: any) => {
    const groupRef = doc(db, "groups", groupId);
    const chatCollectionRef = collection(groupRef, "chats");
    const q = query(chatCollectionRef, orderBy("timestamp", "asc"));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: any[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      callback(msgs);
    });
  
    return unsubscribe;
  };
  
  export const sendMessage = async (groupId: string , message: string) => {
    const user = auth.currentUser;
    if (!user) return;
  
    const groupRef = doc(db, "groups", groupId);
    const chatCollectionRef = collection(groupRef, "chats");
  
    await addDoc(chatCollectionRef, {
      userId: user.uid,
      username: user.displayName || "Anonymous",
      message: message,
      timestamp: new Date(),
    });
  };
  