import React, { useEffect, useState } from "react";
import { getUser, getUserByEmail } from "../../../services/authService.ts";
import { addMember, removeMembers } from "../../../services/groupService.ts";
import { User } from "../../../utils/types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FaPlus } from "react-icons/fa6";
import useGroup from "../../../hooks/useGroup.ts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebaseConfig.ts";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Box, CircularProgress } from "@mui/material";
import { notificationService } from "../../../services/notificationService.ts";
import { useTranslation } from 'react-i18next';

const MembersList = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<User[] | null>();
  const { groupData, fetchGroupsData } = useGroup();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [addMemberLoading, setAddMemberLoading] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setError(null);
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
        setError(t('userNotFound'));
        setAddMemberLoading(false);
      } else {
        const userPresent = members?.find((member) => member.id === user.id);
        if (userPresent) {
          alert(t('userAlreadyPresent'));
          setAddMemberLoading(false);
          return;
        }
        await addMember(groupData?.id as string, email);

        await notificationService({
          title: t('newMemberAdded'),
          message: `${user.displayName} has been added to ${groupData?.name}`,
          groupId: `${groupData?.id}`,
        });
        setMembers((prevState: any) => [...prevState, user]);
        setAddMemberLoading(false);
        if (groupData) fetchGroupsData(groupData?.id);
        alert(t('userAdded'));
        handleClose();
      }
    } catch (error) {
      setAddMemberLoading(false);
      console.error("Error fetching user:", error);
      setError(t('errorFetchingUser'));
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
      setMembers((prevState: any) =>
        prevState.filter((member: User) => member.id !== memberId)
      );
      alert(t('userRemoved'));
      handleClose();
    } catch (error) {
      console.error("Error fetching user:", error);
      setError(t('errorFetchingUser'));
    }
  };

  useEffect(() => {
    getMembers();
  }, [groupData]);

  return (
    <div className="flex flex-col items-start gap-3 rounded-md w-[400px] h-fit bg-slate-100 p-5">
      <h2 className="py-2 text-slate-500">{t('members')}</h2>
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
            <li key={index} className="p-2 flex items-center  border border-slate-300 gap-2 rounded">
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
        <span>{t('addMember')}</span>
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
        <DialogTitle>{t('addMemberDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('addMemberDialogContent')}</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label={t('emailAddress')}
            type="email"
            style={{ width: "500px" }}
            variant="standard"
          />
        </DialogContent>
        {error && (
          <DialogContentText
            style={{
              color: "red",
              paddingLeft: "1.25rem",
              fontSize: "0.75rem",
            }}
          >
            {error}
          </DialogContentText>
        )}
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
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
            {t('add')}
            {addMemberLoading && (
              <span style={{ marginLeft: "8px" }}>
                <CircularProgress size={16} style={{ color: "blue" }} />
              </span>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MembersList;
