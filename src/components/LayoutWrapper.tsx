// components/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";

const LayoutWrapper: React.FC = () => {
  const location = useLocation();
  const hideSidebar = location.pathname.startsWith("/group/");

  return (
    <div className="h-full flex flex-col">
      <Navbar />

      {!hideSidebar ? (
        <main className="flex flex-auto ">
          <Sidebar />
          <div className="flex-1">
            <Outlet />
          </div>    
        </main>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default LayoutWrapper;
