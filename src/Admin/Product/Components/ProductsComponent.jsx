import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
import { FaPlus, FaTrash, FaDollarSign, FaWarehouse, FaEye, FaArrowLeft, FaFilter, FaSearch, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import EmergencyLogout from "../../EmergencyLogout";
import PassComp from "./PassComp";
import NewPassWordComp from "./NewPassWordComp";
import MobileProductList from "./MobileProductList";
import AddStockModal from "./AddStockModal";
import AddRateComp from "./AddRateComp";
import Api from "../../../Api/InstanceApi";
import { Tooltip } from "react-tooltip";
import FilterComponent from "./FilterComponent";

const ProductsComponent = ({ refreshPrivacyPassword, ParseData, refreshProducts, setProducts, PrivacyPassword, products, loading, token, addProductsToogle, subSubCategory }) => {
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [passToggle, setPassToggle] = useState(false);
  const [addStock, setAddStock] = useState(false);
  const [addRate, setAddRate] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);



  const openModal = (type, productId) => {
    setSelectedProductId(productId);
    if (type === "pass") setPassToggle(true);
    if (type === "stock") setAddStock(true);
    if (type === "rate") setAddRate(true);
  };

  const closeModal = (type) => {
    setSelectedProductId(null);
    if (type === "pass") setPassToggle(false);
    if (type === "stock") setAddStock(false);
    if (type === "rate") setAddRate(false);
  };

  const deleteProduct = async (productId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await Api.delete(`/deleteProduct/${productId}`, { headers: { Authorization: token } });
        refreshProducts(subSubCategory, token);
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      } catch (error) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true);
        }
      }
    }
  };

  const deleteAllProducts = async () => {
    const confirmDelete = await Swal.fire({
      title: "Delete All Products?",
      text: "This action will remove all products. Proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, delete all!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const resp = await Api.delete(`/deleteAllProducts/${subSubCategory}`, { headers: { Authorization: token } });
        setProducts([]);
        refreshProducts(subSubCategory, token);
        Swal.fire("Deleted!", resp.data.message, "success");
      } catch (error) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true);
        }
      }
    }
  };
  useEffect(() => {
    if (!token || !subSubCategory) return; // Prevent API call if missing params

    const fetchOptions = async () => {
      try {
        const response = await Api.get(`/getAllOptions/${subSubCategory}`, {
          headers: { Authorization: token }, // Ensure token format is correct
        });

        setOptions(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]); // Set empty if there's an error
      }
    };

    fetchOptions();
  }, [token, subSubCategory]);



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


  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters);
  };

  const getAppliedFilterCount = (filters) => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length; // Count multiple selections
      }
      return value ? count + 1 : count; // Count non-empty values
    }, 0);
  };
  const filterCount = getAppliedFilterCount(selectedFilters);

  return (
    <div className="md:ml-6 md:mr-6 md:pt-6   bg-white border-form border border-1px rounded-2xl card p-6  min-h-screen font-[Urbanist]" style={{ minHeight: "600px" }} >

      {/* Top Actions */}
      <div className="hidden md:flex justify-between items-center gap-4 pb-6 px-4 md:px-6 min-w-[710px] max-w-screen-lg xl:max-w-screen-xl w-full mx-auto">

        {
          ParseData.Subid ? (
            <Link to={'/SubSubDashboard'} >
              <button className="flex items-center cursor-pointer gap-2 bg-[#795ded] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-purple-200 transition duration-200 text-sm">
                <FaArrowLeft />
                <span>Back</span>
              </button>
            </Link>
          ) : ""
        }

        {/* Center Section: Search Bar */}
        <div className="flex-grow mx-4 w-full max-w-xl md:max-w-lg sm:max-w-md transition-all">
          <div className="relative flex items-center bg-white p-2 rounded-full shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <FaSearch className="text-gray-400 ml-3 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products by name, ID, or category..."
              className="flex-grow flex-shrink-0 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none py-1 px-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="text-gray-500 cursor-pointer hover:text-red-500 p-1 mr-2 flex-shrink-0 transition"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes />
              </button>
            )}
            {options.length > 0 && (
              <button
                className="flex cursor-pointer items-center bg-[#795ded] text-white py-1.5 px-3 rounded-full ml-2  transition duration-200 text-sm font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-1" />
                <span>Filters {filterCount > 0 && `(${filterCount})`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Vendor Button (Visible > 1024px) */}
          <Link to="/Vendors" className="hidden lg:block">
            <button className="flex cursor-pointer items-center gap-2 bg-purple-100 text-purple-600 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-purple-200 transition duration-200 text-sm">
              <FaPlus />
              <span>Vendors</span>
            </button>
          </Link>

          {/* Add Products Button */}
          <button
            onClick={addProductsToogle}
            className="flex items-center cursor-pointer justify-center bg-purple-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-purple-700 transition duration-200 text-sm lg:px-4"
          >
            <FaPlus className="mr-0 lg:mr-2" />
            <span className="hidden lg:inline">Add Product</span>
          </button>

          {/* Delete All Button */}
          <button
            onClick={deleteAllProducts}
            className="flex items-center cursor-pointer justify-center bg-red-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200 text-sm lg:px-4"
          >
            <FaTrash className="mr-0 lg:mr-2" />
            <span className="hidden lg:inline">Delete All</span>
          </button>
        </div>
      </div>






      {loading ? (
        <p className="text-center py-5 text-gray-500 dark:text-gray-300">Loading products...</p>
      ) : (
        <>
          <div className="md:hidden">
            <MobileProductList
              options={options}
              setOptions={options}
              deleteAllProducts={deleteAllProducts}
              refreshProducts={refreshProducts}
              token={token}
              subSubCategory={subSubCategory}
              products={products}
              deleteProduct={deleteProduct}
              addProduct={addProductsToogle}
              openStockModal={(id) => openModal("stock", id)}
              openPassModal={(id) => openModal("pass", id)}
              openRateModal={(id) => openModal("rate", id)}
            />
          </div>
          <div className="hidden md:block overflow-x-auto bg-white  ">
            <table className="table-auto border-collapse w-full whitespace-nowrap text-left text-gray-500 font-medium">
              {/* Table Head */}
              <thead>
                <tr className="text-[#7f65ea]">

                  <th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg w-10">
                    #
                  </th>
                  {filteredProducts.length > 0 &&
                    Object.keys(filteredProducts[0])
                      .filter((key) =>
                        !["_id", "subSubCategory", "oldStock", "newStock", "userId", "createdAt", "updatedAt", "__v", "options"].includes(key) &&
                        (key !== "size" || filteredProducts[0].size !== null) // Exclude 'size' if it's null
                      )
                      .map((key) => (
                        <th
                          key={key}
                          className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg"
                        >
                          {key.replace(/_/g, " ").toUpperCase()}
                        </th>
                      ))}

                  {filteredProducts.length > 0 &&
                    options?.length > 0 &&
                    options.slice(0, 7).map((opt, index) => ( // Slice to limit to 7 items
                      <th
                        key={index}
                        className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg"
                      >
                        {opt?.name?.toUpperCase()}
                      </th>
                    ))}
                  {
                    products.length > 0 ? (<th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg w-10">
                      Action
                    </th>) : ""
                  }

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className=" divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product._id} className="hover:bg-gray-100 transition">
                      <td className="p-6 py-4" >{index + 1}</td>
                      {Object.keys(product)
                        .filter((key) =>
                          !["_id", "subSubCategory", "oldStock", "newStock", "userId", "createdAt", "updatedAt", "__v", "options"].includes(key) &&
                          (key !== "size" || product.size !== null) // Exclude 'size' if it's null
                        )
                        .map((key) => (
                          <td key={key} className="p-6 py-4">
                            {product[key] || "N/A"}
                          </td>
                        ))}

                      {options?.length > 0 &&
                        options.slice(0, 7).map((opt, i) => (
                          <td key={i} className="p-6 py-4">
                            {product?.options?.[opt.name] || "N/A"}
                          </td>
                        ))}
                      <td className="p-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            data-tooltip-id="delete-tooltip"
                            data-tooltip-content="Delete Product"
                            onClick={() => deleteProduct(product._id)}
                            className="btn-icon cursor-pointer bg-red-100 size-7 flex-center rounded-full  transition"
                          >
                            <i className="ri-delete-bin-line text-red-500 text-[12px] "></i>
                          </button>

                          <button
                            data-tooltip-id="rate-tooltip"
                            data-tooltip-content="Add Rate"
                            onClick={() => openModal("rate", product._id)}
                            className="btn-icon cursor-pointer btn-primary-icon-light bg-[#e4dffb] size-7 flex-center rounded-full  transition"
                          >
                            <i className="ri-money-dollar-circle-line text-[#917bf0] text-[13px]"></i>
                          </button>
                          <button
                            data-tooltip-id="stock-tooltip"
                            data-tooltip-content="Add Stock"
                            onClick={() => openModal("stock", product._id)}
                            className="btn-icon cursor-pointer btn-success-icon-light bg-green-200 size-7 flex-center rounded-full  transition"
                          >
                            <i className="ri-store-2-line text-green-700 text-[13px]"></i>
                          </button>
                          <button
                            data-tooltip-id="view-tooltip"
                            data-tooltip-content="Privacy"
                            onClick={() => openModal("pass", product._id)}
                            className="btn-icon cursor-pointer btn-info-icon-light bg-gray-300 size-7 flex-center rounded-full  transition"
                          >
                            <i className="ri-eye-line text-gray-600 text-[13px]"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="100%" className="p-6 py-4 text-center text-gray-500">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>


            <Tooltip id="delete-tooltip" />
            <Tooltip id="rate-tooltip" />
            <Tooltip id="stock-tooltip" />
            <Tooltip id="view-tooltip" />
          </div>



        </>
      )}

      {/* Modals */}
      {passToggle && (PrivacyPassword ? <PassComp categoryId={subSubCategory} productId={selectedProductId} onClose={() => closeModal("pass")} token={token} /> : <NewPassWordComp refreshPrivacyPassword={refreshPrivacyPassword} onClose={() => closeModal("pass")} token={token} />)}
      {addStock && <AddStockModal refreshProducts={() => refreshProducts(subSubCategory, token)} productId={selectedProductId} onClose={() => closeModal("stock")} token={token} categoryId={subSubCategory} />}
      {addRate && <AddRateComp refreshProducts={() => refreshProducts(subSubCategory, token)} productId={selectedProductId} onClose={() => closeModal("rate")} token={token} categoryId={subSubCategory} />}
      {showFilters && options.length > 0 && (
        <FilterComponent onClose={() => setShowFilters(false)} options={options} applyFilters={handleApplyFilters} existingFilters={selectedFilters} />
      )}
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default ProductsComponent;
