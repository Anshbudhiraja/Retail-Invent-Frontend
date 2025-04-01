import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Api from '../../Api/InstanceApi';
import { useNavigate } from 'react-router-dom';

const ForgotNewPass = ({ Token,cancel }) => {
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await Api.put("/createForgetUserPassword",
                { password: newPassword, confirmPassword },
                { headers: { "Authorization": Token } }
            ); 

            navigate(`${response.data.data.navigate}`);
            
            setMessage(data.message);
        } catch (error) {
            console.log(error)
            setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
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
            className="col-span-full lg:col-span-6 w-full lg:max-w-[600px]"
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
                    Create a New Password
                </motion.h3>
                <p className="font-medium text-gray-500 dark:text-dark-text mt-4">
                    Enter a new password to reset your account
                </p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label className="form-label">New Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-4 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="form-input px-10 py-3.5 rounded-lg w-full"
                            />
                            {showPassword ? (
                                <FaEyeSlash className="absolute right-3 top-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(false)} />
                            ) : (
                                <FaEye className="absolute right-3 top-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Confirm Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-4 text-gray-500" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input px-10 py-3.5 rounded-lg w-full"
                            />
                            {showConfirmPassword ? (
                                <FaEyeSlash className="absolute right-3 top-4 text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                            ) : (
                                <FaEye className="absolute right-3 top-4 text-gray-500 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
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
                        {loading ? "Updating..." : "Confirm Password"}
                    </motion.button>
                </form>
                {message && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{message}</p>}
            </motion.div>
        </motion.div>
    );
};

export default ForgotNewPass;