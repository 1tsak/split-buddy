
import { useState } from 'react';
import Dialog from './NotificationDialog';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AppD = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen((prev) => !prev);
 

  return (
    <>
      <header className="App-header">
        <button
          onClick={openDialog}
          className="px-1 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <NotificationsIcon/>
        </button>
        <Dialog isOpen={isOpen} title="Recent Activities" setIsOpen={setIsOpen}>
          ghvbj
        </Dialog>
      </header>
    </>
  );
};
export default AppD