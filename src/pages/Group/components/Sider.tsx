import { CiMoneyBill, CiHome, CiChat2 } from "react-icons/ci";
import useGroup from "../../../hooks/useGroup";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Expense } from "../../../utils/types";
import { Box, CircularProgress } from "@mui/material";
import { format, isToday, isYesterday } from "date-fns";
import Toast from "../../../components/Toast";
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
import { deleteGroup, leaveGroup } from "../../../services/groupService";
import { useTranslation } from 'react-i18next';

const Sider = () => {
  const { t } = useTranslation();
  const { groupData, expenses, loading } = useGroup();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [deletingOrLeaving, setDeletingOrLeaving] = useState(false);
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
    if (isToday(date)) return t('sider.today'); // Add translation key if needed
    if (isYesterday(date)) return t('sider.yesterday'); // Add translation key if needed
    return format(date, "MMMM dd, yyyy");
  };

  const groupedExpenses = sortedExpenses.reduce((acc: any, expense) => {
    const label = getExpenseLabel(expense.updatedAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(expense);
    return acc;
  }, {});

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    show: boolean;
  }>({
    type: 'info',
    message: '',
    show: false,
  });

  const triggerToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string
  ) => {
    if (message === "") {
      return;
    }
    setToast({
      type,
      message,
      show: true,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };
  const handleDelete = async () => {
    if (groupData && groupData.id) {
      setDeletingOrLeaving(true);
      await deleteGroup(groupData?.id);
      setDeletingOrLeaving(false);
    }
    setOpen(false);
    triggerToast("success","Group Deleted Successfully!");
    setTimeout(()=>{
      navigate("/group");
    },700);
  };

  const handleLeave = async () => {
    if (groupData && groupData.id && auth.currentUser) {
      setDeletingOrLeaving(true);
      await leaveGroup(groupData?.id, auth.currentUser?.uid);
      setDeletingOrLeaving(false);
    }
    setOpen(false);
    triggerToast("success",t('Group Left!'));
    setTimeout(()=>{
      navigate("/group");
    },700);
  };

  return (
    <div className="h-full w-1/4 bg-slate-100 pt-4 flex flex-col">
      <div className="flex justify-between px-2">
        <h1 className="text-center font-light pl-2 text-xl text-slate-700">
          {groupData?.name}
        </h1>
        <div>
          {groupData?.createdBy === auth.currentUser?.uid ? (
            <div>
              <button
                onClick={handleOpen}
                className="bg-slate-800 text-white rounded-sm text-sm py-1 px-2"
              >
                {t('sider.deleteGroup')}
              </button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('sider.deleteGroupDialogTitle')}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t('sider.deleteGroupDialogContent')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleDelete} color="primary" autoFocus>
                  {t('yes')}
                    {deletingOrLeaving && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "50%",
                          width: "100%",
                          color: "blue",
                          fontSize:"12px"
                        }}
                      >
                        <CircularProgress size={16} />
                      </Box>
                    )}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <div>
              <button
                onClick={handleOpen}
                className="bg-slate-800 text-white rounded-sm text-sm py-1 px-2"
              >
                {t('sider.leaveGroup')}
              </button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('sider.leaveGroupDialogTitle')}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t('sider.leaveGroupDialogContent')}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleLeave} color="primary" autoFocus>
                    {t('yes')}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-start px-4 py-2 font-light text-slate-500">
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
              <span>{t('sider.home')}</span>
            </div>
          </Link>
          <Link to={`/group/${groupData?.id}/chat`}>
            <div
              className={`w-full px-5 py-2 bg-slate-100 font-light cursor-pointer border-b text-gray-700 border-slate-200 flex items-center gap-2 ${
                isActiveLink(`/group/${groupData?.id}/chat`) ? "bg-white" : ""
              }`}
            >
              <CiChat2 />
              <span>{t('sider.chat')}</span>
            </div>
          </Link>
        </div>
        <h2 className="px-2 mt-4 text-lg text-center text-gray-500">{t('sider.bills')}</h2>
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
                {t('sider.noExpenses')}
              </p>
            )}
          </ul>
        )}
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Sider;
