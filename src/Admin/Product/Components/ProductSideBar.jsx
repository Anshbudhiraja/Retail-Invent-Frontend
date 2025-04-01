import { useState } from "react";
import { FaHome, FaCartPlus, FaStore, FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ProductSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Sidebar Animation
  const sidebarVariants = {
    open: { width: "220px", transition: { duration: 0.4, ease: "easeInOut" } },
    closed: { width: "70px", transition: { duration: 0.4, ease: "easeInOut" } },
  };

  // Toggle Button Animation
  const toggleButtonVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <div>
      {/* Sidebar for Laptops & Tablets (Hidden on Mobile) */}
      <motion.div
        className="z-50 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col shadow-xl overflow-hidden hidden md:flex"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        {/* Toggle Button */}
        <motion.button
          className="absolute top-5 right-3 text-white text-2xl cursor-pointer transition-transform"
          onClick={() => setIsOpen(!isOpen)}
          animate={isOpen ? "open" : "closed"}
          variants={toggleButtonVariants}
        >
          <FaBars />
        </motion.button>

        {/* Sidebar Items */}
        <ul className="mt-20 space-y-6 px-3">
          {[
            { icon: <FaHome size={22} />, label: "Dashboard", link: "/Admin" },
            { icon: <FaCartPlus size={22} />, label: "Products", link: "/Products" },
            { icon: <FaStore size={22} />, label: "Vendors", link: "/Vendors" },
          ].map((item, index) => (
            <Link
              key={index}
              className="flex items-center space-x-4 cursor-pointer hover:bg-blue-500 p-3 rounded-lg transition-all duration-300"
              to={item.link} >
              <motion.li
                key={index}
                className="flex items-center space-x-4 cursor-pointer hover:bg-blue-500  rounded-lg"
                whileHover={{ scale: 1.1 }}
              >
                {item.icon}
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="text-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.li>
            </Link>
          ))}
        </ul>
      </motion.div>

      {/* Mobile Bottom Navbar (Hidden on Larger Screens) */}
      <div className="z-50 bg-gray-900 text-white fixed bottom-0 w-full h-16 flex items-center justify-around md:hidden">
        <Link to="/Admin">
          <FaHome size={24} className="cursor-pointer text-white hover:text-[#3d5ee1] transition" />
        </Link>
        <Link to="/Products">
          <FaCartPlus size={24} className="cursor-pointer text-white hover:text-[#3d5ee1] transition" />
        </Link>
        <Link to="/Vendors">
          <FaStore size={24} className="cursor-pointer text-white hover:text-[#3d5ee1] transition" />
        </Link>
      </div>
    </div>
  );
};

export default ProductSideBar;
