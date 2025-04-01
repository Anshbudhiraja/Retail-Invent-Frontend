import React, { useState } from "react";
import PrivacySettings from "./PrivacySettings";
import { FiLogOut } from "react-icons/fi";
import ChangePassword from "./ChangePassword";
import ProfileComp from "./ProfileComp";

const SettingsComp = ({ Token }) => {
  const [activeComponent, setActiveComponent] = useState("default");

  const renderContent = () => {
    switch (activeComponent) {
      case "changePassword":
        return <ChangePassword Token={Token} />;
      case "viewProfile":
        return <ProfileComp Token={Token} />;
      default:
        return (
          <div className="w-3/4 pl-2">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            <div className="bg-gray-50 p-4 rounded-lg mt-4 border">
              <h4 className="text-lg font-semibold">Account</h4>
              <p className="text-gray-600">
                User ID: <span className="font-medium">049d3329</span>
              </p>
              <p className="text-gray-600">
                Name: <span className="font-medium">Ansh Budhiraja</span>
              </p>
              <p className="text-gray-600">
                Email: <span className="font-medium">a******72@gmail.com</span>
              </p>
              <button className="mt-3 cursor-pointer text-red-500 flex items-center gap-1">
                <i className="ri-delete-bin-line text-[12px]"></i> Close my account
              </button>
            </div>

            {/* Additional Accounts */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
              <h4 className="text-lg font-semibold">Additional accounts</h4>
              <p className="text-gray-600 text-sm">
                Creating a new account allows you to use Upwork in different ways, while still having just one login.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-2 md:p-6  min-h-screen">
      {/* Desktop View */}
      <div className="mx-auto min-h-screen bg-white shadow-md border rounded-lg p-6 hidden sm:block">
        <h2 className="text-2xl font-semibold">Settings</h2>

        <div className="flex mt-4">
          {/* Sidebar */}
          <div className="w-1/4 border-r pr-4">
            <h3 className="font-semibold text-lg mb-3">Password</h3>
            <ul>
              <li
                onClick={() => setActiveComponent("changePassword")}
                className={`text-gray-600 mb-2 cursor-pointer hover:text-blue-500 ${activeComponent === "changePassword" ? "font-semibold text-blue-600" : ""
                  }`}
              >
                Change Password
              </li>
              <li className="text-gray-600 mb-2 cursor-pointer hover:text-blue-500">
                Change Privacy Password
              </li>
            </ul>

            <h3 className="font-semibold text-lg mb-3">Contact Info</h3>
            <ul>
              <li
                onClick={() => setActiveComponent("viewProfile")}
                className={`text-gray-600 mb-2 cursor-pointer hover:text-blue-500 ${activeComponent === "viewProfile" ? "font-semibold text-blue-600" : ""
                  }`}
              >
                My Profile
              </li>
              <li className="text-gray-600 mb-2 cursor-pointer hover:text-blue-500">Reports</li>
              <li className="text-gray-600 mb-2 cursor-pointer hover:text-blue-500">View All Invoices</li>
            </ul>

            <h3 className="font-semibold text-lg text-red-600 mb-2 cursor-pointer hover:text-red-500">
              Delete Account
            </h3>

            <div className="flex gap-6 items-center cursor-pointer hover:text-red-500">
              <FiLogOut />
              <h3 className="font-semibold text-lg">Logout</h3>
            </div>
          </div>

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <PrivacySettings />
      </div>
    </div>
  );
};

export default SettingsComp;
