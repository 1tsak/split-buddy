// components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const LayoutWrapper: React.FC = () => {
  return (
    <div className=" h-full flex flex-col">
      <Navbar />
      
      <main className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Outlet/>
      </div>
      </main>
    </div>
  );
};

export default LayoutWrapper;
