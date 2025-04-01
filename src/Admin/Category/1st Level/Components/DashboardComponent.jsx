import { useEffect, useState } from "react";
import PopupComponet from './PopupComponet';
import Api from "../../../../Api/InstanceApi";
import { Link, useNavigate } from "react-router-dom";
import EmergencyLogout from "../../../EmergencyLogout";
import { FaPlus } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

const DashboardComponent = ({ token }) => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchUser();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await Api.get("/getAllMainCategory", {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 202) {
        setCategories(response.data.data);
      } else {
        alert("Failed to fetch categories");
      }
    } catch (error) {
      if (error?.response?.status === 500 || error?.response?.status === 401) {
        setShouldLogout(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await Api.get("/getUser", {
        headers: { Authorization: token },
      });
      setUser(response.data.data);
    } catch (err) {
      console.error("Failed to fetch user data.");
    }
  };

  const nav = (id, name) => {
    localStorage.setItem("Id", JSON.stringify({ id, name }));
    navigate("/SubDashboard");
  };
  return (
    <div className="p-3 md:pl-6 md:pr-6 pt-1   min-h-screen font-[Urbanist]">
      {/* Welcome Section */}
      <div className="bg-white border-form border border-1px rounded-2xl col-span-full 2xl:col-span-7 card p-0">
        <div className="grid grid-cols-12 px-5 sm:px-12 py-11 relative overflow-hidden h-full">
          <div className="col-span-full md:col-span-7 self-center inline-flex flex-col 2xl:block">
            <p className="!leading-none text-sm lg:text-base text-[#999999] dark:text-dark-text">
              Today is <span className="today">{new Date().toDateString()}</span>
            </p>
            <h1 className="text-[#251F47] text-heading text-4xl xl:text-[42px] leading-[1.23] font-semibold mt-3 break-words whitespace-normal max-w-full">
              <span className="flex flex-wrap items-center">
                <span className="shrink-0">Welcome Back,</span>
                <span className="block">{user?.name}</span>
                <span className="select-none hidden md:inline-block animate-hand-wave origin-[70%_70%]">👋</span>
              </span>
            </h1>


            <button
              type="submit"
              onClick={() => setIsModalOpen(true)}
              className=" w-50 h-9 bg-[#795ded] cursor-pointer mt-5  transition-all duration-300 py-1 rounded-lg text-lg font-semibold text-white shadow-md"
              disabled={loading}
            >
              <i className="ri-add-line text-inherit"></i>
              Add new Category
            </button>
          </div>
          <div className="col-span-full md:col-span-5 flex-col items-center justify-center 2xl:block hidden md:flex">
            <img src="./Images/loti/loti-admin-dashboard.svg" alt="online-workshop" className="group-[.dark]:hidden" />
          </div>
          {/* Graphical Elements */}
          <ul>
            <li className="absolute -top-[30px] left-1/2 animate-spin-slow">
              <img src="./Images/element/graphical-element-1.svg" alt="element" />
            </li>
            <li className="absolute -bottom-[24px] left-1/4 animate-spin-slow">
              <img src="./Images/element/graphical-element-2.svg" alt="element" />
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white border-form border border-1px rounded-2xl card p-6 mt-3" >
        {/* New Category Button */}
        <div className="flex justify-between items-center  mb-4">
          <h2 className="text-lg text-[#251f47] font-bold tracking-wide">Categories</h2>
          {/* <button
          className="bg-[#3d5ee1] text-white px-4 py-2 rounded-lg hover:bg-[#18aefa] cursor-pointer transition"
          
        >
          + New Category
        </button> */}
        </div>

        {/* Loading State */}
        {loading && <p className="text-center text-gray-600">Loading categories...</p>}

        {/* Categories Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  onClick={() => nav(category._id, category.name)}
                  key={index}
                  className="bg-white p-4 border-1  rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg flex flex-col"
                >
                  <img
                    src={`${import.meta.env.VITE_IMAGE_PATH}${category.image.replace("./uploads", "uploads")}`}
                    alt={category.name}
                    className="w-full aspect-[20/16] object-cover rounded-lg"
                  />
                  <div className="flex-grow flex items-center justify-center">
                    <h2 className="text-sm text-[#251f47] sm:text-lg md:text-xl font-semibold mt-3 text-center ">
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
        <PopupComponet token={token} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} refreshcategory={fetchCategories} />
        {shouldLogout && <EmergencyLogout />}

        <Link to="/AddCategoryProduct">
          <button
            data-tooltip-id="Add-tooltip"
            data-tooltip-content="Add Product"
            aria-label="Add Category Product"
            className="fixed right-6 bottom-28 md:bottom-10 
                   bg-[#795ded] text-white p-3 px-4 rounded-full shadow-lg cursor-pointer  transition duration-300"
          >
            <i className="ri-add-line font-bold " style={{ fontSize: "22px" }}></i>

          </button>
        </Link>
        <Tooltip id="Add-tooltip" />
      </div>
    </div>
  );
};

export default DashboardComponent;