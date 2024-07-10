import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig.ts";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Notification } from "../utils/types.ts";
import moment from "moment";
const auth = getAuth();

type DialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, title, setIsOpen }) => {
  const user = auth.currentUser;

  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  async function fetchGroupById(groupId: string) {
    try {
      const docRef = doc(db, "groups", groupId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data(); // Return the document data
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching group:", error);
      return null;
    }
  }

  const fetchNotice = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "notifications"));
      const dataList: Notification[] = [];

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const groupId = doc.data().groupId;
          const groupDetail = await fetchGroupById(groupId);

          if (groupDetail && user) {
            const res = groupDetail.members.some((id: string) => id === user.uid);
            if (res) {
              dataList.push(doc.data() as Notification);
            }
          }
        })
      );

      setNotificationList(dataList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotice();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed h-[80vh] my-auto inset-0 flex items-start justify-end z-50 overflow-y-scroll"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg mr-12 overflow-hidden shadow-md transform transition-all w-[400px]"
        onClick={handleContentClick}
      >
        <div className="bg-white pt-5 pb-4  sm:pb-4">
          <div className="">
            <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg text-center leading-6 font-medium text-slate-500 uppercase">
                {title}
              </h3>
              <div className="mt-2 w-full">
                {isLoading && <p>Loading...</p>}
                {!isLoading &&
                  notificationList.length > 0 &&
                  notificationList.map((notice, index) => (
                    <div
                      className={`mt-6 px-2 pb-2 ${
                        index < notificationList.length - 1 ? "border-b-2" : ""
                      }`}
                      key={index}
                    >
                      <div className="flex justify-between w-full">
                        <p className="text-md text-gray-600">{notice.title}</p>
                        <p className="text-sm text-gray-400">
                          {moment(notice.createdAt).fromNow()}
                        </p>
                      </div>
                      <p className="text-md text-gray-700">{notice.message}</p>
                    </div>
                  ))}
                {!isLoading && notificationList.length === 0 && (
                  <p className="text-center">No notifications found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
