// components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";

const LayoutWrapper: React.FC = () => {
  return (
    <div className=" h-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutWrapper;
