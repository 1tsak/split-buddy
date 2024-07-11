import { FaPlus } from "react-icons/fa6";
import NotificationBell from "./UseDialog";
import BillCreation from "./BillCreation";
const NavBar = () => {
  return (
    <div className="w-full  bg-white px-6 py-4 border border-b-slate-200 flex justify-between items-center">
      <div className="w-32">
        <span className="font-semibold text-main">LOGO</span>
      </div>
      <div className="flex items-center gap-6">
        <NotificationBell />
        <button className="bg-main px-4 py-2 text-sm font-semibold rounded-sm text-white flex items-center gap-2">
          <FaPlus size={16} />
          <BillCreation/>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
