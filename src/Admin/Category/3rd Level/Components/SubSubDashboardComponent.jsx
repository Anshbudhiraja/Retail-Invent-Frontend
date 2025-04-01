import React, { useEffect, useState } from "react";
import Api from "../../../../Api/InstanceApi";
import SubSubPopupComponent from "./SubSubPopupComponent";
import { Link, useNavigate } from "react-router-dom";
import EmergencyLogout from "../../../EmergencyLogout";
import { FaArrowLeft } from "react-icons/fa";

const SubSubDashboardComponent = ({ token }) => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = JSON.parse(localStorage.getItem("Id"));
    setId(storedId);
    fetchCategories(storedId?.Subid);
  }, []);

  const fetchCategories = async (categoryId) => {
    if (!categoryId) {
      setLoading(false);
      return;
    }
    try {
      const response = await Api.get(`/getAllSubSubCategory/${categoryId}`, {
        headers: { Authorization: token },
      });

      if (response.status === 202) {
        setCategories(response.data.data);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const nav = async (categoryId, categoryName) => {
    try {
      const response = await Api.get(`/getSubSubCategory/${categoryId}`, {
        headers: { Authorization: token },
      });

      if (response.status !== 202) {
        console.log("Something went wrong");
        return;
      }

      const storedId = JSON.parse(localStorage.getItem("Id"));
      localStorage.setItem(
        "Id",
        JSON.stringify({
          ...storedId,
          SubSubid: categoryId,
          SubSubName: categoryName,
          SchemaId: response.data.data.schemaId,
        })
      );

      navigate("/Products");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response) {
      console.log("Error:", error.response.data.message);
      if (error.response.status === 500 || error.response.status === 401) {
        setShouldLogout(true);
      }
    } else if (error.request) {
      console.error("No response from server.");
    } else {
      console.error("Unexpected error occurred.");
    }
  };

  return (
    <div className="md:ml-6 md:mr-6 md:pt-6 mt-3 bg-white border-form border border-1px rounded-2xl card p-6  min-h-screen font-[Urbanist]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <Link
          to="/SubDashboard"
          className="inline-flex items-center gap-2 bg-[#795ded] text-white px-3 py-2 rounded-lg shadow-md transition-transform 
       hover:shadow-lg hover:scale-105 focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
          aria-label="Back to Dashboard"
        >
          <FaArrowLeft className="text-base  sm:text-lg" />
          <span className="font-semibold xs:inline">Back</span>
        </Link>

        {/* Page Title (Hidden on Mobile) */}
        <h2 className="hidden sm:block text-[#251f47] text-lg md:text-xl font-bold text-gray-700">
          {id?.SubName || "Category"}
        </h2>

        {/* New Category Button */}
        <button
          className="bg-[#795ded] cursor-pointer text-white font-semibold px-3 py-2 min-w-[120px] rounded-lg shadow-md transition-all 
   hover:scale-105 focus:ring-4 focus:ring-blue-300 text-sm sm:text-base whitespace-nowrap"
          onClick={() => setIsModalOpen(true)}
        >
          + New Category
        </button>
      </div>

      {/* Categories Grid */}
      {!loading ? (
        categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => nav(category._id, category.name)}
                className="bg-white p-4 border-1  rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg flex flex-col"
              >
                <img
                  src={`${import.meta.env.VITE_IMAGE_PATH}${category.image.replace("./uploads", "uploads")}`}
                  alt={category.name}
                  className="w-full aspect-[20/16] object-cover rounded-lg"
                />
                <div className="flex-grow flex items-center justify-center">
                  <h2 className="text-sm text-[#251f47] sm:text-lg md:text-xl font-semibold mt-3 text-center">
                    {category.name}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No categories available.</p>
        )
      ) : (
        <p className="text-center text-gray-600">Loading...</p>
      )}

      {/* SubSubPopupComponent */}
      <SubSubPopupComponent
        token={token}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        id={id?.Subid}
        fetchCategories={fetchCategories}
      />

      {/* Emergency Logout */}
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default SubSubDashboardComponent;
