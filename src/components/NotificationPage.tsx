import React, { useEffect, useState } from 'react';
import { fetchNotification } from '../services/notificationService';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import { Notification } from '../utils/types';
const auth = getAuth();


const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[] | undefined>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const res = await fetchNotification(auth.currentUser.uid);
          // console.log(res);
          const data = res?.map((notice) => notice as Notification) 
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='w-full'>
      <div className='py-6 px-6 text-2xl text-black border-b-2'>
        <h2 className='font-bold'>Notifications</h2>
      </div>
      <div className='h-[80vh] overflow-y-scroll pt-4 px-8 flex flex-col gap-4'>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification,index) => (
            <div key={index} className='bg-white shadow-md rounded-lg p-4'>
              <h3 className='font-bold text-lg mb-2'>{notification.title}</h3>
              <p className='text-gray-700 mb-2'>{notification.message}</p>
              <span className='text-gray-500 text-sm'>
                {moment(notification.createdAt).fromNow()}
              </span>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No Notification found</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

