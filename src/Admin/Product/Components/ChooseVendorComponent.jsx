import React, { useState, useEffect } from "react";
import { X, Search, Plus, CheckCircle, Loader2 } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { Transition } from "react-transition-group";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";

const ChooseVendorComponent = ({ close, categoryId, onSelectVendor, token }) => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingVendor, setAddingVendor] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [categoryId]);

  const fetchVendors = async () => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const response = await Api.get(`/getAllVendors/${categoryId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 202) {
        setVendors(response.data.data);
      }
    } catch (error) {
      if (error?.response?.status === 500 || error?.response?.status === 401) {
        setShouldLogout(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectVendor = (vendor) => {
    if (!vendor) return;
    setSelectedVendor(vendor); // ✅ Ensure the selected vendor updates
    onSelectVendor(vendor);
    close();
  };

  const handleAddVendor = async () => {
    if (!search.trim() || addingVendor) return;
    try {
      setAddingVendor(true);
      const response = await Api.post(
        `/createVendor/${categoryId}`,
        { name: search },
        { headers: { Authorization: token } }
      );

      if (response.status === 201) {
        fetchVendors();// ✅ Update vendors list after adding
        setSearch("");
      }
    } catch (error) {
      if (error?.response?.status === 500 || error?.response?.status === 401) {
        setShouldLogout(true);
      }
    } finally {
      setAddingVendor(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-300 shadow-lg p-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <button onClick={close} className="text-gray-500 cursor-pointer hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Select Vendor</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mt-4">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none pl-10"
          placeholder="Search or add vendor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>

      {/* Vendor List */}
      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          </div>
        ) : filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer border ${selectedVendor?._id === vendor._id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
                }`}
              onClick={() => handleSelectVendor(vendor)}
            >
              <span className="text-gray-800 font-medium">{vendor.name}</span>
              {selectedVendor?._id === vendor._id && <CheckCircle className="w-5 h-5 text-blue-600" />}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center text-gray-500 py-5">
            <Search className="text-3xl mb-2" />
            <p>No vendors found</p>
          </div>
        )}

        {/* Add New Vendor */}
        {search &&
          !filteredVendors.some(
            (vendor) => vendor.name.toLowerCase() === search.toLowerCase()
          ) && (
            <div
              className={`flex items-center space-x-3 p-3 cursor-pointer ${addingVendor ? "text-gray-400" : "text-blue-500 hover:underline"
                }`}
              onClick={handleAddVendor}
            >
              <FaPlus />
              <span>{addingVendor ? "Adding..." : `Add "${search}"`}</span>
            </div>
          )}
      </div>

      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default ChooseVendorComponent;
