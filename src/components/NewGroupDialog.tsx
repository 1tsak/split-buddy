import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { createNewGroup } from "../services/groupService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { useTranslation } from "react-i18next";

interface INewGroupModalProps {
  fetchData: () => void;
}

export default function NewGroupModal(props: INewGroupModalProps) {
  const { fetchData } = props;
  const [open, setOpen] = React.useState(false);
  const [user, loading] = useAuthState(auth);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button
        type="button"
        className="text-center flex items-center gap-2 bg-main text-white py-2 px-3 rounded-sm"
        onClick={handleClickOpen}
      >
        <MdOutlinePeopleAlt className="text-lg" />
        <span className="font-semibold">{t('addGroup')}</span>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{
          component: "form",
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const groupName = formJson.groupName;
            const groupDescription = formJson.groupDescription;
            await createNewGroup(groupName, groupDescription, user?.uid as string);
            await fetchData();
            handleClose();
          },
        }}
      >
        <DialogTitle>{t('createNewGroup')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="groupName"
            label={t('groupName')}
            type="text"
            fullWidth
          />
          <TextField
            required
            margin="dense"
            id="description"
            name="groupDescription"
            label={t('groupDescription')}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button type="submit">{t('create')}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
