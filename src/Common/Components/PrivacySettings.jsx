import React, { useEffect, useState } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { FiLock, FiUser, FiFileText, FiClipboard, FiLogOut, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Api from "../../Api/InstanceApi"; // Ensure you have this API service imported

const PrivacySettings = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const privacyOptions = [
        { name: "Change Password", icon: <AiOutlineLock />, link: "/ChangePassword" },
        { name: "Change Privacy Password", icon: <FiLock />, link: "" },
        { name: "View Profile", icon: <FiUser />, link: "/Profile" },
        { name: "Reports", icon: <FiFileText />, link: "/Reports" },
        { name: "View All Invoices", icon: <FiClipboard />, link: "" },
        { name: "Logout", icon: <FiLogOut />, link: "" },
        { name: "Delete Account", icon: <FiTrash2 />, link: "" },
    ];

    useEffect(() => {
        const authData = localStorage.getItem("Authorization");

        if (!authData) {
            setLoading(false);
            return;
        }

        const Auth = JSON.parse(authData);
        if (!Auth?.token) {
            setLoading(false);
            return;
        }


        const fetchUser = async () => {
            try {
                const response = await Api.get("/getUser", {
                    headers: { Authorization: Auth.token },
                });
                setUser(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="block md:hidden min-h-screen">
            <div className="max-w-md mx-2 p-4 bg-white shadow-lg rounded-lg mt-2">
                {/* User Profile Section */}
                <div className="flex items-center space-x-4 p-4 bg-white border rounded-lg mb-4">
                    <img
                        src={user?.profileImg || "/Images/user/profile-img.png"}
                        alt={user?.name || "User"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    />
                    <div className="flex-1">
                        {loading ? (
                            <p className="text-sm text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : (
                            <>
                                <h2 className="text-lg font-semibold text-gray-800">{user?.name}</h2>
                                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Privacy Options List */}
                <div className="mt-4 bg-white mb-20">
                    {privacyOptions.map((item, index) => (
                        <Link key={index} to={item.link}>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200 px-2 hover:bg-gray-100 rounded-lg transition">
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl text-gray-700">{item.icon}</span>
                                    <span className="text-base text-gray-800">{item.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
