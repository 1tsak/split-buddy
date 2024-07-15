import { useEffect, useState } from "react";
import { getGroupById, getGroups } from "../services/groupService";
import { getAuth } from "firebase/auth";
import { Expense, Group, User } from "../utils/types";
import { getUser } from "../services/authService";
import { addExpense } from "../services/expenseService";

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
  };
  const countMember = () => {
    let count = 0;
    for (let i = 0; i < formData.splits.length; i++) {
      if (formData.splits[i].checked) count++;
    for(let i = 0;i < formData.splits.length ; i++){
      if(formData.splits[i].checked) count++;
    }
    return count;
  };
  const splitEqually = () => {
    // console.log('kitni barr');
    // console.log('kitne haoi',splitsMember);
    const splitsMember:any = countMember();

    const splits: Split[] = groupMember.map((user, index) => {
      const amount = formData.splits[index]?.checked
        ? ( splitsMember > 0 ?  formData.amount / splitsMember : 0)
        : 0;
        console.log(amount);
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

    if (
      customAmount > formData.amount ||
      isNaN(customAmount) ||
      customAmount < 0
    ) {
      return;
    }

    let splits = [...formData.splits];
    splits[index].amount = customAmount;

    const remainingAmount = formData.amount - customAmount;
    const remainingSplits = splits.filter((split) => split.checked);

    splits = splits.map((split, idx) => {
      if (idx !== index && split.checked) {
        split.amount = remainingAmount / (remainingSplits.length - 1);
      }
      return split;
    });

    setFormData({ ...formData, splits: splits });
  };

  const validateBill = (splits: Split[], amount: number) => {
    const totalCustomAmount = splits.reduce((acc, split) => {
      if (split.checked) {
        return acc + split.amount;
      }
      return acc;
    }, 0);

    if (Math.ceil(totalCustomAmount) === amount) {
      return { success: true };
    } else {
      const msg =
        Math.ceil(totalCustomAmount) === 0
          ? "At least one member is required in the expense."
          : "Total expenses are less than the amount.";
      return { success: false, message: msg };
    }
  };

  const handleSubmit = async (e: any) => {
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

    const ActualSplit: any = formData.splits.map((split) => {
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

    const expenseData: any = {
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      createdBy: auth.currentUser?.uid!,
      groupId: formData.group.id,
      splits: [...ActualSplit],
    };
    console.log(expenseData);
    try {
      await addExpense(expenseData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (formData.group.id && formData.amount > 0) {
      splitEqually();
    }
  }, [formData.group.id, formData.amount]);

  useEffect(() => {
    const fetchGroups = async () => {
      console.log('gcvhbjk');
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
                  <div className="flex flex-col items-center gap-2">
                    <div>
                      {groupMember.length > 0 &&
                        groupMember.map((gm, index) => (
                          <label key={gm.id} className="flex items-center">
                            <div className="flex justify-between w-full">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name={gm.id}
                                  onChange={handleCheckboxChange}
                                  checked={
                                    formData.splits[index]?.checked || false
                                  }
                                  className="mr-2 h-5 w-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor={gm.id}>{gm.displayName}</label>
                              </div>

                              <div className="ml-4 w-[50%] flex justify-end ">
                                <input
                                  type="tel"
                                  value={
                                    formData.splits[index]?.amount.toFixed(2) ||
                                    0
                                  }
                                  onChange={(e) => customBillChange(e, index)}
                                  className="ml-4 text-center py-1 outline-none bg-transparent"
                                  disabled={
                                    !formData.splits[index]?.checked || false
                                  }
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

// import { useEffect, useState } from "react";
// import { getGroupById, getGroups } from "../services/groupService";
// import { getAuth } from "firebase/auth";
// import { Group, User } from "../utils/types";
// import { getUser } from "../services/authService";
// import { Expense } from "../utils/types";
// const auth = getAuth();

// type Split = {
//   userId: string;
//   amount: number;
//   paid: boolean;
//   checked: boolean;
// };

// type FormDataType = {
//   title: string;
//   amount: number;
//   category: string;
//   group: {
//     name: string;
//     id: string;
//   };
//   splits: Split[];
//   splitsMember: number;
// };

// const BillCreation = () => {
//   const [open, setOpen] = useState(false);
//   const userInfo = auth.currentUser;
//   const [userGroups, setUserGroups] = useState<Group[]>([]);
//   const [groupMember, setGroupMember] = useState<User[]>([]);
//   const [errorMessage, setErrorMessgae] = useState<String>("");
//   const [formData, setFormData] = useState<FormDataType>({
//     title: "",
//     amount: 0,
//     category: "",
//     group: {
//       name: "",
//       id: "",
//     },
//     splits: [],
//     splitsMember:groupMember.length
//   });

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setErrorMessgae("");
//     setFormData({
//       title: "",
//       amount: 0,
//       category: "",
//       group: {
//         name: "",
//         id: "",
//       },
//       splits: [],
//       splitsMember: 0
//     })
//     setOpen(false);
//   };

//   const splitEqually = () => {

//     const splits: Split[] = groupMember.map((user,index) => {
//       const amount = formData.splits[index].checked ? formData.amount/(formData.splitsMember) : 0;
//       return {
//         userId: user.id,
//         // amount: parseFloat(formData.amount.toString()) / groupMember.length,
//         amount : amount,
//         paid: false,
//         checked: formData.splits[index].checked || false
//       } as Split;
//     });

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       splits: splits,
//     }));
//   };
//   const handleChange = (e: any) => {
//     const { name, value } = e.target;

//     if (name === "amount" && parseFloat(value) <= 0) {
//       setFormData({ ...formData, [name]: 0 });
//       return;
//     }

//     if (name === "group") {
//       const index = e.target.selectedIndex;
//       const el: any = e.target.childNodes[index];
//       const groupId = el.getAttribute("id");

//       setFormData({
//         ...formData,
//         group: {
//           name: value,
//           id: groupId,
//         },
//       });

//       setTimeout(() => {
//         const getGroupMember = async () => {
//           try {
//             const res = await getGroupById(groupId);
//             if (!res) {
//               return;
//             }

//             const userPromises = res.members.map((_id) => {
//               const user = getUser(_id);
//               return user;
//             });

//             const users = await Promise.all(userPromises);
//             const validUsers = users.filter(
//               (user): user is User => user !== null
//             );

//             setGroupMember(validUsers);
//           } catch (error) {
//             console.error("Error fetching group members:", error);
//           }
//         };

//         getGroupMember();
//       }, 800);
//       return;
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCheckboxChange = (e: any) => {
//     const { name,checked } = e.target;
//     // let billMember = 0;
//     let splits = formData.splits.map((split) => {
//       if (split.userId === name) {
//         split.checked = checked
//         if (!split.checked) {
//           split.amount = 0;
//           setFormData({ ...formData, splitsMember: formData.splitsMember-1});
//         }else{
//           setFormData({ ...formData, splitsMember: formData.splitsMember+1});
//         }
//       }
//       return split;
//     });
//     // console.log(billMember);
//     // const splitBillCount = splits.filter((split) => split.checked).length;

//     // splits = splits.map((split) => {
//     //   if (split.checked) {
//     //     split.amount = formData.amount / splitBillCount;
//     //   }
//     //   return split;
//     // });

//   };

//   const customBillChange = (e: any, index: number) => {
//     const { value } = e.target;
//     const customAmount = parseFloat(value);
//     if (customAmount > formData.amount) {
//       return;
//     }
//     if (isNaN(customAmount) || customAmount < 0) {
//       return;
//     }

//     let splits = [...formData.splits];
//     splits[index].amount = customAmount;

//     const totalCustomAmount = splits.reduce((acc, split, idx) => {
//       if (idx !== index) {
//         return acc + split.amount;
//       }
//       return acc;
//     }, 0);

//     const remainingAmount = formData.amount - customAmount;
//     const remainingSplits = splits.filter((split) => split.checked);

//     splits = splits.map((split, idx) => {
//       if (idx !== index && split.checked) {
//         split.amount = remainingAmount / (remainingSplits.length - 1);
//       }
//       return split;
//     });

//     setFormData({ ...formData, splits: splits });
//   };

//   const validateBill = (splits: Split[], amount: Number) => {
//     const totalCustomAmount = splits.reduce((acc, split) => {
//       if (split.checked) {
//         return acc + split.amount;
//       }
//       return acc;
//     }, 0);
//     if (Math.ceil(totalCustomAmount) == amount) {
//       return {
//         success: true,
//       };
//     } else {
//       let msg;
//       if (Math.ceil(totalCustomAmount) == 0) {
//         msg = "Atleast One Member required in the expense";
//       } else {
//         msg = "Total expenses is less than amount.";
//       }
//       return {
//         success: false,
//         message: msg,
//       };
//     }
//   };
//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     if (!formData.group.id) {
//       setErrorMessgae("No Group Found");
//       setTimeout(() => {
//         setErrorMessgae("");
//       }, 6000);
//       return;
//     }
//     const validate = validateBill(formData.splits, formData.amount);
//     // console.log(validate);
//     if (!validate.success && validate.message != undefined) {
//       setErrorMessgae(validate.message);
//       setTimeout(() => {
//         setErrorMessgae("");
//       }, 8000);
//       return;
//     }
//     const ActualSplit = formData.splits.map((split) => {
//       if (!split.checked) {
//         return;
//       }
//       if (split.userId === auth.currentUser?.uid) {
//         split.paid = true;
//       }
//       return {
//         userId: split.userId,
//         amount: split.amount,
//         paid: split.paid,
//       };
//     });
//     const FormDataSubmission = {
//       title: formData.title,
//       category: formData.category,
//       amount: Number(formData.amount),
//       createdBy: auth.currentUser?.uid,
//       groupId: formData.group.id,
//       splits: [...ActualSplit],
//     };
//     console.log(FormDataSubmission);
//   };

//   useEffect(()=>{
//     if(formData.group.id && formData.amount>0){
//       splitEqually();
//     }
//   },[formData.group.id,formData.amount,formData.splitsMember])

//   useEffect(() => {
//     const fetchGroups = async (): Promise<void | undefined> => {
//       try {
//         const groupList = await getGroups(userInfo?.uid);
//         setUserGroups(groupList);
//       } catch (error) {
//         console.error("Error fetching groups:", error);
//         return;
//       }
//     };

//     fetchGroups();
//   }, [userInfo?.uid]);

//   return (
//     <div>
//       <button
//         className="bg-transparent text-white rounded"
//         onClick={handleClickOpen}
//       >
//         Split a Bill
//       </button>
//       {open && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//             <button
//               className="absolute top-0 right-0 mt-4 mr-4 text-gray-500"
//               onClick={handleClose}
//             >
//               &times;
//             </button>
//             <form onSubmit={handleSubmit} className="text-gray-900">
//               <h2 className="text-xl mb-3">Split the Payment</h2>
//               <h4 className="text-lg mb-4 text-red-500">{errorMessage}</h4>

//               <div className="mb-4">
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   placeholder="What's this payment for? (Title)"
//                   className="w-full px-3 py-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <input
//                   type="text"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   placeholder="Description "
//                   className="w-full px-3 py-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <input
//                   type="tel"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   placeholder="Amount"
//                   className="w-full px-3 py-2 border rounded"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <select
//                   name="group"
//                   value={formData.group.name}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 text-gray-700 border rounded"
//                 >
//                   <option value="">Select Group</option>
//                   {userGroups.length > 0 &&
//                     userGroups.map((group: Group, index) => (
//                       <option key={index} id={group.id} value={group.name}>
//                         {group.name}
//                       </option>
//                     ))}
//                 </select>
//               </div>
//               {formData.group.name && (
//                 <div className="mb-4">
//                   <span className="block text-left mb-2 text-gray-700">
//                     Add Members:
//                   </span>
//                   <div className="flex flex-col items-center gap-2">
//                     <div>
//                       {groupMember.length > 0 &&
//                         groupMember.map((gm, index) => (
//                           <label key={gm.id} className="flex items-center">
//                             <div className="flex justify-between w-full">
//                               <div className="flex items-center">
//                                 <input
//                                   type="checkbox"
//                                   name={gm.id}
//                                   onChange={handleCheckboxChange}
//                                   checked={
//                                     formData.splits[index]?.checked || false
//                                   }
//                                   className="mr-2 h-5 w-5 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
//                                 />
//                                 <label htmlFor={gm.id}>{gm.displayName}</label>
//                               </div>

//                               <div className="ml-4 w-[50%] flex justify-end ">
//                                 <input
//                                   type="tel"
//                                   value={
//                                     formData.splits[index]?.amount.toFixed(2) ||
//                                     0
//                                   }
//                                   onChange={(e) => customBillChange(e, index)}
//                                   className="ml-4 text-center py-1 outline-none"
//                                   disabled={
//                                     !formData.splits[index]?.checked || false
//                                   }
//                                 />
//                               </div>
//                             </div>
//                           </label>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   className="px-4 py-2 bg-gray-500 text-white rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   Create
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BillCreation;
