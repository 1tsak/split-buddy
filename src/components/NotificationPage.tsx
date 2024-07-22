import { useEffect, useState } from "react";
import { fetchNotification } from "../services/notificationService";
import { getAuth } from "firebase/auth";
import moment from "moment";
import { Notification } from "../utils/types";
const auth = getAuth();
import { CircularProgress, Box } from "@mui/material";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<
    Notification[] | undefined
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (auth.currentUser) {
          const notifications = await fetchNotification(auth.currentUser.uid);
          // console.log(res);
          const sortedNotifications =
            notifications &&
            notifications.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
          const data = sortedNotifications?.map(
            (notice) => notice as Notification
          );
          setNotifications(sortedNotifications);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="pt-3 pb-1 px-6 text-xl text-gray-600 border-b border-slate-200">
        <h2 className="font-bold">Notifications</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-3 mt-3">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "start",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        </div>
      ) : (
        <div className="h-[80vh] overflow-y-scroll pt-4 px-8 flex flex-col gap-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                <h3 className=" text-lg mb-2">{notification.title}</h3>
                <p className="text-gray-700 font-light mb-2">
                  {notification.message}
                </p>
                <span className="text-gray-500 text-sm">
                  {moment(notification.createdAt).fromNow()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No Notification found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
