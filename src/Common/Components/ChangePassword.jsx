import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Api from "../../Api/InstanceApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ChangePassword = ({ Token }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!currentPassword || !newPassword || !confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "All fields are required!",
            });
            setLoading(false);
            return;
        }

        if (currentPassword === newPassword) {
            Swal.fire({
                icon: "error",
                title: "Invalid Password",
                text: "New password cannot be the same as the current password!",
            });
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Mismatch",
                text: "New password and confirm password do not match!",
            });
            setLoading(false);
            return;
        }

        try {
            const response = await Api.put(
                "/changeUserLoginPassword",
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: { Authorization: Token },
                }
            );

            if (response.status === 202) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Password changed successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/Admin");
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: err.response?.data?.message || "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="col-span-full lg:col-span-6 w-full lg:max-w-[600px] mx-auto"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className="border border-gray-300 dark:border-gray-700 p-5 md:p-10 rounded-2xl md:rounded-3xl bg-white dark:bg-gray-900"
            >
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-[28px] font-semibold text-gray-900 dark:text-white"
                >
                    Change Password
                </motion.h3>
                <p className="font-medium text-gray-500 dark:text-dark-text mt-4">
                    Update your password securely
                </p>
                <form onSubmit={handleChangePassword} className="mt-8 space-y-6">
                    <div>
                        <label className="form-label">Current Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-4 text-gray-500" />
                            <input
                                type={showPassword.current ? "text" : "password"}
                                placeholder="Current Password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="form-input px-10 py-3.5 rounded-lg w-full"
                            />
                            {showPassword.current ? (
                                <FaEyeSlash
                                    className="absolute right-3 top-4 text-gray-500 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            current: !prev.current,
                                        }))
                                    }
                                />
                            ) : (
                                <FaEye
                                    className="absolute right-3 top-4 text-gray-500 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            current: !prev.current,
                                        }))
                                    }
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="form-label">New Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-4 text-gray-500" />
                            <input
                                type={showPassword.new ? "text" : "password"}
                                placeholder="New Password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-input px-10 py-3.5 rounded-lg w-full"
                            />
                            {showPassword.new ? (
                                <FaEyeSlash
                                    className="absolute right-3 top-4 text-gray-500 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            new: !prev.new,
                                        }))
                                    }
                                />
                            ) : (
                                <FaEye
                                    className="absolute right-3 top-4 text-gray-500 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            new: !prev.new,
                                        }))
                                    }
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Confirm Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-4 text-gray-500" />
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                placeholder="Confirm Password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input px-10 py-3.5 rounded-lg w-full"
                            />
                            {showPassword.confirm ? (
                                <FaEyeSlash
                                    className="absolute right-3 top-4 text-gray-500 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            confirm: !prev.confirm,
                                        }))
                                    }
                                />
                            ) : (
                                <FaEye
                                    className="absolute right-3 top-4 text-gray-500 cursor-pointer"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            confirm: !prev.confirm,
                                        }))
                                    }
                                />
                            )}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#795ded] transition-all duration-300 py-1 rounded-lg text-lg font-semibold text-white shadow-md"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ChangePassword;