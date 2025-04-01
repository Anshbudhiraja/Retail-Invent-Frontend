import React, { useEffect, useRef, useState } from "react";
import { FaPlus, FaSearch, FaTrash, FaDollarSign, FaWarehouse, FaFilter, FaEllipsisV, FaBoxes, FaTag, FaEye, FaArrowLeft, FaTimes } from "react-icons/fa";
import FilterComponent from "./FilterComponent";
import Api from "../../../Api/InstanceApi";
import { Link } from 'react-router-dom'

const MobileProductList = ({ refreshProducts, deleteAllProducts, subSubCategory, token, deleteProduct, openPassModal, openStockModal, openRateModal, products, addProduct }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [activeMenu, setActiveMenu] = useState(null);

    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest(".menu-toggle")) {
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await Api.get(`/getAllOptions/${subSubCategory}`, {
                    headers: { Authorization: token }
                });

                setOptions(response.status === 202 && response.data?.data ? response.data.data : []);
            } catch (error) {
                console.log(error)
                alert("Error fetching options!");
                setOptions([]);
            }
        };
        fetchOptions();
    }, [token, subSubCategory]);

    const handleApplyFilters = (filters) => setSelectedFilters(filters);
    const toggleMenu = (id) => {
        setActiveMenu(prevMenu => (prevMenu === id ? null : id));
    };

    const filteredProducts = products
        .filter((product) =>
            Object.entries(selectedFilters).every(([key, values]) =>
                !values.length || values.includes(product.options?.[key])
            )
        )
        .filter((product) =>
            Object.values(product).some(
                (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    return (
        <div className="block md:hidden space-y-6 relative pb-24 ">
            <Link to="/SubSubDashboard" className="inline-flex items-center bg-[#795ded] text-white py-2 px-5 rounded-lg shadow-md  transition">
                <FaArrowLeft className="mr-2" />
                <span>Back</span>
            </Link>
            {/* Search & Filter Bar */}
            {/* Search & Filter Bar */}
            <div className="flex items-center bg-white p-2 md:p-4 rounded-full shadow-lg border border-gray-200 gap-2 md:gap-3 w-full max-w-xl mx-auto transition-all duration-300 hover:shadow-xl">
                {/* Search Input Wrapper */}
                <div className="relative flex items-center px-3 py-2 w-full min-w-0 border border-gray-200 rounded-full bg-gray-50 focus-within:ring-2 focus-within:ring-[#3d5ee1] focus-within:border-transparent transition-all duration-200">
                    <FaSearch className="text-gray-500 mr-2 shrink-0 w-5 h-5" />

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-grow text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none min-w-0 text-sm md:text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                        <button
                            className="ml-2 p-1 text-gray-500 cursor-pointer hover:text-red-500 transition-colors duration-200 shrink-0"
                            onClick={() => setSearchTerm("")}
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter Button (Only if options exist) */}
                {options.length > 0 && (
                    <button
                        className="p-2 md:p-3 bg-[#795ded] cursor-pointer text-white rounded-full shadow-md hover:bg-[#2c4db7] active:bg-[#1e3c8f] transition-all duration-200 shrink-0 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3d5ee1] focus:ring-opacity-50"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FaFilter className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                )}

                {/* Delete All Button */}
                <button
                    className="btn-icon p-1 px-2 cursor-pointer bg-red-100  flex-center rounded-full  transition"
                    onClick={deleteAllProducts}
                >
                    <i className="ri-delete-bin-line cursor-pointer text-red-500 text-[22px] "></i>

                </button>
            </div>

            {/* Filters Component */}
            {showFilters && options.length > 0 && (
                <FilterComponent onClose={() => setShowFilters(false)} options={options} applyFilters={handleApplyFilters} />
            )}

            {/* Product List */}
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                    const stock = product.totalStock || 0;
                    const stockColor = stock > 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";

                    return (
                        <div key={index} className="relative bg-[#f6f4fe] shadow-lg rounded-xl p-5 border border-gray-200 transition hover:shadow-xl">
                            {/* Product Name */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name || "Unnamed Product"}</h3>

                            {/* Product Details Grid */}
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                {/* 🔥 Stock Section (Dynamic Color) */}
                                <div className={`flex items-center space-x-2 p-3 rounded-lg ${stockColor}`}>
                                    <FaBoxes className="text-xl" />
                                    <div>
                                        <p className="text-base font-semibold">{stock}</p>
                                    </div>
                                </div>

                                {/* 💰 Price Section */}
                                <div className="flex items-center space-x-2 bg-purple-100 p-3 rounded-lg">
                                    <FaTag className="text-[#795ded] text-xl" />
                                    <div>
                                        <p className="text-xl font-semibold text-[#795ded]">₹{product.price || "N/A"}</p>
                                    </div>
                                </div>

                                {Object.entries(product.options || {}).map(([key, value], idx) => (
                                    <Detail key={idx} label={key.replace(/_/g, " ")} value={value || "N/A"} />
                                ))}
                            </div>

                            {/* Three Dots Button (⋮) */}
                            <button
                                onClick={() => toggleMenu(product._id)}
                                className="absolute top-3 cursor-pointer right-3 text-gray-500 hover:text-gray-700 transition p-2 menu-toggle"
                            >
                                <FaEllipsisV size={18} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenu === product._id && (
                                <DropdownMenu
                                    dropdownRef={dropdownRef}
                                    onClose={() => setActiveMenu(null)}
                                    actions={[
                                        { label: "Delete", icon: <i className="ri-delete-bin-line text-red-500 text-[12px]"></i>, color: "text-red-600", onClick: () => deleteProduct(product._id) },
                                        { label: "Manage Stock", icon: <i className="ri-building-line text-blue-500 text-[12px]"></i>, color: "text-blue-600", onClick: () => openStockModal(product._id) },
                                        { label: "Rate", icon: <i className="ri-money-dollar-circle-line text-blue-500 text-[12px]"></i>, color: "text-blue-600", onClick: () => openRateModal(product._id) },
                                        { label: "Privacy", icon: <i className="ri-shield-keyhole-line text-green-500 text-[12px]"></i>, color: "text-green-600", onClick: () => openPassModal(product._id) },
                                    ]}
                                />
                            )}

                        </div>
                    );
                })
            ) : (
                <p className="text-center py-5 text-gray-500">No products found.</p>
            )}

            {/* Floating Add Product Button */}
            <button
                onClick={addProduct}
                className="fixed bottom-27 cursor-pointer right-6 bg-[#795ded] text-white p-5 rounded-full shadow-lg hover:bg-[#18aefa] transition duration-300 cursor-pointer"
            >
                <FaPlus size={22} />
            </button>
        </div>
    );
};

const Detail = ({ label, value, className = "text-gray-600" }) => (
    <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900 capitalize">{label}:</span>
        <span className={`text-lg font-semibold ${className}`}>{value}</span>
    </div>
);


const DropdownMenu = ({ onClose, actions, dropdownRef }) => (
    <div ref={dropdownRef} className="absolute top-12 right-3 bg-white shadow-xl border border-gray-200 rounded-md p-3 w-48 z-10 space-y-3">
        {actions.map((action, idx) => (
            <button
                key={idx}
                onClick={() => {
                    action.onClick();
                    onClose();
                }}
                className={`w-full flex items-center cursor-pointer space-x-2 px-4 py-3 hover:bg-gray-100 rounded-md ${action.color}`}
            >
                {action.icon} <span>{action.label}</span>
            </button>
        ))}
    </div>
);

export default MobileProductList;
