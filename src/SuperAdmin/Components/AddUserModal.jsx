import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaKey } from "react-icons/fa";
import Api from "../../Api/InstanceApi";
import EmergencyLogout from "../../Admin/EmergencyLogout";

const AddUserModal = ({ Token, onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    role: "Admin",
    executiveof: "",
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await Api.post("/verifyuser", formData, {
        headers: { Authorization: Token },
      });
      setStep(2);
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await Api.post("/createuser", { ...formData, otp }, {
        headers: { Authorization: Token },
      });
      alert(response.data.message);
      onClose();
      onUserAdded();
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-2xl w-[400px] relative"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          {step === 1 ? "Add New User" : "Enter OTP"}
        </h3>

        {error && (
          <p className="text-red-800 text-sm text-center bg-red-200 p-2 rounded-md mb-3">
            {error}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={requestOtp} className="space-y-4">
            {[
              { name: "name", placeholder: "Full Name", icon: <FaUser /> },
              { name: "phone", placeholder: "Phone Number", icon: <FaPhone /> },
              { name: "email", placeholder: "Email Address", icon: <FaEnvelope />, type: "email" },
              { name: "address", placeholder: "Address", icon: <FaMapMarkerAlt /> },
              { name: "city", placeholder: "City", icon: <FaCity /> },
            ].map(({ name, placeholder, icon, type = "text" }) => (
              <div key={name} className="flex items-center border border-gray-400 rounded-lg p-2 focus-within:border-blue-500">
                <span className="text-gray-500">{icon}</span>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  className="bg-transparent flex-1 outline-none px-2 text-gray-900"
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <input
              type="text"
              name="state"
              placeholder="State"
              className="w-full p-2 border border-gray-400 rounded-lg focus:border-blue-500"
              onChange={handleChange}
              required
            />

            <select
              name="role"
              className="w-full p-2 border border-gray-400 rounded-lg focus:border-blue-500"
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="Executive">Executive</option>
            </select>

            {formData.role === "Executive" && (
              <input
                type="text"
                name="executiveof"
                placeholder="Admin ID"
                className="w-full p-2 border border-gray-400 rounded-lg focus:border-blue-500"
                onChange={handleChange}
                required
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white rounded-lg shadow-md"
            >
              {loading ? "Requesting OTP..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="flex items-center border border-gray-400 rounded-lg p-2 focus-within:border-blue-500">
              <FaKey className="text-gray-500" />
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="bg-transparent flex-1 outline-none px-2 text-gray-900"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white rounded-lg shadow-md"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <button
          className="w-full cursor-pointer mt-3 px-4 py-2 bg-gray-600 hover:bg-gray-700 transition-all duration-300 text-white rounded-lg shadow-md"
          onClick={onClose}
        >
          Cancel
        </button>
      </motion.div>

      {shouldLogout && <EmergencyLogout/>}
    </div>
  );
};

export default AddUserModal;
