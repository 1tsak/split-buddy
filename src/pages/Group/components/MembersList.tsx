import React, { useEffect, useState } from "react";
import { getUser, getUserByEmail } from "../../../services/authService";
import { addMember, removeMembers } from "../../../services/groupService";
import { User } from "../../../utils/types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FaPlus } from "react-icons/fa6";
import useGroup from "../../../hooks/useGroup";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Box, CircularProgress } from "@mui/material";
import { notificationService } from "../../../services/notificationService";
import Toast from "../../../components/Toast";

const MembersList = () => {
  const [members, setMembers] = useState<User[] | null>([]);
  const { groupData, fetchGroupsData } = useGroup();
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [addMemberLoading, setAddMemberLoading] = useState<boolean>(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    triggerToast("info", "");
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddMemberLoading(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email as string;

    try {
      const user = await getUserByEmail(email);
      if (!user) {
        setOpen(false);
        triggerToast("error", "User not found");
        setAddMemberLoading(false);
      } else {
        const userPresent = members?.find((member) => member.id === user.id);
        if (userPresent) {
          setOpen(false);
          triggerToast("warning", "User already present");
          setAddMemberLoading(false);
          return;
        }
        await addMember(groupData?.id as string, email);
        await notificationService({
          title: "New Member Added",
          message: `${user.displayName} has been added to ${groupData?.name}`,
          groupId: `${groupData?.id}`,
        });
        triggerToast("success", "User added successfully!");
        setTimeout(() => {
          setMembers((prevState) => (prevState ? [...prevState, user] : [user]));
          if (groupData) fetchGroupsData(groupData?.id);
        }, 900);
        setAddMemberLoading(false);
        handleClose();
      }
    } catch (error) {
      setAddMemberLoading(false);
      console.error("Error fetching user:", error);
      triggerToast("error", "An error occurred while fetching the user");
    }
  };

  const getMembers = async () => {
    setLoading(true);
    const members: User[] = [];
    if (groupData?.members) {
      for (const userId of groupData.members) {
        try {
          const user = await getUser(userId);
          if (user !== null) {
            members.push(user);
          }
        } catch (error) {
          console.error(`Error fetching user with ID ${userId}:`, error);
        }
      }
    }
    setMembers(members);
    setLoading(false);
  };

  const deleteMember = async (memberId: string) => {
    try {
      await removeMembers(groupData?.id as string, memberId);
      setMembers((prevState) =>
        prevState ? prevState.filter((member) => member.id !== memberId) : []
      );
      triggerToast("success", "User removed successfully!");
    } catch (error) {
      console.error("Error removing user:", error);
      triggerToast("error", "An error occurred while removing the user");
    }
  };

  useEffect(() => {
    getMembers();
  }, [groupData]);

  return (
    <div className="flex flex-col items-start gap-3 rounded-md w-[400px] h-fit bg-slate-100 p-5">
      <h2 className="py-2 text-slate-500">Members</h2>
      <ul className="flex flex-wrap gap-2 font-light">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          members &&
          members.map((member: User, index) => (
            <li
              key={index}
              className="p-2 flex items-center  border border-slate-300 gap-2 rounded"
            >
              {member.displayName}
              {member.id !== user?.uid && (
                <RiDeleteBin6Line
                  onClick={() => deleteMember(member.id)}
                  className="cursor-pointer"
                  size={18}
                  color="#242424"
                />
              )}
            </li>
          ))
        )}
      </ul>
      <button
        onClick={handleClickOpen}
        className="bg-main px-4 py-2 text-sm font-semibold rounded-sm text-white flex items-center gap-2"
      >
        <FaPlus size={16} />
        <span>Add a Member</span>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            handleSubmit(event);
          },
        }}
      >
        <DialogTitle>Add a Member</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a member to this group</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            style={{ width: "500px" }}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            className="text-main"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          >
            Add
            {addMemberLoading && (
              <span style={{ marginLeft: "8px" }}>
                <CircularProgress size={16} style={{ color: "blue" }} />
              </span>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default MembersList;
