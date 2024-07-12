import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const BillDetails = () => {
  return (
    <div className="p-5 h-full w-full flex flex-col">
      <h1 className="text-center text-lg font-semibold text-gray-600">
        Friday Party
      </h1>
      <div className="grid">
        <div className="bg-white rounded-md p-5 border border-slate-200 flex flex-col w-[400px]">
          <div className="flex flex-row justify-between items-center">
            <p>Splitting bill of Rs 80</p>
            <IoIosArrowForward size={20}/>
          </div>
          <div className="py-1">
            <span className="text-4xl">26.6</span>
            <span className="text-sm">Rs</span>
          </div>
          <button className="bg-main px-4 py-2 my-2 text-sm font-semibold rounded-md w-fit text-white flex items-center gap-2">
          {/* <FaPlus size={16} /> */}
          <span>Settle Bill</span>
          <MdKeyboardDoubleArrowRight/>
        </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
