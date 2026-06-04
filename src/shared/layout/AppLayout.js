import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = () => {
  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-grow-1">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <div className="p-3 p-md-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default AppLayout;