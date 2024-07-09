// components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";

const LayoutWrapper: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutWrapper;
