import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../Api/InstanceApi";

const CommonComp = ({ setNewpassword }) => {
    const navigate = useNavigate();
    const [obj, setObj] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRegex = /^.{6,}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setObj((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordRegex.test(obj.password)) {
            return Swal.fire({
                icon: "error",
                title: "Weak Password",
                text: "Password must be at least 6 characters.",
                confirmButtonColor: "#795DED", // Matching theme
            });
        }

        if (obj.password !== obj.confirmPassword) {
            return Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Passwords do not match.",
                confirmButtonColor: "#e11d48", // Rose theme for errors
            });
        }

        setLoading(true);
        try {
            const Auth = JSON.parse(localStorage.getItem("Authorization"));
            if (!Auth || !Auth.token) {
                localStorage.clear();
                Swal.fire({ icon: "error", title: "Unauthorized", text: "Please log in again." });
                return navigate("/", { replace: true });
            }

            const response = await Api.put("/createPassword", obj, {
                headers: { Authorization: Auth.token },
            });

            if (response.data.data.status) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                    timer: 2000,
                    showConfirmButton: false,
                });
                setNewpassword(false);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "An unexpected error occurred.",
            });
            if (error.response?.data?.data?.navigate) {
                navigate(error.response.data.data.navigate);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border border-1px rounded-2xl border-form dark:border-dark-border p-5 md:p-10 bg-white dark:bg-dark-card shadow-md w-full max-w-sm"
            >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center shadow-md mb-6 mx-auto">
                    <FaUser className="text-gray-500 dark:text-dark-text text-2xl md:text-3xl" />
                </div>
                <h2 className="text-xl md:text-[28px] font-semibold text-center mb-4 md:mb-6 text-[#251F47] dark:text-white">
                    Create Password
                </h2>
                <p className="text-gray-500 dark:text-dark-text text-center mb-6">
                    Set a new password for your account
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {["password", "confirmPassword"].map((field, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-600 dark:text-dark-text">
                                {field === "password" ? "Password" : "Confirm Password"}
                            </label>
                            <div className="relative flex items-center bg-gray-100 dark:bg-dark-border rounded-lg p-3 shadow-sm">
                                <FaLock className="text-gray-500 dark:text-dark-text mr-2" />
                                <input
                                    type={
                                        field === "password"
                                            ? showPassword
                                                ? "text"
                                                : "password"
                                            : showConfirmPassword
                                                ? "text"
                                                : "password"
                                    }
                                    className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder={
                                        field === "password" ? "Enter your password" : "Confirm your password"
                                    }
                                    value={obj[field]}
                                    name={field}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute cursor-pointer right-3 text-gray-500 dark:text-dark-text hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() =>
                                        field === "password"
                                            ? setShowPassword(!showPassword)
                                            : setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {field === "password"
                                        ? showPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                        : showConfirmPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 cursor-pointer bg-[#795DED] hover:bg-[#815DED] transition-all duration-300 py-3 rounded-lg text-lg font-semibold text-white shadow-md disabled:bg-[#795DED]/70"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Next"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CommonComp;