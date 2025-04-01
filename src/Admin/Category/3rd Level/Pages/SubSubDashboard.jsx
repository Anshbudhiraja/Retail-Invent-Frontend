import React, { useContext, useState } from "react";
import Sidebar from "../../../../Common/Components/Sidebar";
import Navbar from "../../../../Common/Components/Navbar";
import SubSubDashboardComponent from "../Components/SubSubDashboardComponent";
import AdminContext from "../../../AdminContext";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const SubSubDashboard = () => {
  const [isSidebarOpen,setIsSidebarOpen]=useState(false)
  const { token } = useContext(AdminContext);

  if (!token) return;

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
      >
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />


        {/* SubSubDashboard Component */}
        <SubSubDashboardComponent token={token} />
      </div>
    </div>
  );
};

export default SubSubDashboard;
