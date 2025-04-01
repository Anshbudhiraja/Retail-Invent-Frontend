import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Api from "../../Api/InstanceApi";
import { useNavigate } from "react-router-dom";

const PasswordComp = ({ email, cancel }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password Validation Regex (Min. 6 characters)
    const passwordRegex = /^.{6,}$/;

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordRegex.test(password)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Password",
                text: "Password must be at least 6 characters long",
                confirmButtonColor: "#2563eb", // Blue theme
            });
            return;
        }

        setLoading(true);
        try {
            const response = await Api.post("/passwordLogin", { email, password });

            if (response.status === 202) {
                localStorage.setItem(
                    "Authorization",
                    JSON.stringify({ token: response.data.data.token })
                );

                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "Redirecting...",
                    timer: 1500,
                    showConfirmButton: false,
                });
                // console.log(response.data.data.role)
                navigate(`${response.data.data.role}`);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.response?.data?.message || "An unexpected error occurred",
                confirmButtonColor: "#e11d48", // Red theme for errors
            });

            if (error.response?.status === 401 || error.response?.status === 500) {
                cancel();
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border border-1px rounded-2xl border-form dark:border-dark-border p-5 md:p-10 rounded-20 md:rounded-30 bg-white dark:bg-dark-card "
            >
                <h3 className="text-xl md:text-[28px] font-semibold text-heading text-[#251F47] dark:text-white">
                    Sign In
                </h3>
                <p className="text-gray-500 dark:text-dark-text mt-4">
                    Welcome Back! Log in to your account
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Password Input */}
                    <div className="flex flex-col space-y-2">
                        <label className="form-label">Password</label>
                        <div className="relative flex items-center bg-gray-100 dark:bg-dark-border rounded-lg p-3 shadow-sm">
                            <i className="ri-lock-line text-gray-500 dark:text-dark-text mr-2"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute cursor-pointer right-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <i className="ri-eye-line text-gray-500 dark:text-dark-text mr-2"></i>
                                    : <i className="ri-eye-off-line text-gray-500 dark:text-dark-text mr-2"></i>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex gap-4">
                        {/* Cancel Button */}
                        <button
                            type="button"
                            className="w-full cursor-pointer flex-1 text-gray-500 bg-gray-200  transition-all duration-300 py-1 rounded-lg text-lg font-semibold  shadow-md"
                            onClick={cancel}
                        >
                            Cancel
                        </button>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className={`flex-1 cursor-pointer bg-[#795ded]  transition-all duration-300 py-1 rounded-lg text-lg font-semibold text-white shadow-md hover:bg-[#815ded]`}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Login"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default PasswordComp;
