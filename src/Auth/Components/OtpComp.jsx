import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Api from "../../Api/InstanceApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUser } from "react-icons/fa";

const OtpComp = ({ email, cancel }) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            Swal.fire({
                icon: "error",
                title: "Invalid OTP",
                text: "Please enter a valid 6-digit OTP.",
                confirmButtonColor: "#795DED", // Matching the theme
            });
            return;
        }

        setLoading(true);
        try {
            const response = await Api.post("/verifyLogin", { email, otp: otpValue });

            if (response.status === 202) {
                const token = response.data.data.token;
                localStorage.setItem("Authorization", JSON.stringify({ token }));
                navigate(`${response.data.data.role}`);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "An unexpected error occurred.",
                confirmButtonColor: "#e11d48",
            });

            if (error?.response?.status === 401 || error?.response?.status === 500) {
                cancel(false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="border border-1px rounded-2xl border-form dark:border-dark-border p-5 md:p-10 bg-white dark:bg-dark-card shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md"
            >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center shadow-md mb-4 md:mb-5 mx-auto">
                    <FaUser className="text-gray-500 dark:text-dark-text text-lg md:text-2xl" />
                </div>

                <h2 className="text-xl md:text-[28px] font-semibold text-center mb-4 md:mb-5 text-[#251F47] dark:text-white">
                    Enter OTP
                </h2>
                <p className="text-gray-500 dark:text-dark-text text-center mb-6">
                    Verify your account with the OTP sent to {email}
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-6">
                    <div className="grid grid-cols-6 gap-2 md:gap-3 w-full justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold bg-gray-100 dark:bg-dark-border border border-gray-300 dark:border-dark-border rounded-lg outline-none focus:border-[#795DED] focus:ring-2 focus:ring-[#795DED]/30 transition-all text-gray-800 dark:text-white"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            type="button"
                            className="flex-1 cursor-pointer bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 py-2 rounded-lg text-sm md:text-lg font-semibold shadow-md"
                            onClick={() => cancel(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 cursor-pointer bg-[#795DED] hover:bg-[#815DED] transition-all duration-300 py-2 rounded-lg text-sm md:text-lg font-semibold text-white shadow-md disabled:bg-[#795DED]/70"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-gray-500 dark:text-dark-text text-xs md:text-sm">
                    Didn't receive an OTP?{" "}
                    <button className="text-[#795DED] cursor-pointer hover:underline font-semibold dark:text-[#815DED]">
                        Resend
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default OtpComp;