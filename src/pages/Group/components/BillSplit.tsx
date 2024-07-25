import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { Expense, Split } from "../../../utils/types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  markBillPaid,
  updateExpenseAmounts,
} from "../../../services/expenseService";
import { notificationService } from "../../../services/notificationService";
import { useTranslation } from "react-i18next";

interface BillSplitProp {
  expenseData: Expense;
  splitData: Split;
}
const validateBill = (splits: any, amount: number) => {
  if (!splits) {
    return { success: false, message: `Error While Generating Bill` };
  }
  const totalCustomAmount = splits.reduce((acc:any, split:any) => {
    return acc + split.amount;
  }, 0);
  if (Math.ceil(totalCustomAmount) === Number(amount)) {
    return { success: true };
  } else {
    const msg =
      Math.ceil(totalCustomAmount) === 0
        ? "At least one member is required in the expense."
        : totalCustomAmount < amount
        ? "Total expenses are less than amount."
        : "Total expenses are greater than amount.";

    return { success: false, message: msg };
  }
};
const BillSplit = ({
  expenseData: initialExpense,
  splitData,
}: BillSplitProp) => {
  const [user, loading] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<
    { userId: string; name: string; amount: number; paid: boolean }[]
  >([]);
  const [expenseData, setExpenseData] = useState<Expense>(initialExpense);
  const [editingAmounts, setEditingAmounts] = useState<{
    [userId: string]: string;
  }>({});
  const currentUserPaid = expenseData.splits.some(
    (split) => split.userId === user?.uid && split.paid
  );
  const [error, setError] = useState("");
  const handleAddError = (err: string) => {
    if (err.trim() === "") {
      return;
    }
    setError(err);
    setTimeout(() => {
      setError("");
    }, 4000);
  };
  const { t } = useTranslation();

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
          name: userData?.displayName || t("billSplit.unknownUser"),
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

    setExpenseData((prevExpense) => ({
      ...prevExpense,
      splits: updatedSplits,
    }));
    await markBillPaid(expenseData.id, updatedSplits);
    await notificationService({
      title: `${user?.displayName} ${t("billSplit.settledBillTitle")}`,
      message: `${expenseData.title} ${expenseData.category}`,
      groupId: expenseData.groupId,
    });
    handleClose();
  };

  const handleAmountChange = (userId: string, newAmount: string) => {
    if (parseInt(newAmount) > expenseData.amount) {
      handleAddError("Cannot be greater than total Amount");
      return;
    }
    setEditingAmounts((prev) => ({ ...prev, [userId]: newAmount }));
  };

  const handleSaveAmounts = async () => {
    const updatedSplits = expenseData.splits.map((split: Split) => {
      const newAmount = editingAmounts[split.userId];
      if (newAmount) {
        return { ...split, amount: parseFloat(newAmount) };
      }
      return split;
    });

    const validation = validateBill(updatedSplits, Number(expenseData.amount));
    if (!validation.success) {
      // console.error(validation.message);
      if(validation.message) handleAddError(validation?.message);
      setEditingAmounts({});
      return;
    }
    setExpenseData((prevExpense) => ({
      ...prevExpense,
      splits: updatedSplits,
    }));
    // Here you should also call a service to persist the updated amounts if needed.
    await updateExpenseAmounts(expenseData.id, updatedSplits);
    setEditingAmounts({});
    handleClose();
  };

  return (
    <div className="bg-white rounded-md p-5 border border-slate-200 flex flex-col w-[400px]">
      <div className="flex flex-row justify-between items-center">
        <p>{t("billSplit.splittingBill", { amount: expenseData.amount })}</p>
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
        {t("billSplit.yourShare", { title: expenseData.title })}
      </p>
      {expenseData.splits.some((split) => split.userId === user?.uid) &&
      !currentUserPaid ? (
        <button
          className="bg-main px-4 py-2 my-2 text-sm font-semibold rounded-md w-fit text-white flex items-center gap-2"
          onClick={() => markPaid(auth.currentUser?.uid!)}
        >
          <span>{t("billSplit.settleBill")}</span>
          <MdKeyboardDoubleArrowRight />
        </button>
      ) : (
        <p className="py-2 text-gray-400">{t("billSplit.alreadyPaid")}</p>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (e: any) => {
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
                  {t("billSplit.category", { category: expenseData.category })}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1" color="textSecondary">
              {t("billSplit.amount", { amount: expenseData.amount })}
            </Typography>
          </div>
          <div>
            {" "}
            {error && (
              <p className="flex justify-center text-red-800">{error}</p>
            )}
          </div>
        </DialogTitle>
        <DialogContent style={{ width: "600px" }}>
          <List>
            {members.map((member) => (
              <ListItem key={member.userId}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={6} container alignItems="center">
                    <ListItemAvatar>
                      <Avatar>
                        <AiOutlineUser />
                      </Avatar>
                    </ListItemAvatar>
                    <div style={{ marginLeft: 10, minWidth: 100 }}>
                      <Typography component="div">{member.name}</Typography>
                      <Typography component="div">
                        {member.paid
                          ? t("billSplit.paid")
                          : t("billSplit.unpaid")}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    container
                    flexDirection="row"
                    justifyContent="flex-end"
                  >
                    <Grid item>
                      <TextField
                        label={t("Amount")}
                        value={editingAmounts[member.userId] || member.amount}
                        onChange={(e) =>
                          handleAmountChange(member.userId, e.target.value)
                        }
                        margin="dense"
                        fullWidth
                        disabled={
                          member.paid || member.userId === expenseData.createdBy
                        }
                      />
                    </Grid>
                    {expenseData.createdBy === user?.uid && !member.paid && (
                      <Grid item>
                        <Button
                          onClick={() => markPaid(member.userId)}
                          className="bg-red"
                        >
                          {t("billSplit.markPaid")}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("billSplit.close")}</Button>
          {auth?.currentUser?.uid === expenseData.createdBy && (
            <Button onClick={handleSaveAmounts}>{t("Save")}</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillSplit;
