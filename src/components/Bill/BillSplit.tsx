import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Expense, Split } from "../../types/types";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import { AiOutlineUser } from "react-icons/ai";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { markBillPaid } from "../../services/expenseService";
import { notificationService } from "../../services/notificationService";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface BillSplitProp {
  expenseData: Expense;
  splitData: Split;
}

const BillSplit = ({ expenseData: initialExpense, splitData }: BillSplitProp) => {
  const [user, loading] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<
    { userId: string; name: string; amount: number; paid: boolean }[]
  >([]);
  const [expenseData, setExpenseData] = useState<Expense>(initialExpense);
  const currentUserPaid = expenseData.splits.some(
    (split) => split.userId === user?.uid && split.paid
  );
  const { t } = useTranslation(); // Add translation hook

  useEffect(() => {
    setExpenseData(initialExpense);
  }, [initialExpense]);

  const handleClickOpen = async () => {
    const membersData = await Promise.all(
      expenseData.splits.map(async (split) => {
        const userDoc = await getDoc(doc(db, "users", split.userId));
        const userData = userDoc.data();
        return {
          userId: split.userId,
          name: userData?.displayName || t('billSplit.unknownUser'),
          amount: split.amount,
          paid: split.paid,
        };
      })
    );
    setMembers(membersData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const markPaid = async (userId: string) => {
    const updatedSplits = expenseData.splits.map((split: Split) => {
      if (split.userId === userId) {
        return { ...split, paid: true };
      }
      return split;
    });

    setExpenseData((prevExpense) => ({ ...prevExpense, splits: updatedSplits }));
    await markBillPaid(expenseData.id, updatedSplits);
    await notificationService({
      title: `${user?.displayName} ${t('billSplit.settledBillTitle')}`,
      message: `${expenseData.title} ${expenseData.category}`,
      groupId: expenseData.groupId,
    });
    handleClose();
  };

  return (
    <div className="bg-white rounded-md p-5 border border-slate-200 flex flex-col w-[400px]">
      <div className="flex flex-row justify-between items-center">
        <p>{t('billSplit.splittingBill', { amount: expenseData.amount })}</p>
        <IoIosArrowForward
          onClick={handleClickOpen}
          className="cursor-pointer"
          size={20}
        />
      </div>
      <div className="py-1">
        <span className="text-4xl">{splitData?.amount}</span>
        <span className="text-sm">Rs</span>
      </div>
      <p className="text-sm text-gray-500 py-1 font-light">
        {t('billSplit.yourShare', { title: expenseData.title })}
      </p>
      {expenseData.splits.some((split) => split.userId === user?.uid) &&
      !currentUserPaid ? (
        <button
          className="bg-main px-4 py-2 my-2 text-sm font-semibold rounded-md w-fit text-white flex items-center gap-2"
          onClick={() => markPaid(auth.currentUser?.uid!)}
        >
          <span>{t('billSplit.settleBill')}</span>
          <MdKeyboardDoubleArrowRight />
        </button>
      ) : (
        <p className="py-2 text-gray-400">{t('billSplit.alreadyPaid')}</p>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (e:any) => {
            e.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Grid container justifyContent="space-between" alignItems="start">
              <Grid item>
                <Typography variant="h6">{expenseData.title}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" color="textSecondary">
                  {t('billSplit.category', { category: expenseData.category })}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1" color="textSecondary">
              {t('billSplit.amount', { amount: expenseData.amount })}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent style={{ width: "500px" }}>
          <List>
            {members.map((member) => (
              <ListItem key={member.userId}>
                <ListItemAvatar>
                  <Avatar>
                    <AiOutlineUser />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={`${t('billSplit.amountLabel', { amount: member.amount })} - ${
                    member.paid ? t('billSplit.paid') : t('billSplit.unpaid')
                  }`}
                />
                {expenseData.createdBy === user?.uid && !member.paid && (
                  <Button
                    onClick={() => markPaid(member.userId)}
                    className="bg-red"
                  >
                    {t('billSplit.markPaid')}
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('billSplit.close')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillSplit;
