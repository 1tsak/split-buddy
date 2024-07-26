import { Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from "react";

import { Notification } from "../../types/types.ts";
import { fetchNotification } from "../../services/notificationService.ts";
import { getAuth } from "firebase/auth";
import moment from "moment";

const auth = getAuth();

type DialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, title, setIsOpen }) => {
  const user = auth.currentUser;

  const [notificationList, setNotificationList] = useState<Notification[] | undefined>([]);
  const [loading, setLoading]= useState<boolean>(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const fetchNotice = async () => {
    setLoading(true);
    try {
      if (!user) {
        return;
      }

      const notifications = await fetchNotification(user.uid);

      // Sort notifications by date before setting them
      const sortedNotifications = notifications &&  notifications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setNotificationList(sortedNotifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
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
        <div className="bg-white pt-5 pb-4 sm:pb-4">
          <div>
            <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg text-center leading-6 font-medium text-slate-500 uppercase">
                {title}
              </h3>
              {
                loading ? <div className='text-center py-3 mt-3'><Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '100vh' }}>
                <CircularProgress />
              </Box></div> : <div className="mt-2 w-full">
                {notificationList && notificationList.length > 0 ? (
                  notificationList.map((notice, index) => (
                    <div
                      className={`mt-6 px-2 pb-2 ${
                        index < notificationList.length - 1 ? "border-b-2" : ""
                      }`}
                      key={index}
                    >
                      <div className="flex justify-between gap-4 w-full">
                        <div className="text-md text-gray-600">
                          <span >{notice.title} </span> <span className="text-md font-semibold text-gray-700">{notice.message}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {moment(notice.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No notifications found</p>
                )}
              </div>
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;

