import React, { useState, useRef } from "react";
import { FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";

const PassComp = ({ productId, categoryId, onClose, token }) => {
  if (!categoryId || !productId) return null;

  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await Api.post(
        "/checkPrivacyPassword",
        { password },
        { headers: { Authorization: token } }
      );

      if (response.status === 202) {
        localStorage.setItem(
          "PrivacyAuthorization",
          JSON.stringify({
            token: response.data.data.token,
            productId,
            categoryId,
          })
        );

        navigate("/Modal");
        onClose();
      } else {
        setError(response.data.message || "Invalid password. Please try again.");
      }
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true);
        }
        setError(error.response.data.message || "Server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-65 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-[#795ded] rounded-full shadow-md">
            <FaLock className="text-white text-4xl" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Enter Privacy Password</h2>

        {/* Password Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              className="pl-10 w-full border-2 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className=" w-full flex justify-center space-x-7">

            <button
              onClick={onClose}
              type="button"
              className="w-2/3 cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 bg-[#795ded]  text-white font-semibold py-3 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed"}
            </button>
          </div>
        </form>
      </div>

      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default PassComp;
