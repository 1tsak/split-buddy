import BillCreation from "../Bill/BillCreation";
import { FaPlus } from "react-icons/fa6";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "react-router-dom";
import NotificationBell from "./UseDialog";

const NavBar = () => {
  return (
    <div className="w-full  bg-white px-6 py-4 border border-b-slate-200 flex justify-between items-center">
      <div className="w-32">
   
        <Link to={'/dashboard'}>
        <span className="font-semibold text-main">
          <img src="logo_main.png" alt="site logo" />
        </span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <NotificationBell />
        
          <BillCreation/>
          <LanguageSwitcher/>
      </div>
    </div>
  );
};

export default NavBar;
