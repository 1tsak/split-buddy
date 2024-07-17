import { CiMoneyBill } from "react-icons/ci";
import { CiHome } from "react-icons/ci";
import useGroup from "../../../hooks/useGroup";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation from react-router-dom
import { Expense } from "../../../utils/types";
import { Box, CircularProgress } from "@mui/material";
import { format, isToday, isYesterday } from "date-fns";
import { CiChat2 } from "react-icons/ci";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { getAuth } from "firebase/auth";
import { deleteGroup } from "../../../services/groupService";

const Sider = () => {
  const { groupData, expenses, loading } = useGroup();
  const location = useLocation(); // Get current location using useLocation()
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(groupData);
  }, [groupData]);

  const sortedExpenses = expenses
    ? [...expenses].sort(
        (a: any, b: any) => b.updatedAt.seconds - a.updatedAt.seconds
      )
    : [];

  const getExpenseLabel = (timestamp: any) => {
    const date = new Date(timestamp.seconds * 1000);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM dd, yyyy");
  };

  const groupedExpenses = sortedExpenses.reduce((acc: any, expense) => {
    const label = getExpenseLabel(expense.updatedAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(expense);
    return acc;
  }, {});

  // Function to determine if a link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (groupData && groupData.id) await deleteGroup(groupData?.id);
    setOpen(false);
    alert("Group Deleted Succefully");
    navigate("/group");
  };

  return (
    <div className="h-full w-1/4 bg-slate-100 pt-4 flex flex-col">
      <div className="flex justify-between px-2">
        <h1 className="text-center  font-light pl-2 text-xl text-slate-700">
          {groupData?.name}
        </h1>
        <div>
          {groupData?.createdBy === auth.currentUser?.uid && (
            <div>
              <button
                onClick={handleOpen}
                className="bg-slate-800 text-white rounded-sm text-sm py-1 px-2"
              >
                Delete
              </button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Group!</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Do you really want to delete this group?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-center text-slate-500">
        {groupData?.description}
      </p>
      <div className="flex flex-col flex-1 overflow-hidden mt-12">
        <div>
          <Link to={`/group/${groupData?.id}`}>
            <div
              className={`w-full px-5 py-2 bg-slate-100 font-light cursor-pointer border-b text-gray-700 border-slate-200 flex items-center gap-2 ${
                isActiveLink(`/group/${groupData?.id}`) ? "bg-white" : ""
              }`}
            >
              <CiHome />
              <span>Home</span>
            </div>
          </Link>
          <Link to={`/group/${groupData?.id}/chat`}>
            <div
              className={`w-full px-5 py-2 bg-slate-100 font-light cursor-pointer border-b text-gray-700 border-slate-200 flex items-center gap-2 ${
                isActiveLink(`/group/${groupData?.id}/chat`) ? "bg-white" : ""
              }`}
            >
              <CiChat2 />
              <span>Chat</span>
            </div>
          </Link>
        </div>
        <h2 className="px-2 mt-4 text-lg text-center text-gray-500">Bills</h2>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <ul className="flex-1 overflow-y-auto p-2 text-gray-700 flex flex-col cursor-pointer font-light">
            {Object.keys(groupedExpenses).map((label) => (
              <div key={label}>
                <p className="font-light text-sm p-2 text-gray-400">{label}</p>
                {groupedExpenses[label].map((expense: Expense) => (
                  <Link to={`bill/${expense.id}`} key={expense.id}>
                    <li className="border-b slate-300 p-3 flex justify-between items-center gap-2">
                      <div className="flex gap-2 items-center">
                        <CiMoneyBill size={18} />
                        <span>{expense.title}</span>
                      </div>
                      <span>₹{expense.amount}</span>
                    </li>
                  </Link>
                ))}
              </div>
            ))}
            {sortedExpenses.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                No expenses to show!
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sider;
