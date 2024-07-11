import { useEffect, useState } from "react";
import useGroup from "../hooks/useGroup";

const BillCreation = () => {
  const [open, setOpen] = useState(false);
  const {groupData} = useGroup();
  console.log("group",groupData);
  const [formData, setFormData] = useState({
    billname: "",
    amount: 0,
    option: "",
    preferences: {
      option1: false,
      option2: false,
      option3: false,
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name == "amount" && value < 0) {
      setFormData({ ...formData, [name]: 0 });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, [name]: checked },
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    handleClose();
  };

  useEffect(()=>{

  },[])
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
                  name="billname"
                  value={formData.billname}
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
                  name="option"
                  value={formData.option}
                  onChange={handleChange}
                  className="w-full px-3 py-2  text-gray-700 border rounded"
                >
                  <option value="">Select Group</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
              <div className="mb-4">
                <span className="block text-left mb-2 text-gray-700">
                  Add Members:
                </span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center">
                    <div className="flex justify-around w-full">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="option1"
                          checked={formData.preferences.option1}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label htmlFor="">option1</label>
                      </div>
                      <div className="ml-4">
                        
                        <input
                          type="text"

                          value={formData.amount}
                          className="ml-4 py-1"
                        />
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <div className="flex justify-around w-full ">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="option1"
                          checked={formData.preferences.option1}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label htmlFor="">option1</label>
                      </div>
                      <div className="ml-4">
                        
                        <input
                          type="text"
                          value={formData.amount}
                          onChange={handleChange}
                          className="ml-4 py-1"
                        />
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <div className="flex justify-around w-full">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="option1"
                          checked={formData.preferences.option1}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label htmlFor="">option1</label>
                      </div>
                      <div className="ml-4">
                        
                        <input
                          type="text"

                          value={formData.amount}
                          className="ml-4 py-1"
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
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
