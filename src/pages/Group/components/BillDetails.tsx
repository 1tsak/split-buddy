import React, { useEffect, useState } from "react";
import BillSplit from "./BillSplit";
import useGroup from "../../../hooks/useGroup";
import { Link, useParams } from "react-router-dom";
import { Expense, Split } from "../../../utils/types";
import { getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import { addBillImage, uploadImage } from "../../../services/expenseService";

const BillDetails = () => {
  const { expenses } = useGroup();
  const { billId } = useParams<{ billId: string }>();
  const { groupData } = useGroup();
  const [expense, setExpense] = useState<Expense | undefined>(undefined);
  const auth = getAuth();

  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (expenseId:string) => {
    if (!file) return;

    setUploading(true);
    const fileUrl = await uploadImage(file);
    console.log(fileUrl);
    await addBillImage(fileUrl, expenseId);
    setUploading(false);
    setOpen(false);
    
  };

  useEffect(() => {
    if (expenses && billId) {
      const foundExpense = expenses.find(
        (expense: Expense) => expense.id === billId
      );
      setExpense(foundExpense);
    }
  }, [expenses, billId]);

  return (
    <div className="p-5 h-full w-full flex flex-col">
      <h1 className="text-center text-lg font-semibold text-gray-600">
        {groupData?.name}
      </h1>
      <div className="grid">
        {expense &&
          expense.splits &&
          expense.splits
            .filter((split: Split) => split.userId === auth.currentUser?.uid)
            .map((split: Split) => (
              <BillSplit
                key={split.userId}
                expenseData={expense}
                splitData={split}
              />
            ))}
      </div>
      <div className="btn">
        <div className="flex pt-4 gap-4">
          {!expense?.billUrl && expense?.createdBy === auth.currentUser?.uid && (
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-1 text-white rounded-md bg-main hover:bg-blue-900"
            >
              Attach a bill
            </button>
          )}
          {expense?.billUrl && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="px-5 py-1 text-white rounded-md bg-green-500 hover:bg-green-600"
            >
              Preview Bill
            </button>
          )}
        </div>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Upload File</DialogTitle>
          <DialogContent>
            <input type="file" onChange={handleFileChange} />
            {uploading && <CircularProgress />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            {expense && <Button onClick={() => handleUpload(expense?.id)} color="primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>}
          </DialogActions>
        </Dialog>

        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
          <DialogTitle>Bill Preview</DialogTitle>
          <DialogContent>
            {expense?.billUrl && (
              <img
                src={expense.billUrl}
                alt="Bill Preview"
                style={{ maxWidth: "100%" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default BillDetails;
