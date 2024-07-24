import { useEffect, useState } from "react";
import { getGroupById, getGroups } from "../services/groupService";
import { getAuth } from "firebase/auth";
import { Group, User } from "../utils/types";
import { getUser } from "../services/authService";
import { addExpense } from "../services/expenseService";
import { useParams } from "react-router-dom";
import { notificationService } from "../services/notificationService";
import useGroup from "../hooks/useGroup";
import { BsToggle2On, BsToggle2Off } from "react-icons/bs";
import { Box, CircularProgress } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { Split, validateBill,countMember } from "../services/billCreateLogics";
import { useTranslation } from "react-i18next";

const auth = getAuth();

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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<User>();
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const { groupData } = useGroup();
  const [groupMember, setGroupMember] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [customBill, setCustomBill] = useState<number[]>([]);
  const [custom, setCustom] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [addBillLoading, setAddBillLoading] = useState(false);
  const { groupId } = useParams<{ groupId: string }>();
  const { fetchExpensesData } = useGroup();
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

    const groupFormData = groupData
      ? { name: formData.group.name, id: formData.group.id }
      : { name: "", id: "" };

    setFormData({
      title: "",
      amount: 0,
      category: "",
      group: groupFormData,
      splits: [],
    });
    setOpen(false);
    setCustomBill([]);
    setCustom(false);
  };
  
  const splitEqually = () => {
    const splitsMember = countMember(formData.splits);
    let remainingAmount = formData.amount;
    const splits: Split[] = groupMember.map((user, index) => {
      let amount = formData.splits[index]?.checked
        ? splitsMember > 0
          ? parseFloat((remainingAmount / (splitsMember || 1)).toFixed(2))
          : 0
        : 0;
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
  const getGroupMember = async (groupId: string) => {
    try {
      const res = await getGroupById(groupId);
      if (!res) {
        return;
      }
      const userPromises = res.members.map((_id) => getUser(_id));
      const users = await Promise.all(userPromises);

      const validUsers = users.filter((user): user is User => user !== null);
      const arr = Array(validUsers.length).fill(0);
      if (arr) {
        setCustomBill(arr);
      }
      setGroupMember(validUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching group members:", error);
      setLoading(false);
    }
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
      setLoading(true);
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
        getGroupMember(groupId);
      }, 800);
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    let splits = formData.splits.map((split, index) => {
      if (split.userId === name) {
        split.checked = checked;
        if (!split.checked) {
          split.amount = 0;
          customBill[index] = 0;
        }
      }
      return split;
    });
    setFormData({ ...formData, splits: splits });
    if (!custom) {
      splitEqually();
    }
  };

  const customBillChange = (e: any, index: number) => {
    const { value } = e.target;
    const customAmount = parseFloat(value);
    if (customAmount > formData.amount || customAmount < 0) {
      return;
    }
    let billArry = new Array();
    customBill.forEach((bill, ind) => {
      if (index == ind) {
        if (isNaN(value)) {
          billArry.push(0);
        } else {
          billArry.push(value);
        }
      } else {
        billArry.push(bill);
      }
    });
    setCustomBill(billArry);
  };

  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setAddBillLoading(true);
    if (!formData.group.id) {
      setErrorMessage(t("error.noGroup"));
      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
      setAddBillLoading(false);
      return;
    }

    const ActualSplit: any = formData.splits
      .map((split, index) => {
        const updatedSplit = {
          userId: split.userId,
          amount: !split.checked
            ? 0
            : !custom
            ? split.amount
            : Number(customBill[index]),
          paid:
            split.userId === auth.currentUser?.uid || !split.checked
              ? true
              : split.paid || false,
        };
        return updatedSplit as Split;
      })
      .filter(Boolean);

    if (!ActualSplit) {
      setAddBillLoading(false);
      return;
    }
    const validate = validateBill(ActualSplit, formData.amount);
    if (!validate.success) {
      setAddBillLoading(false);
      setErrorMessage(validate.message || "");
      setTimeout(() => {
        setErrorMessage("");
      }, 8000);
      return;
    }

    const expenseData: any = {
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      createdBy: auth.currentUser?.uid,
      groupId: formData.group.id,
      splits: [...ActualSplit],
    };

    try {
      await addExpense(expenseData);
      await notificationService({
        title: `${userInfo?.displayName} ${t('notification.createdBill')}`,
        message: `${expenseData.title} ${expenseData.category}`,
        groupId: expenseData.groupId,
      });
      setAddBillLoading(false);
      fetchExpensesData(formData.group.id);
      handleClose();
    } catch (error) {
      setAddBillLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!custom) {
      splitEqually();
    }
  }, [custom, formData.amount]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        if (!auth.currentUser) {
          return;
        }
        const data = await getUser(auth?.currentUser?.uid);

        if (!data) {
          return;
        }
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (!userInfo) {
      fetchUserDetail();
    }
    const fetchGroups = async () => {
      try {
        const groupList = await getGroups(auth?.currentUser?.uid);
        setUserGroups(groupList);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchGroups();
  }, [auth?.currentUser?.uid, groupId]);
  useEffect(() => {
    if (!groupData?.id || !groupId) {
      setFormData({
        ...formData,
        group: {
          name: "",
          id: "",
        },
      });
      return;
    }

    if (!userGroups) return;
    const groupName = userGroups.find((group) => group.id === groupData.id);
    
    if (groupName) {
      setFormData({
        ...formData,
        group: {
          name: groupName.name,
          id: groupName.id,
        },
      });
    }
    getGroupMember(groupId);
  }, [groupData, userGroups]);
  return (
    <div className="step5">
      <button
        onClick={handleClickOpen}
        className="bg-main px-4 py-2 text-sm font-semibold rounded-sm text-white flex items-center gap-2"
      >
        <FaPlus size={16} />
        {t('button.splitBill')}
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
              <h2 className="text-xl mb-3">{t('form.splitPayment')}</h2>
              <h4 className="text-lg mb-4 text-red-500">{errorMessage}</h4>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t('form.titlePlaceholder')}
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
                  placeholder={t('form.descriptionPlaceholder')}
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
                  placeholder={t('form.amountPlaceholder')}
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
                  <option value="">{t('form.selectGroup')}</option>
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
                  <div className="flex justify-between items-center">
                    <span className="block text-left mb-2 text-gray-700">
                      {t('form.addMembers')}:
                    </span>
                    <span
                      className="flex gap-1 items-center"
                      onClick={() => setCustom((prev) => !prev)}
                    >
                      {!custom ? t('form.equal') : t('form.custom')}
                      {custom ? (
                        <BsToggle2On className="text-2xl" />
                      ) : (
                        <BsToggle2Off className="text-2xl" />
                      )}
                    </span>
                  </div>
                  <div className="flex mt-6 flex-col items-center ">
                    <div className="mb-4">
                      {!loading ? (
                        groupMember &&
                        groupMember.map((user, index) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between mb-2"
                          >
                            <label className="mr-2">
                              <input
                                type="checkbox"
                                name={user.id}
                                checked={
                                  formData.splits[index]?.checked || false
                                }
                                onChange={handleCheckboxChange}
                                className="mr-2"
                              />
                              {user.displayName}
                            </label>
                            {
                              <input
                                type="tel"
                                name="customAmount"
                                value={
                                  !custom
                                    ? formData.splits[index]?.checked
                                      ? formData.splits[index]?.amount.toFixed(
                                          2
                                        ) || 0
                                      : 0
                                    : customBill[index]
                                }
                                onChange={(e) => customBillChange(e, index)}
                                placeholder={t('form.amountPlaceholder')}
                                disabled={
                                  !formData.splits[index]?.checked || !custom
                                }
                                className="w-1/3 px-3 py-2 border rounded ml-2"
                              />
                            }
                          </div>
                        ))
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      )}
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
                  {t('button.cancel')}
                </button>
                <button
                  type="submit"
                  className="text-white bg-main"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 16px",
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "16px",
                  }}
                >
                  {t('button.add')}
                  {addBillLoading && (
                    <span style={{ marginLeft: "8px" }}>
                      <CircularProgress size={16} style={{ color: "white" }} />
                    </span>
                  )}
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
