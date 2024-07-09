import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';

import Dialog from './NotificationDialog';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openDialog = ()=>{
        setIsOpen((prev) => !prev);
    }

  return (
    <>
      <header className="App-header">
        <button
          onClick={openDialog}
          className="px-1 py-1 text-black rounded"
        >
          <NotificationsIcon />
        </button>
        <Dialog isOpen={isOpen} title="Recent Activities" setIsOpen={setIsOpen}/>
          
      </header>
    </>
  );
};

export default NotificationBell;
