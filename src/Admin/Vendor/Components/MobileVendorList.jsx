import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import VendorPopup from "./VendorPopup";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";

const getColorFromLetter = (letter) => {
  const gradients = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-purple-400",
  ];
  return gradients[letter.charCodeAt(0) % gradients.length];
};

const MobileVendorList = ({ vendors, fetchVendors, addVendor }) => {
  const [editVendor, setEditVendor] = useState(null);
  const [search, setSearch] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  const handleDelete = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const response = await Api.delete(`/deleteVendor/${vendorId}`);
      if (response.status === 202) {
        alert("Vendor deleted successfully!");
        fetchVendors();
      }
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

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="block md:hidden space-y-4 relative p-1 ">

      {/* Search and Filter */}
      <div className="flex items-center p-3 gap-3 w-full w-full mx-auto">
        {/* Search Input Wrapper */}
        <div className="relative flex items-center bg-white p-3 rounded-full shadow-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition duration-200 w-full">
          {/* Search Icon */}
          <FaSearch className="text-gray-500 ml-3 flex-shrink-0" />

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow w-full text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none py-2 px-3 text-base"
          />

          {/* Clear Button */}
          {search && (
            <button
              className="text-gray-500 cursor-pointer hover:text-red-500 transition duration-200 mx-2"
              onClick={() => setSearch("")}
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      </div>

      {filteredVendors.length > 0 ? (
        <div className="space-y-3">
          {filteredVendors.map((vendor) => {
            const initial = vendor.name.charAt(0).toUpperCase();
            const bgColor = getColorFromLetter(initial);

            return (
              <div
                key={vendor._id}
                className="flex items-center bg-white shadow-md rounded-xl p-4 border border-gray-200 relative transition transform hover:scale-105"
              >
                {/* Avatar */}
                <div className={`w-12 h-12 ${bgColor} text-white flex items-center justify-center rounded-full text-lg font-bold shadow-lg`}>
                  {initial}
                </div>

                {/* Vendor Details */}
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{vendor.name}</h3>
                  <p className="text-sm text-gray-600">{vendor.phone}</p>
                  <p className="text-xs text-gray-500">{vendor.city}, {vendor.state}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="btn-icon cursor-pointer bg-purple-100 size-7 flex-center rounded-full  transition" onClick={() => setEditVendor(vendor)}>
                    <i className="ri-edit-2-line text-purple-500 text-[12px] "></i>
                  </button>
                  <button className="btn-icon cursor-pointer bg-red-100 size-7 flex-center rounded-full  transition" onClick={() => handleDelete(vendor._id)}>
                    <i className="ri-delete-bin-line text-red-500 text-[12px] "></i>

                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No vendors found.</p>
      )}

      {/* Add Vendor Button */}

      <button onClick={addVendor} className="fixed cursor-pointer bottom-27 right-6 bg-[#795ded] text-white p-5 rounded-full shadow-lg transition duration-300 cursor-pointer">
        <FaPlus size={22} />
      </button>


      {/* Edit Vendor Popup */}
      {editVendor && editVendor._id && (
        <VendorPopup editVendor={editVendor} refreshVendors={fetchVendors} cancelEdit={() => setEditVendor(null)} />
      )}

      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default MobileVendorList;
