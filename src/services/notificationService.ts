// Write your firebase services here!

import { db } from "../firebaseConfig"; // Adjust the import if necessary
import { collection, addDoc, query, where, getDoc,doc,getDocs, } from "firebase/firestore";
import { Notification } from "../utils/types";
type AddNotificationProp = {
  title: string;
  message: string;
  groupId: string;
};

const notificationService = async ({
  title,
  message,
  groupId,
}: AddNotificationProp): Promise<void> => {
  // console.log(title, message);
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      title,
      message,
      groupId,
      createdAt: new Date().toString(), // Corrected to call the method
    });
    console.log("Notification added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding notification: ", e);
  }
};


const fetchNotification = async (userId: string): Promise<Notification[] | undefined> => {
//   console.log(userId);
  try {
    // Reference to the document
    const userRef = doc(db, "users", userId);

    // Fetch the document
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.log("No such document!");
      return;
    }


    const userGroups = userSnap.data().groupsIn;
    if (!userGroups || userGroups.length === 0) {
      console.log("User is not part of any groups.");
      return;
    }

    
    const notificationRef = collection(db, "notifications");

    // Query for notifications
    const q = query(notificationRef, where("groupId", "in", userGroups));

    // Execute the query
    const querySnapshot = await getDocs(q);
  
    
    let notificationslist:Notification[] = querySnapshot.docs.map((doc) => {
        // console.log('Notification : ',doc.data());
        return doc.data() as Notification;
    });
    // console.log('List : ',notificationslist)
    
    // console.log(Array.isArray(notificationslist));
    return notificationslist;
    
    
    
  } catch (e) {
    console.log(`Error in fetching notification: `, e);
  }
};


export { notificationService, fetchNotification };

// To use notificationService you need to pass two info title and message in this format
//
