import React, { useState, useEffect } from "react";
import Api from "../../../Api/InstanceApi";
import CreateFieldsComponent from "./CreateFeildsComponent";
import EmergencyLogout from "../../EmergencyLogout";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";

Swal.mixin({
  customClass: {
    confirmButton: 'bg-[#795ded] text-white hover:bg-[#6b4de5] shadow-lg',
    cancelButton: 'bg-gray-400 text-white hover:bg-gray-500 shadow-lg',
    popup: 'rounded-lg',
    title: 'text-2xl font-bold text-gray-800',
    htmlContainer: 'text-lg text-gray-600',
  },
  buttonsStyling: false,
  showCloseButton: true,
  focusConfirm: false,
});
const AddProductsComponent = ({ refreshProducts, products, token, cancel, subSubCategory }) => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [showCreateFields, setShowCreateFields] = useState(false);
  const [options, setOptions] = useState([]);
  const [skipCreateFields, setSkipCreateFields] = useState(false);

  useEffect(() => {
    if (subSubCategory && token) {
      fetchOptions();
    }
  }, [subSubCategory, token]);

  useEffect(() => {
    if (products.length === 0 && options.length === 0) {
      setShowCreateFields(true);
      setSkipCreateFields(false); // Reset on revisit to ensure correct flow
    } else {
      setShowCreateFields(false);
    }
  }, [products, options]);


  const fetchOptions = async () => {
    try {
      const response = await Api.get(`/getAllOptions/${subSubCategory}`, {
        headers: { Authorization: token },
      });

      if (response.status === 202 && response.data?.data) {
        setOptions(response.data.data);
      } else {
        setOptions([]);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 401) {
          setShouldLogout(true)
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
      setOptions([]);

    }
  };

  const handleOptionToggle = (fieldName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [fieldName]: value, // Set value directly, allow null for clearing
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subSubCategory) return Swal.fire({
      title: 'Error',
      text: "Sub-category is missing",
      icon: 'error',
      confirmButtonText: 'OK',
    });

    const payload = {
      name: formData.name.trim(),
      price: formData.price.trim(),
      ...(formData.description?.trim() && { description: formData.description.trim() }),
      ...(Object.keys(selectedOptions).length > 0 && { options: selectedOptions }),
    };


    if (!payload.name || !payload.price) {
      return Swal.fire({
        title: 'Error',
        text: "Please fill in all required fields.",
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }

    try {
      await Api.post(`/addProduct/${subSubCategory}`, payload, { headers: { Authorization: token } });
      refreshProducts(subSubCategory, token)
      Swal.fire({
        title: 'Success',
        text: 'Product added successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        cancel();
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 401) {
          setShouldLogout(true)
        }
        alert(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };
  const handleSkip = () => {
    setSkipCreateFields(true);
    setShowCreateFields(false);
  };

  return (
    <>
      <div className="md:ml-6 md:mr-6 md:pt-6   bg-white border-form border border-1px rounded-2xl card p-6  min-h-screen font-[Urbanist]" >

        <div className="flex items-center justify-between mx-auto p-6 bg-white rounded-xl mb-3 relative">
          <button
            onClick={cancel}
            className="flex items-center cursor-pointer gap-2 bg-[#795ded] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-purple-200 transition duration-200 text-sm"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="flex-1 flex justify-center">
            <h3 className="text-gray-800 text-2xl md:text-3xl font-bold text-gray-700">
              Add Products
            </h3>
          </div>
        </div>


        <div className="w-full mx-auto pb-3 flex flex-col md:flex-row gap-6">
          {/* Add Product Section */}
          <div className="w-full md:w-1/2 p-6 bg-white  rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Details</h2>
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div>
                <div className="mt-2 pb-2">
                  <label className="form-label text-xl font-semibold text-[#555555]">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[#999999]" >(all fields are required unless specified optional)</p>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product title"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg text-xl text-gray-900 font-medium mt-2 p-2 border border-gray-300 focus:border-[#795ded] focus:ring-0 focus:outline-none"
                    required
                  />
                </div>

                <div className="mt-2 pb-2">
                  <label className="form-label text-xl font-semibold text-[#555555]">
                    Product Description
                  </label>
                  <p className="text-[#999999]" >(all fields are required unless specified optional)</p>
                  <input
                    name="description"
                    placeholder="Product Description (Optional)"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full text-xl rounded-lg font-medium mt-2 text-gray-900 bg-transparent focus:border-[#795ded] focus:ring-0 focus:outline-none border border-gray-300 p-2"
                  />
                </div>

                <div className="mt-2 pb-2">
                  <label className="form-label text-xl font-semibold text-[#555555]">
                    Product Price <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[#999999]" >(all fields are required unless specified optional)</p>
                  <input
                    type="number"
                    name="price"
                    min={0}
                    step="0.01"
                    placeholder="₹ 0.00"
                    value={formData.price}
                    className="text-xl text-gray-900 rounded-lg mt-2 font-medium bg-transparent focus:border-[#795ded] focus:ring-0 focus:outline-none border border-gray-300 p-2 w-full"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-2 pb-2">
                  <label className="form-label text-xl font-semibold text-[#555555]">
                    Current Stock
                  </label>
                  <p className="text-[#999999]" >(all fields are required unless specified optional)</p>
                  <input
                    type="number"
                    name="Stock"
                    placeholder="Current Stock - 0"
                    disabled
                    className="w-full text-xl rounded-lg text-gray-900 mt-2 font-medium bg-transparent focus:border-[#795ded] focus:ring-0 focus:outline-none border border-gray-300 p-2"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Fields Section */}
          <div className="w-full md:w-2/3 lg:w-1/2 p-6 bg-white  rounded-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Variants</h2>
            <label className="form-label text-xl font-semibold text-[#555555]">Existing Variants :</label>
            <div className="space-y-4 mt-2">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="relative flex flex-col gap-3 p-5 bg-gray-50  rounded-xl border border-gray-300"
                >
                  <button
                    type="button"
                    className="absolute cursor-pointer top-3 right-3 text-red-600 text-sm font-medium cursor-pointer hover:underline"
                    onClick={() => handleOptionToggle(option.name, null)}
                  >
                    Clear
                  </button>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <h2 className="font-semibold text-xl text-[#555555]">{option.name}:</h2>
                    <div className="flex flex-wrap gap-2">
                      {option.values && option.values.length > 0 ? (
                        option.values.map((value, i) => (
                          <button
                            key={i}
                            type="button"
                            className={`px-4 py-2 border rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 ${selectedOptions[option.name] === value
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-gray-100 text-[#555555] hover:bg-gray-200"
                              }`}
                            onClick={() => handleOptionToggle(option.name, value)}
                          >
                            {value}
                          </button>
                        ))
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter value"
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => handleOptionToggle(option.name, e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <CreateFieldsComponent
              cancel={handleSkip}
              refreshOptions={fetchOptions}
              token={token}
              options={options}
              subSubCategory={subSubCategory}
              close={() => setShowCreateFields(false)}
            />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex justify-end mx-auto p-6 bg-white  rounded-xl border border-gray-200 gap-4">
          <button
            type="button"
            onClick={cancel}
            className="w-full sm:w-1/6 bg-gray-400 cursor-pointer text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-1/6 bg-[#795ded] text-white cursor-pointer py-3 rounded-lg font-semibold text-lg shadow-lg transition"
          >
            Add Product
          </button>
        </div>
      </div>

      {shouldLogout && <EmergencyLogout />}
    </>
  );
};

export default AddProductsComponent;
