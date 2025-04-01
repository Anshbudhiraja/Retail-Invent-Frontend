import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import SubPopupComponent from "./SubPopupComponent";
import Api from "../../../../Api/InstanceApi";
import { Link, useNavigate } from "react-router-dom";
import EmergencyLogout from "../../../EmergencyLogout";
import { FaBackward } from "react-icons/fa";

const SubDashboardComponent = ({ token }) => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = JSON.parse(localStorage.getItem("Id"));
    setId(storedId);
    fetchCategories(storedId?.id);
  }, []);

  const fetchCategories = async (categoryId) => {
    if (!categoryId) {
      setLoading(false);
      return;
    }
    try {
      const response = await Api.get(`/getAllSubCategory/${categoryId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 202) {
        setCategories(response.data.data);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 401) {
          setShouldLogout(true);
        }
        console.log(error.response.data.message);
      } else {
        console.log(error.request ? "No response from server" : "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const nav = (categoryId, categoryName) => {
    localStorage.setItem(
      "Id",
      JSON.stringify({ ...id, Subid: categoryId, SubName: categoryName })
    );
    navigate("/SubSubDashboard");
  };

   
  return (
    <div className="md:ml-6 md:mr-6 md:pt-6 mt-3   bg-white border-form border border-1px rounded-2xl card p-6  min-h-screen font-[Urbanist]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Back Button */}
        <Link
          to="/Admin"
          className="inline-flex items-center gap-2 bg-[#795ded] text-white px-3 py-2 rounded-lg shadow-md transition-transform 
       hover:shadow-lg hover:scale-105 focus:ring-4 focus:ring-blue-300 text-sm sm:text-base"
          aria-label="Back to Dashboard"
        >
          <FaArrowLeft className="text-base  sm:text-lg" />
          <span className="font-semibold xs:inline">Back</span>
        </Link>

        {/* Page Title (Hidden on Mobile) */}
        <h2 className="hidden sm:block text-[#251f47] tracking-wide text-lg md:text-xl font-bold text-gray-700">
          {id?.name || "Category"}
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




      {/* Category Grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {categories.length > 0 ? (
             categories.map((category, index) => (
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
                  <h2 className="text-sm text-[#251f47] sm:text-lg md:text-xl font-semibold mt-3 text-center text-gray-800">
                    {category.name}
                  </h2>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No categories available.</p>
          )}
        </div>
      )}

      {/* Popup Modal */}
      <SubPopupComponent
        token={token}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        id={id?.id}
        fetchCategories={fetchCategories}
      />

      {/* Emergency Logout */}
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default SubDashboardComponent;
