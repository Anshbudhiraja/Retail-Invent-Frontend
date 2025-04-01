import React, { useState } from "react";
import Api from "../../../../Api/InstanceApi";
import EmergencyLogout from "../../../EmergencyLogout";

const PopupComponent = ({ token, isModalOpen, setIsModalOpen, refreshcategory }) => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [errorMessage, setErrorMessage] = useState("");

  if (!isModalOpen) return null; // Prevent unnecessary rendering

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedTypes.includes(file.type)) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setErrorMessage("");
    } else {
      setErrorMessage("Please select a valid file type: PNG, JPEG, or JPG");
    }

    event.target.value = ""; // Reset file input
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImageFile(null);
    setFormData({ name: "" });
    setErrorMessage("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Category name is required.");
      return;
    }
    if (!imageFile) {
      setErrorMessage("Please upload an image.");
      return;
    }

    const form = new FormData();
    form.append("image", imageFile);
    form.append("name", formData.name);

    try {
      await Api.post("/createMainCategory", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      refreshcategory();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 401) {
          setShouldLogout(true);
        }
        setErrorMessage(error.response.data.message || "An error occurred. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-65 bg-black/25">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Add New Category</h2>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Category Name</label>
          <input
            type="text"
            placeholder="Enter category name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Upload Image</label>
          <div className="w-full h-48 border border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition cursor-pointer p-6">
            <input type="file" className="hidden" id="fileUpload" onChange={handleImageUpload} />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                  style={{ width: "100%", height: "100%", maxHeight: "100%", objectFit: "cover" }}
                />
              ) : (
                <>
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V12M7 12V8M7 12H3m4 0h4m8 4V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8m18 0a2 2 0 002-2v-4a2 2 0 00-2-2h-4m-8 0H3m12 12v-4m0 4h4m-4 0H7" />
                  </svg>
                  <p className="text-sm mt-2">Click to upload</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            className="bg-gray-400 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#795ded] cursor-pointer text-white px-4 py-2 rounded-lg transition"
          >
            Add
          </button>
        </div>
      </div>

      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default PopupComponent;
