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

const MembersList = () => {
  const [members, setMembers] = useState<User[] | null>();
  const { groupData } = useGroup();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [user, loading] = useAuthState(auth);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(()=>{
    setError(null);
  },[open])
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email as string;

    try {
      const user = await getUserByEmail(email);
      if (!user) {
        setError("User not found");
      } else {
        await addMember(groupData?.id as string, email);
        setMembers((prevState: any) => [...prevState, user]);
        alert("User added Successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("An error occurred while fetching the user");
    }
  };
  const getMembers = async () => {
    console.log(groupData);
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
    console.log(members);
  };
  const deleteMember = async (memberId: string) => {
    try {
      const response=await removeMembers(groupData?.id as string, memberId);
      console.log({response})
      setMembers((prevState: any) =>
        prevState.filter((member: User) => member.id !== memberId)
      );
      alert("User removed Successfully!");
      handleClose();
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("An error occurred while fetching the user");
    }
  };

  useEffect(() => {
    // For now, we use sample data
    getMembers();
  }, [groupData]);
  return (
    <div className="flex flex-col items-start gap-3 rounded-md w-[400px] h-fit bg-slate-100 p-5">
      <h2 className="py-2 text-slate-500">Members</h2>
      <ul className="flex flex-wrap gap-2 font-light">
        {members &&
          members.map((member: User) => (
            <li className="p-2 flex items-center  border border-slate-300 gap-2 rounded">
              {member.displayName}
              {member.id !== user?.uid && (
                <RiDeleteBin6Line
                  onClick={()=>deleteMember(member.id)}
                  className="cursor-pointer"
                  size={18}
                  color="#242424"
                />
              )}
            </li>
          ))}
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
        {error && (
          <DialogContentText style={{ color: "red", paddingLeft:"1.25rem",fontSize:"0.75rem" }}>
            {error}
          </DialogContentText>
        )}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MembersList;
