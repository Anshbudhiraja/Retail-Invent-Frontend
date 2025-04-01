import React from "react";

const MobileRateView = ({ rates, currentPage, pageCount, handlePageChange, getPagination }) => {
  return (
    <div className="block md:hidden">
      <div className="space-y-4">
        {rates.map((rate, index) => (
          <div key={index} className="bg-[#f4f6fe] p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-900">{rate?.vendorId?.name || "N/A"}</h3>
              <span className="text-xs text-gray-500">📅 {rate.date ? new Date(rate.date).toLocaleDateString() : "N/A"}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <p className="p-2 rounded-md bg-white text-center">💰 Cost: <span className="font-medium">₹{rate?.cost || "0"}</span></p>
              <p className="p-2 rounded-md bg-white text-center">📦 Stock: <span className="font-medium">{rate?.quantity || "0"}</span></p>
              <p className="p-2 rounded-md bg-white text-center col-span-2">🛒 Other Charges: <span className="font-medium">₹{rate?.otherCharges || "0"}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Pagination Controls for Mobile */}
      <div className="flex flex-wrap items-center justify-center gap-1 mt-4 overflow-x-auto whitespace-nowrap px-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 min-w-[32px] cursor-pointer border rounded-md bg-[#3d5ee1] text-white hover:bg-[#1cacfc] transition disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          Prev
        </button>
        {getPagination().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            className={`px-2 cursor-pointer py-1 min-w-[32px] border rounded-md transition text-xs ${currentPage === page ? "bg-[#1cacfc] text-white" : "bg-[#3d5ee1] text-white hover:bg-[#1cacfc]"}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          className="px-2 py-1 min-w-[32px] cursor-pointer border rounded-md bg-[#3d5ee1] text-white hover:bg-[#1cacfc] transition disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MobileRateView;
