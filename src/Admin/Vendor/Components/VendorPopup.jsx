import React, { useState, useEffect } from "react";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";

const VendorPopup = ({ token, editVendor, cancelEdit, refreshVendors }) => {
  const [vendorData, setVendorData] = useState({ name: "" });
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    if (editVendor) {
      setVendorData(editVendor);
    }
  }, [editVendor]);

  // Handle input changes
  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  // Handle Save (Update Vendor)
  const handleSave = async (e) => {
    try {
      e.preventDefault()
      const response = await Api.put(`/updateVendor/${editVendor._id}`, vendorData, {
        headers: {
          Authorization: token
        }
      });
      alert(response.data.message);
      refreshVendors();
      cancelEdit();
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
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-65 bg-black/25">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Vendor</h2>

        <form className="grid gap-5" onSubmit={handleSave}>
          {/* Name Input */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-2">Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={vendorData.name}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 outline-none"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between">
            <button
              onClick={cancelEdit}
              type="button"
              className="w-1/2 cursor-pointer bg-gray-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-700 transition duration-300 mr-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      {shouldLogout && <EmergencyLogout />}
    </div>



  );
};

export default VendorPopup;
