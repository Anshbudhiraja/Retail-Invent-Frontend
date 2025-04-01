import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import ChooseVendorComponent from "./ChooseVendorComponent";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";

const AddStockModal = ({ refreshProducts, productId, onClose, token, categoryId }) => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [formData, setFormData] = useState({
    stock: "",
    vendor: "",
    cost: "",
    date: new Date().toISOString().split("T")[0],
    othercharges: "",
  });

  const [loading, setLoading] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorName, setVendorName] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectVendor = (vendor) => {
    setVendorName(vendor.name);
    setFormData({ ...formData, vendor: vendor._id });
    setShowVendorModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get the selected date from formData
      const selectedDate = new Date(formData.date);

      // Get the current time
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Append the current time to the selected date
      selectedDate.setHours(hours, minutes, seconds);

      // Convert to local string format
      const formattedDate = selectedDate.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata", // Adjust based on your preferred timezone
      });

      // Prepare updated formData with formatted date
      const formattedData = {
        ...formData,
        date: formattedDate, // Send date with current time
      };

      const response = await Api.post(`/addStock/${productId}`, formattedData, {
        headers: { Authorization: token },
      });

      if (response.status !== 202) {
        throw new Error(response.data.message || "Something went wrong");
      }

      alert("Stock added successfully!");
      refreshProducts();
      onClose();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 401) {
          setShouldLogout(true);
        }
        alert(error.response.data.message);
        console.log(error.response.data.message);
      } else {
        console.log(error);
        console.log("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-65">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-700">Add Stock</h2>
          <FaTimes className="text-gray-500 cursor-pointer hover:text-red-600 transition" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Quantity"
            value={formData.stock}
            onChange={handleChange}
            className="cool-input"
            required
          />

          {/* Vendor Selection */}
          <div className="relative">
            <input
              type="text"
              name="vendor"
              placeholder="Select Vendor"
              value={vendorName}
              readOnly
              className="cool-input cursor-pointer bg-gray-50"
              onClick={() => setShowVendorModal(true)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {vendorName ? "✔ Selected" : "Click to choose"}
            </span>
          </div>

          {/* Cost */}
          <input
            type="number"
            name="cost"
            placeholder="Cost per item"
            value={formData.cost}
            onChange={handleChange}
            className="cool-input"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="cool-input"
          />

          {/* Other Charges */}
          <input
            type="number"
            name="othercharges"
            placeholder="Other Charges (GST, etc.) (Optional)"
            value={formData.othercharges}
            onChange={handleChange}
            className="cool-input"
          />

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="cool-button cursor-pointer bg-gray-500 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cool-button cursor-pointer bg-[#795ded]  flex items-center gap-2"
            >
              {loading ? "Adding..." : <FaPlus size={16} />}
              {loading ? "" : "Add Stock"}
            </button>
          </div>
        </form>
      </div>

      {/* Vendor Selection Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <ChooseVendorComponent
            token={token}
            close={() => setShowVendorModal(false)}
            categoryId={categoryId}
            onSelectVendor={handleSelectVendor}
          />
        </div>
      )}

      {/* Emergency Logout */}
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default AddStockModal;
