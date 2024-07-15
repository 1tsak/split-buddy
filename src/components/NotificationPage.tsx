import React, { useEffect, useState } from 'react';
import { fetchNotification } from '../services/notificationService';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.currentUser) {
          const res = await fetchNotification(auth.currentUser.uid) ;
          console.log(res);
          setNotifications(res);
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
      <div className='h-[80vh] overflow-y-scroll pt-4 pl-8 flex flex-col gap-4'>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className=''>
              <h3 className='font-bold'>{notification.title}</h3>
              <p>{notification.message}</p>
              <span className='text-gray-500 text-sm'>{notification.timestamp}</span>
            </div>
          ))
        ) : <p>No Notification found</p>}
      </div>
    </div>
  );
};

export default NotificationPage;

