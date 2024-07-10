import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.ts';
import { collection, getDocs } from 'firebase/firestore';

type Notification = {
  createdAt: string;
  title: string;
  message: string;
};

type DialogProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const Dialog: React.FC<DialogProps> = ({ isOpen, title, setIsOpen }) => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const fetchNotice = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Notifications'));
      const dataList = querySnapshot.docs.map((doc) => {
      
        return doc.data() as Notification;
      });
    
      setNotificationList(dataList);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error state here if needed
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotice();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed h-[80vh] my-auto inset-0 flex items-start justify-end z-50 overflow-y-scroll" onClick={handleClose}>
      <div className="bg-white rounded-lg mr-12 overflow-hidden shadow-md transform transition-all w-[400px]" onClick={handleContentClick}>
        <div className="bg-white pt-5 pb-4  sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 underline">
                {title}
              </h3>
              <div className="mt-2">
                {notificationList.length > 0 &&
                  notificationList.map((notice, index) => (
                    <div className={index < notificationList.length-1 ?"border-b-2":""} key={index}>
                     
                      <div>
                        <p className='text-gray-400'>{notice.title}</p>
                        <p></p>
                      </div>
                      {/* {notice.createdAt.toString()} */}
                      <p className=''>{notice.message}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
