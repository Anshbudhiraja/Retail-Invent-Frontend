import React, { useEffect, useState } from "react";
import Api from "../../../Api/InstanceApi";
import EmergencyLogout from "../../EmergencyLogout";
import DataTable from "react-data-table-component";
import { MdAttachMoney, MdInventory, MdShoppingCart } from "react-icons/md";
import { FaBox, FaCalendarAlt, FaMoneyBillWave, FaReceipt, FaUserTie } from "react-icons/fa";
const ShowRate = ({ productId, totalRates, onClose, token }) => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shouldLogout, setShouldLogout] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = totalRates.totalPages;
  const rowsPerPage = 10;
  useEffect(() => {
    if (productId) {
      fetchRates(currentPage + 1);
    }
  }, [productId, currentPage]);


  const fetchRates = async (page) => {
    setLoading(true);
    try {
      const response = await Api.get(`/getAllRates/${productId}?page=${page}`, {
        headers: { Authorization: token },
      });
      if (response.status === 202) {
        setRates(response.data.data);
      } else {
        setRates([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error?.response?.data?.message || error.message);
      if (error?.response?.status === 500 || error?.response?.status === 401) {
        setShouldLogout(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPagination = () => {
    let pages = [];
    if (pageCount <= 3) {
      return [...Array(pageCount)].map((_, index) => index);
    }
    if (currentPage === 0) {
      pages = [0, 1, 2, "...", pageCount - 1];
    } else if (currentPage === pageCount - 1) {
      pages = [0, "...", pageCount - 3, pageCount - 2, pageCount - 1];
    } else if (currentPage === 1) {
      pages = [0, 1, 2, "...", pageCount - 1];
    } else if (currentPage === pageCount - 2) {
      pages = [0, "...", pageCount - 3, pageCount - 2, pageCount - 1];
    } else {
      pages = [0, "...", currentPage - 1, currentPage, currentPage + 1, "...", pageCount - 1];
    }
    return pages;
  };


  return (
    <div className="w-full flex min-h-screen flex-col items-center">
      <div className="w-full max-w-lg  md:max-w-7xl">
        <h2 className="text-base font-bold text-center text-gray-800 mb-3">Rate History</h2>
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Fetching rates...</p>
        ) : rates.length > 0 ? (
          <>
            <div className="block md:hidden">
              <div className="space-y-4">
                {rates.map((rate, index) => (
                  <div
                    key={index}
                    className="bg-[#f6f4fe] p-4 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-200"
                  >
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold text-[#555555] flex items-center gap-2">
                        <FaUserTie className="text-[#555555]" />
                        {rate?.vendorId?.name || "N/A"}
                      </h3>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FaCalendarAlt className="text-gray-500" />
                        {/* {rate?.date ? new Date(rate.date).toLocaleString("en-GB", {
  weekday: "long",  // Full day name (e.g., Saturday)
  day: "2-digit",   // Two-digit day (e.g., 29)
  month: "long",    // Full month name (e.g., March)
  year: "numeric",  // Four-digit year (e.g., 2025)
  hour: "2-digit",  // Two-digit hour (e.g., 08)
  minute: "2-digit",// Two-digit minute (e.g., 30)
  second: "2-digit",// Two-digit second (e.g., 15)
  hour12: true      // 12-hour format with AM/PM
}) : "N/A"} */}

                      </span>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-3 text-sm">
                      <div className="flex space-x-3">
                        <p className="flex-1 flex items-center justify-between p-3 shadow-md rounded-lg bg-gray-50">
                          <span className="font-medium text-gray-700 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-500" /> Cost:
                          </span>
                          <span className="font-semibold text-gray-900">₹{rate?.cost || "0"}</span>
                        </p>

                        <p className="flex-1 flex items-center justify-between shadow-md p-3 rounded-lg bg-gray-50">
                          <span className="font-medium text-gray-700 flex items-center gap-2">
                            <FaBox className="text-blue-500" /> Stock:
                          </span>
                          <span className="font-semibold text-gray-900">{rate?.quantity || "0"}</span>
                        </p>
                      </div>

                      <p className="flex items-center justify-between shadow-md p-3 rounded-lg bg-gray-50">
                        <span className="font-medium text-gray-700 flex items-center gap-2">
                          <FaReceipt className="text-yellow-500" /> Other Charges:
                        </span>
                        <span className="font-semibold text-gray-900">₹{rate?.otherCharges || "0"}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>




            </div>



            <div className="w-full hidden md:block">
              <div className="w-full overflow-x-auto">
                <table className="table-auto border-collapse w-full whitespace-nowrap text-left text-gray-500 font-medium">
                  {/* Table Head */}
                  <thead>
                    <tr className="text-[#7f65ea]">
                      <th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg">
                        VENDOR NAME
                      </th>
                      <th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg">
                        DATE
                      </th>
                      <th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg">
                        COST (₹)
                      </th>
                      <th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg">
                        STOCK
                      </th>
                      <th className="p-6 py-4 bg-[#f2f4f9] first:rounded-l-lg last:rounded-r-lg">
                        OTHER CHARGES (₹)
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200">
                    {rates.length > 0 ? (
                      rates.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition">
                          <td className="p-6 py-4">
                            {row?.vendorId?.name || "N/A"}
                          </td>
                          <td className="p-6 py-4">
                            {row?.date ? new Date(row.date).toLocaleString("en-GB", {
                              day: "2-digit",   // Two-digit day (e.g., 29)
                              month: "long",    // Full month name (e.g., March)
                              year: "numeric",  // Four-digit year (e.g., 2025)
                              hour: "2-digit",  // Two-digit hour (e.g., 08)
                              minute: "2-digit",// Two-digit minute (e.g., 30)
                              second: "2-digit",// Two-digit second (e.g., 15)
                              hour12: true      // 12-hour format with AM/PM
                            }) : "N/A"}
                          </td>
                          <td className="p-6 py-4">
                            {row?.cost || "0"}
                          </td>
                          <td className="p-6 py-4">
                            {row?.quantity || "0"}
                          </td>
                          <td className="p-6 py-4">
                            {row?.otherCharges || "0"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-6 py-4 text-center text-gray-500">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
            {/* Pagination Controls for Mobile */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-10">

              <div className="font-spline_sans m-5 text-sm text-gray-600 dark:text-gray-400">
                Showing {currentPage + 1} of {totalRates.totalPages} Pages
              </div>
              <nav>
                <ul className="flex rounded-lg items-center space-x-2 md:space-x-1.5">
                  {/* Previous Button */}
                  <li className="border border-gray-200 rounded-lg md:rounded-md">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className={`flex cursor-pointer items-center justify-center w-9 h-9 md:w-7 md:h-7 rounded-lg md:rounded-md font-medium sm:text-sm md:text-xs transition-all duration-200
      ${currentPage === 0 ? "text-gray-400 cursor-not-allowed" : "bg-[#795ded] text-white hover:bg-[#684edb]"}`}
                    >
                      <i className="ri-arrow-left-s-line text-lg sm:text-base md:text-sm"></i>
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {getPagination().map((page, index) => (
                    <li className="border border-gray-200 rounded-lg md:rounded-md" key={index}>
                      {page === "..." ? (
                        <span className="flex items-center justify-center w-9 h-9 md:w-7 md:h-7 text-gray-700 dark:text-gray-300 sm:text-sm md:text-xs">
                          <i className="ri-more-fill text-lg sm:text-base md:text-sm"></i>
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`flex cursor-pointer items-center justify-center w-9 h-9 md:w-7 md:h-7 rounded-lg md:rounded-md font-medium sm:text-sm md:text-xs transition-all duration-200
          ${currentPage === page ? "bg-[#795ded] text-white" : "text-gray-700 hover:bg-gray-200"}`}
                        >
                          {page + 1}
                        </button>
                      )}
                    </li>
                  ))}

                  {/* Next Button */}
                  <li className="border border-gray-200 rounded-lg md:rounded-md">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pageCount - 1}
                      className={`flex items-center cursor-pointer justify-center w-9 h-9 md:w-7 md:h-7 rounded-lg md:rounded-md font-medium sm:text-sm md:text-xs transition-all duration-200
      ${currentPage === pageCount - 1 ? "text-gray-400 cursor-not-allowed" : "bg-[#795ded] text-white hover:bg-[#684edb]"}`}
                    >
                      <i className="ri-arrow-right-s-line text-lg sm:text-base md:text-sm"></i>
                    </button>
                  </li>
                </ul>



              </nav>
            </div>

          </>
        ) : (
          <p className="text-center text-red-500 font-medium mt-3">No Data Found</p>
        )}
      </div>
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default ShowRate;

