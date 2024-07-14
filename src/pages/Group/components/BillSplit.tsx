import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Expense, Split } from "../../../utils/types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, TextField } from "@mui/material";

interface BillSplitProp {
  expenseData: Expense;
  splitData: Split;
}

const BillSplit = ({ expenseData, splitData }: BillSplitProp) => {
  //   const [user, loading] = useAuthState(auth);
  //   const [userSplit, setUserSplit] = useState<Split>();
  //   useEffect(() => {
  //     console.log(splitData)
  //     if (splitData)
  //       setUserSplit(
  //         splitData.find((split: Split) => split.userId === user?.uid)
  //       );
  //   }, []);
  const handleSubmit = (e: any) => {};

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="bg-white rounded-md p-5 border border-slate-200 flex flex-col w-[400px]">
      <div className="flex flex-row justify-between items-center">
        <p>Splitting bill of Rs {expenseData.amount}</p>
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
        Your share for {expenseData.title}
      </p>
      <button className="bg-main px-4 py-2 my-2 text-sm font-semibold rounded-md w-fit text-white flex items-center gap-2">
        {/* <FaPlus size={16} /> */}
        <span>Settle Bill</span>
        <MdKeyboardDoubleArrowRight />
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
        <DialogTitle>{expenseData.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h1>{expenseData.category}</h1>
            <ul>
              {expenseData.splits.map((split:Split)=>(<li>{split.userId}</li>))}
            </ul>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillSplit;
