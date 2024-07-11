
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

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    amount: 0,
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
    setOpen(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "amount" && parseFloat(value) < 0) {
      setFormData({ ...formData, [name]: 0 });
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
          try {
            const res = await getGroupById(groupId);
            if (!res) {
              return;
            }

            const userPromises = res.members.map((_id) => {
              const user = getUser(_id);
              return user;
            });

            const users = await Promise.all(userPromises);
            const validUsers = users.filter(
              (user): user is User => user !== null
            );

            setGroupMember(validUsers);

            const splits: Split[] = validUsers.map((user) => {
              return {
                userId: user.id,
                amount: parseFloat(formData.amount.toString()) / validUsers.length,
                paid: false,
                checked: true,
              } as Split;
            });

            setFormData((prevFormData) => ({
              ...prevFormData,
              splits: splits,
            }));
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
    const { name } = e.target;

    let splits = formData.splits.map((split) => {
      if (split.userId === name) {
        split.checked = !split.checked;
        if (!split.checked) {
          split.amount = 0;
        }
      }
      return split;
    });

    const splitBillCount = splits.filter((split) => split.checked).length;

    splits = splits.map((split) => {
      if (split.checked) {
        split.amount = formData.amount / splitBillCount;
      }
      return split;
    });

    setFormData({ ...formData, splits: splits });
  };

  const customBillChange = (e: any, index: number) => {
    const { value } = e.target;
    const customAmount = parseFloat(value);

    if (isNaN(customAmount) || customAmount < 0) {
      return;
    }

    let splits = [...formData.splits];
    splits[index].amount = customAmount;

    const totalCustomAmount = splits.reduce((acc, split, idx) => {
      if (idx !== index) {
        return acc + split.amount;
      }
      return acc;
    }, 0);

    const remainingAmount = formData.amount - customAmount;
    const remainingSplits = splits.filter(split => split.checked);

    splits = splits.map((split, idx) => {
      if (idx !== index && split.checked) {
        split.amount = remainingAmount / (remainingSplits.length-1);
      }
      return split;
    });

    setFormData({ ...formData, splits: splits });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(() => {
    const fetchGroups = async (): Promise<void | undefined> => {
      try {
        const groupList = await getGroups(userInfo?.uid);
        setUserGroups(groupList);
      } catch (error) {
        console.error("Error fetching groups:", error);
        return;
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
              <h2 className="text-xl mb-4">Split the Payment</h2>

              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's this payment for?"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
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
                  <option disabled value="">
                    Select Group
                  </option>
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
                  <div className="flex flex-col gap-2">
                    <div>
                      {groupMember.length > 0 &&
                        groupMember.map((gm, index) => (
                          <label key={gm.id} className="flex items-center">
                            <div className="flex justify-between w-full">
                              <div className="flex justify-start items-center">
                                <input
                                  type="checkbox"
                                  name={gm.id}
                                  onChange={handleCheckboxChange}
                                  checked={formData.splits[index]?.checked || false}
                                  className="mr-2"
                                />
                                <label htmlFor="">{gm.displayName}</label>
                              </div>
                              <div className="ml-4">
                                <input
                                  type="number"
                                  value={formData.splits[index]?.amount.toFixed(2) || 0}
                                  onChange={(e) => customBillChange(e, index)}
                                  className="ml-4 py-1"
                                  disabled={!formData.splits[index]?.checked || false}
                                />
                              </div>
                            </div>
                          </label>
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

