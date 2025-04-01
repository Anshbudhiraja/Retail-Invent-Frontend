import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Api from '../../Api/InstanceApi';
import ForgotOtp from './ForgotOtp';

const ForgotPass = ({ cancel }) => {
    const [otpToggle,setOtpToggle]=useState(false)
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await Api.post("/forgetUser", { email });
            setMessage(response.data.message);
            setOtpToggle(true)
        } catch (error) {
            console.log(error)
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
                {   
                otpToggle ? (
                        <ForgotOtp email={email} cancel={()=>setOtpToggle(false)} />
                    ) :(
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
                                Forgot Password
                            </motion.h3>
                            <p className="font-medium text-gray-500 dark:text-gray-400 mt-4">
                                Enter your email to receive an OTP
                            </p>
                            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                                <div>
                                    <label className="form-label">Email</label>
                                    <div className="relative flex items-center bg-gray-100 dark:bg-dark-border rounded-lg p-3 shadow-sm">
                                        <i className="ri-mail-line text-gray-500 dark:text-dark-text mr-2"></i>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-transparent flex-1 outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#795ded] transition-all duration-300 py-1 rounded-lg text-lg font-semibold text-white shadow-md"
                                >
                                    {loading ? "Sending..." : "Forgot Password"}
                                </motion.button>
                            </form>
                            {message && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{message}</p>}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                onClick={cancel}
                                className="text-[#795ded] cursor-pointer dark:text-gray-300 font-medium mt-5"
                            >
                                Back
                            </motion.div>
                        </motion.div>
                    </motion.div>
                    )}
        
        </div>

    );
};

export default ForgotPass;
