import { useState } from "react";
import Dialog from "./NotificationDialog";
import { IoIosNotificationsOutline } from "react-icons/io";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <header className="App-header">
        <button onClick={openDialog} className="px-1 py-1 text-black rounded">
          <IoIosNotificationsOutline
            color="#121212"
            className="cursor-pointer"
            size={25}
          />
        </button>
        <Dialog
          isOpen={isOpen}
          title="Recent Activities"
          setIsOpen={setIsOpen}
        />
      </header>
    </>
  );
};

export default NotificationBell;
