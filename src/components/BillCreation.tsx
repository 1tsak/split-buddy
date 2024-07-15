import { useEffect, useState } from "react";
import { getGroupById, getGroups } from "../services/groupService";
import { getAuth } from "firebase/auth";
import { Group, User } from "../utils/types";
import { getUser } from "../services/authService";
const auth = getAuth();
type Split = {
  userId: string;
  amount: number;
  paid: boolean;
  checked: boolean;
};
type FormDataType = {
  title: string;
  amount: number;
  category: string;
  group: {
    name: string;
    id: string;
  };
  splits: Split[];
};
const BillCreation = () => {
  const [open, setOpen] = useState(false);
  const userInfo = auth.currentUser;
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [groupMember, setGroupMember] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [customBill, setCustomBill] = useState<{ [key: number]: number }>({});
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    amount: 0,
    category: "",
    group: {
      name: "",
      id: "",
    },
    splits: [],
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setErrorMessage("");
    setFormData({
      title: "",
      amount: 0,
      category: "",
      group: {
        name: "",
        id: "",
      },
      splits: [],
    });
    setOpen(false);
    setCustomBill({});
  };
  const countMember = ()=>{
    let count = 0;
    for(let i = 0;i < formData.splits.length ; i++){
      if(formData.splits[i].checked && !customBill[i]) count++;
    }
    return count;
  }
  const splitEqually = () => {
    // console.log('kitni barr');
    // console.log('kitne haoi',splitsMember);
    const splitsMember = countMember();
    console.log(customBill);
    let remainingAmount = formData.amount;
    formData.splits.forEach((split,index) =>{
      if(split.checked && customBill[index]){
        remainingAmount -= customBill[index];
      }
    })
    const splits: Split[] = groupMember.map((user, index) => {
      let amount = formData.splits[index]?.checked
        ? ( splitsMember > 0 ?  remainingAmount / splitsMember : 0)
        : 0;// console.log(amount);
        if(customBill[index]){
          amount = customBill[index];
        }
      return {
        userId: user.id,
        amount: amount,
        paid: false,
        checked: formData.splits[index]?.checked || false,
      } as Split;
    });
    setFormData((prevFormData) => ({
      ...prevFormData,
      splits: splits,
    }));
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "amount" && parseFloat(value) <= 0) {
      setFormData({ ...formData, [name]: 0 });
      return;
    }
    if (name === "amount" && parseFloat(value) > 1000000) {
      setFormData({ ...formData, [name]: formData.amount });
      return;
    }
    if (name === "group") {
      const index = e.target.selectedIndex;
      const el: any = e.target.childNodes[index];
      const groupId = el.getAttribute("id");
      setFormData({
        ...formData,
        group: {
          name: value,
          id: groupId,
        },
      });
      setTimeout(() => {
        const getGroupMember = async () => {
          // console.log('fxdcgvhbjdslkjhv');
          try {
            const res = await getGroupById(groupId);
            if (!res) {
              return;
            }
            const userPromises = res.members.map((_id) => getUser(_id));
            const users = await Promise.all(userPromises);
            const validUsers = users.filter(
              (user): user is User => user !== null
            );
            setGroupMember(validUsers);
          } catch (error) {
            console.error("Error fetching group members:", error);
          }
        };
        getGroupMember();
      }, 800);
      return;
    }
    setFormData({ ...formData, [name]: value });
  };
  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    let splits = formData.splits.map((split) => {
      if (split.userId === name) {
        split.checked = checked;
        if (!split.checked) {
          split.amount = 0;
        }
      }
      return split;
    });
    setFormData({ ...formData, splits: splits });
    splitEqually();
  };
  const customBillChange = (e: any, index: number) => {
    const { value } = e.target;
    const customAmount = parseFloat(value);
    if (customAmount > formData.amount || isNaN(customAmount) || customAmount < 0) {
      return;
    }
    let splits = [...formData.splits];
    splits[index].amount = customAmount;
    setCustomBill((prev) => ({ ...prev, [index]: customAmount }));
    let remainingAmount = formData.amount;
    let countCustom = 0;
    splits.forEach((split, idx) => {
      if (split.checked && customBill[idx] !== undefined) {
        remainingAmount -= customBill[idx];
        countCustom++;
      }
    });
    const remainingSplits = splits.filter((split, idx) => split.checked && customBill[idx] === undefined);
    remainingSplits.forEach((split) => {
      split.amount = remainingAmount / (remainingSplits.length || 1);
    });
    setFormData((prev) => ({ ...prev, splits }));
    splitEqually();
  };
  const validateBill = (splits: Split[], amount: number) => {
    const totalCustomAmount = splits.reduce((acc, split) => {
      if (split.checked) {
        return acc + split.amount;
      }
      return acc;
    }, 0);
    if (Math.ceil(totalCustomAmount) === Number(amount)) {
      return { success: true };
    } else {
      const msg =
        Math.ceil(totalCustomAmount) === 0
          ? "At least one member is required in the expense."
          : "Total expenses are less than the amount.";
      return { success: false, message: msg };
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.group.id) {
      setErrorMessage("No Group Found");
      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      return;
    }
    const validate = validateBill(formData.splits, formData.amount);
    if (!validate.success) {
      setErrorMessage(validate.message || "");
      setTimeout(() => {
        setErrorMessage("");
      }, 8000);
      return;
    }
    const ActualSplit = formData.splits.map((split) => {
      if (!split.checked) {
        return;
      }
      if (split.userId === auth.currentUser?.uid) {
        split.paid = true;
      }
      return {
        userId: split.userId,
        amount: split.amount,
        paid: split.paid,
      };
    });
    const FormDataSubmission = {
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      createdBy: auth.currentUser?.uid,
      groupId: formData.group.id,
      splits: [...ActualSplit],
    };
    console.log(FormDataSubmission);
  };
  useEffect(() => {
    if (formData.group.id && formData.amount > 0) {
      splitEqually();
    }
  }, [formData.group.id, formData.amount]);
  useEffect(() => {
    const fetchGroups = async () => {
      // console.log('gcvhbjk');
      try {
        const groupList = await getGroups(userInfo?.uid);
        setUserGroups(groupList);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [userInfo?.uid]);
  return (
    <div>
      <button
        className="bg-transparent text-white rounded"
        onClick={handleClickOpen}
      >
        Split a Bill
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <button
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-500"
              onClick={handleClose}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="text-gray-900">
              <h2 className="text-xl mb-3">Split the Payment</h2>
              <h4 className="text-lg mb-4 text-red-500">{errorMessage}</h4>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's this payment for? (Title)"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  name="group"
                  value={formData.group.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded"
                >
                  <option value="">Select Group</option>
                  {userGroups.length > 0 &&
                    userGroups.map((group: Group, index) => (
                      <option key={index} id={group.id} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                </select>
              </div>
              {formData.group.name && (
                <div className="mb-4">
                  <span className="block text-left mb-2 text-gray-700">
                    Add Members:
                  </span>
                  <div className="flex flex-col items-center ">
                  <div className="mb-4">
                {groupMember.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between mb-2">
                    <label className="mr-2">
                      <input type="checkbox" name={user.id} checked={formData.splits[index]?.checked || false} onChange={handleCheckboxChange} />
                      {user.displayName}
                    </label>
                    {(
                      <input
                        type="tel"
                        name="customAmount"
                        value={formData.splits[index]?.checked ? formData.splits[index]?.amount.toFixed(2) || 0 : 0}
                        onChange={(e) => customBillChange(e, index)}
                        placeholder="Amount"
                        disabled={!formData.splits[index]?.checked}
                        className="w-1/3 px-3 py-2 border rounded ml-2"
                      />
                    )}
                  </div>
                ))}
              </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default BillCreation;