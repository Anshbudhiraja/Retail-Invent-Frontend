import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import OtpComp from "../Components/OtpComp";
import PasswordComp from "../Components/PasswordComp";
import Api from "../../Api/InstanceApi";
import "remixicon/fonts/remixicon.css";
import ForgotPass from "../Components/ForgotPass";

const Login = () => {
    const [email, setEmail] = useState("");
    const [otpToggle, setOtpToggle] = useState(false);
    const [passwordToggle, setPasswordToggle] = useState(false);
    const [ForgotToggle, setForgotToggle] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(import.meta.env.VITE_API_PATH)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email address" });
            return;
        }

        setLoading(true);
        try {
            const response = await Api.post("/emailLogin", { email });
            if (response.data.data.required === "otp") {
                setOtpToggle(true);
            } else if (response.data.data.required === "password") {
                setPasswordToggle(true);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "An unexpected error occurred",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-body-light dark:bg-dark-body p-2 font-[Urbanist]">
            <div className="grid grid-cols-12 gap-y-7 sm:gap-7 lg:gap-x-14 xl:gap-x-20 card px-4 sm:px-10 2xl:px-[70px] py-15 lg:items-center lg:min-h-[calc(100vh_-_32px)]">
                {/* Left Side Overview */}
                <div className="col-span-full lg:col-span-6 flex flex-col items-center text-center gap-10">
                    <div className="hidden sm:block">
                        <img src="./Images/loti/loti-auth.svg" alt="loti" className="group-[.dark]:hidden" />
                    </div>
                    <div>
                        <h3 className="text-xl md:text-[28px] font-semibold text-heading text-[#251F47] dark:text-white">
                            Welcome back!
                        </h3>
                        <p className="text-gray-500 dark:text-dark-text mt-4 px-[10%]">
                            Sign in to access your account.
                        </p>
                    </div>
                </div>

                {/* Right Side Login Form */}
                <div className="col-span-full lg:col-span-6 w-full lg:max-w-[600px]">
                    {otpToggle ? (
                        <OtpComp email={email} cancel={() => setOtpToggle(false)} />
                    ) : passwordToggle ? (
                        <PasswordComp email={email} cancel={() => setPasswordToggle(false)} />
                    ) : ForgotToggle ? (
                        <ForgotPass email={email} cancel={() => setForgotToggle(false)} />
                    )
                        : (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="border border-1px rounded-2xl border-form dark:border-dark-border p-5 md:p-10 rounded-20 md:rounded-30 bg-white dark:bg-dark-card "
                            >
                                <h3 className="text-xl md:text-[28px] font-semibold text-heading text-[#251F47] dark:text-white">
                                    Sign In
                                </h3>
                                <p className="text-gray-500 dark:text-dark-text mt-4">
                                    Welcome Back! Log in to your account
                                </p>
                                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                    <div>
                                        <label className="form-label">Email</label>
                                        <div className="relative flex items-center bg-gray-100 dark:bg-dark-border rounded-lg p-3 shadow-sm">
                                            <i className="ri-mail-line text-gray-500 dark:text-dark-text mr-2"></i>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full cursor-pointer bg-[#795ded]  transition-all duration-300 py-1 rounded-lg text-lg font-semibold text-white shadow-md"
                                        disabled={loading}
                                    >
                                        {loading ? "Processing..." : "Next"}
                                    </button>
                                </form>
                                <p className="mt-4 text-center cursor-pointer text-gray-500 dark:text-dark-text text-xs md:text-sm">
                                    Forgot your password?{" "}
                                    <button onClick={() => setForgotToggle(true)} className="text-[#795DED] hover:underline font-semibold dark:text-[#815DED]">
                                        Forgot
                                    </button>
                                </p>
                            </motion.div>
                        )
                    }
                </div>
            </div>
        </div>

    );
};

export default Login;