import React from "react";
import { FaPlus } from "react-icons/fa6";
import NotificationBell from "./UseDialog";
import { Link } from "react-router-dom";

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
        <button className="bg-main px-4 py-2 text-sm font-semibold rounded-sm text-white flex items-center gap-2">
          <FaPlus size={16} />
          <span>Split a Bill</span>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
