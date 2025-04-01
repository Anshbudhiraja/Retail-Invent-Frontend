import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";

const NewPassWordComp = ({refreshPrivacyPassword, onClose, token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [setupStarted, setSetupStarted] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setMessage("⚠️ Both fields are required.");
      return;
    }

    if (password.length < 6) {
      setMessage("⚠️ Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await Api.put(
        "/createPrivacyPassword",
        { password, confirmPassword },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("✅ " + response.data.message);
      refreshPrivacyPassword();
      onClose()
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true);
        }
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ An unexpected error occurred.");
      }
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-65">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 animate-fade-in text-center border border-gray-200">
        {/* Privacy Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-[#795ded] rounded-full shadow-md">
            <FaLock className="text-white text-4xl" />
          </div>
        </div>

        {/* Initial Message */}
        {!setupStarted ? (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Set Up Your Privacy Password</h2>
            <p className="text-gray-600 mb-6">Protect your account with a secure privacy password.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="w-1/3 bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setSetupStarted(true)}
                className="w-1/3 bg-[#795ded] cursor-pointer text-white font-semibold py-3 rounded-lg transition"
              >
                Setup
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Password Input */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Set Up Your Privacy Password</h2>
            <div className="relative mb-4">

              <input
                type={showPassword ? "text" : "password"}
                className="pl-5 w-full border-2 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="pl-5 w-full border-2 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Message */}
            {message && <p className="text-red-500 text-sm mb-3">{message}</p>}

            {/* Buttons */}
            <div className="flex justify-center space-x-4">

              <button
                onClick={onClose}
                className="w-1/3 bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="w-1/3 bg-[#795ded] cursor-pointer text-white font-semibold py-3 rounded-lg transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Set Password"}
              </button>
            </div>
          </>
        )}
      </div>
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default NewPassWordComp;