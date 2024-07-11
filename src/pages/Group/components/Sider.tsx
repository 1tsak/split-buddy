import { CiMoneyBill } from "react-icons/ci";
import { CiHome } from "react-icons/ci";
import useGroup from "../../../hooks/useGroup";
import { useEffect } from "react";
const Sider = () => {
  const {groupData} = useGroup();
  useEffect(()=>{console.log(groupData)},[groupData])
  return (
    <div className="h-full w-1/4 bg-slate-100 pt-4">
      <h1 className="text-center text-xl text-slate-700">{groupData?.name}</h1>
      <p className="text-sm text-center text-slate-500">{groupData?.description}</p>
      <div className="flex flex-col gap-3 mt-12">
        <div className="w-full px-5 py-2 bg-slate-50 font-light cursor-pointer border-b text-gray-700 border-slate-200 flex items-center gap-2">
            <CiHome/>
            <span>Home</span>
        </div>
        <h2 className="px-2 mt-4 text-lg text-center text-gray-500">Bills</h2>
        <ul className="p-2  text-gray-700  flex flex-col cursor-pointer font-light ">
          <li className="border-b slate-300 p-3 flex items-center gap-2">
            <CiMoneyBill size={18} />
            <span>Friday Party</span>
          </li>
          <li className="border-b slate-300 p-3 flex items-center gap-2">
            <CiMoneyBill size={18} />
            <span>Goa Trip</span>
          </li>
          <li className="border-b slate-300 p-3 flex items-center gap-2">
            <CiMoneyBill size={18} />
            <span> Monday Dinner</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sider;
