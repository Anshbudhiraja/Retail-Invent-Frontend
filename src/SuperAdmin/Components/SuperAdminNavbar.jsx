import { FaUserCircle } from "react-icons/fa";

const SuperAdminNavbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Left Side - Dashboard Title */}
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Right Side - Profile Section */}
      <div className="flex items-center space-x-3">
        <p className="text-gray-700 font-medium">Hello, Admin</p>
        <FaUserCircle className="text-gray-700 text-3xl" />
      </div>
    </div>
  );
}

export default SuperAdminNavbar