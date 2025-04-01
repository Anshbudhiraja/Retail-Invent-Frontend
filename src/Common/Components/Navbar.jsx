import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Api from "../../Api/InstanceApi"
const Navbar = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("Authorization"))
    if (data || data?.token) {
      fetchUser(data.token);
    }
  }, []);
  const fetchUser = async (token) => {
    try {
      const response = await Api.get("/getUser", {
        headers: { Authorization: token },
      });
      setUser(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user data.");
    }
  };

  return (
    <div className="bg-white md:rounded-2xl md:mt-4 md:ml-6 mb-2 md:mr-6 border px-6 py-4 flex justify-between items-center relative">
      {/* Logo - Always at the Left Corner */}
      <div className="flex md:hidden justify-start w-auto">
        <img className="h-10" src="./Images/logo/logo-black.png" alt="Logo" />
      </div>
      {/* Left Side - Toggle Button (Hidden on Mobile) */}
      <button
        className="hidden cursor-pointer md:block text-[#999999] text-2xl px-3 py-2 cursor-pointer transition-all duration-300 border border-transparent rounded-full hover:border-[#999999]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        <i className={isOpen ? "ri-menu-fold-line" : "ri-menu-unfold-line"}></i>
      </button>

      {/* Right Side - Profile & Actions */}
      <div className="relative flex items-center ml-auto">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center cursor-pointer gap-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img src="/Images/user/profile-img.png" alt="Profile" />
          </div>
          <span className="font-semibold text-lg capitalize hidden sm:block">
            {user?.name || "User"}
          </span>
          <FaChevronDown className="hidden sm:block text-lg" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute cursor-pointer border border-gray-100 right-0 top-full mt-2 z-10 bg-white text-left rounded-lg shadow-lg w-48 divide-y divide-gray-100">
            {/* Profile Info */}
            <div className="px-4 py-3 text-sm text-gray-500">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="truncate">{user?.email || "email@example.com"}</div>
            </div>

            {/* Menu Items */}
            <ul className="py-2 text-sm text-gray-700">
              <li>
                <a href="/dashboard" className="block px-4 py-2 font-medium hover:bg-gray-200">
                  View Profile
                </a>
              </li>
              <li>
                <a href="/settings" className="block px-4 py-2 font-medium hover:bg-gray-200">
                  Settings
                </a>
              </li>
            </ul>

            {/* Sign Out */}
            <div className="py-2">
              <button
                onClick={Logout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex items-center gap-2"
              >
                <FaSignOutAlt />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>


  );
};

export default Navbar;