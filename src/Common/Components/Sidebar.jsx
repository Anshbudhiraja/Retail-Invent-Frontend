import { useState } from "react";
import { FaHome, FaCartPlus, FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const sidebarVariants = {
    open: { width: "220px", transition: { duration: 0.4, ease: "easeInOut" } },
    closed: { width: "70px", transition: { duration: 0.4, ease: "easeInOut" } },
  };

  const Logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.history.replaceState(null, null, "/");
        Swal.fire("Logged Out!", "You have been successfully logged out.", "success").then(() => {
          navigate('/', { replace: true });
        });
      }
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="z-39 bg-white rounded-2xl m-4 text-white h-screen fixed top-0 left-0 flex flex-col shadow-xl overflow-hidden hidden md:flex"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-start p-4 h-24">
          {
            isOpen ?
              (
                <motion.img
                  src={"./Images/logo/logo-sidebar.png"}
                  alt="Logo"
                  className={"h-20"}
                  initial={false}
                  animate={{
                    width: "auto",
                    transition: { duration: 0.3 }
                  }}
                />
              )
              : (
                <motion.img
                  src={"./Images/logo/logo-icon.png"}
                  alt="Logo"
                  className={"h-10 mx-auto"}
                  initial={false}
                  animate={{
                    width: "40px",
                    transition: { duration: 0.3 }
                  }}
                />
              )
          }


        </div>

        <ul className="mt-1 space-y-6 px-3 flex-grow">
          {[
            { icon: <i className="ri-bar-chart-line" />, label: "Dashboard", link: "/Admin" },
            { icon: <i className="ri-archive-line" />, label: "Products", link: "/AddCategoryProduct" },
            { icon: <i className="ri-bill-line" />, label: "Invoices", link: "/Admin" },
            { icon: <i className="ri-calculator-line" />, label: "Calculator", link: "/Admin" },
            { icon: <i className="ri-settings-line" />, label: "Settings", link: "/Settings" },
          ].map((item, index) =>
            isOpen ? (
              <Link
                key={index}
                to={item.link}
                className="flex items-center space-x-4 rounded-bl-lg rounded-tr-none rounded-br-none p-1 transition-all duration-300 hover:bg-[#8065ee] 
                     hover:rounded-tl-lg hover:rounded-bl-lg hover:rounded-tr-none hover:rounded-br-none group"
              >
                <motion.span
                  className="flex items-center space-x-4 transition-all duration-300"
                >
                  <span className="text-[#251f47] transition-colors duration-300 group-hover:text-white">
                    {item.icon}
                  </span>
                  <span className="text-[#251f47] transition-colors duration-300 group-hover:text-white">
                    {item.label}
                  </span>
                </motion.span>
              </Link>
            ) : (
              <Link
                key={index}
                to={item.link}
                className="flex items-center space-x-4 bg-gray-200 p-3 px-3.5 rounded-lg transition-all duration-300 hover:bg-[#8065ee] group"
              >
                <motion.span className="flex items-center space-x-4 transition-all duration-300">
                  <span className="text-[#251f47] transition-colors duration-300 group-hover:text-white">
                    {item.icon}
                  </span>
                </motion.span>
              </Link>
            )
          )}
        </ul>

        {/* Fixed Logout Section */}
        <div className="absolute bottom-10 left-0 w-full px-5">
          <button
            onClick={Logout}
            className="flex cursor-pointer items-center space-x-4 p-3 rounded-lg bg-gray-500 text-white transition-all duration-300 hover:bg-[#795ded]"
          >
            <i className="ri-logout-box-line"></i>
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Mobile Bottom Navbar (Hidden on Larger Screens) */}
      <div className="z-50 bg-gray-100 text-gray-700 fixed bottom-0 w-full h-24 border-t border-gray-300 shadow-[0px_-4px_10px_rgba(0,0,0,0.1)] flex items-center justify-around md:hidden px-2">
        {[
          { to: "/Admin", icon: "ri-bar-chart-line", label: "Dashboard" },
          { to: "/Admin", icon: "ri-archive-line", label: "Products" },
          { to: "/Admin", icon: "ri-bill-line", label: "Invoice" },
          { to: "/Admin", icon: "ri-calculator-line", label: "Calc" },
          { to: "/Settings", icon: "ri-settings-line", label: "Settings" }
        ].map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex flex-col items-center text-gray-700 hover:text-[#8065ee] transition"
          >
            <div className="bg-gray-200 p-3 px-4 rounded-lg transition-all duration-300 hover:bg-[#8065ee] hover:text-white flex items-center justify-center">
              <i className={`${item.icon} text-xl`} />
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Sidebar;