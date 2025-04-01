import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShowRate from "./ShowRate";
import ShowPurchase from "./ShowPurchase";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const RateModal = ({ totalPurchases, totalRates, productId, token, categoryId }) => {
  const [activeTab, setActiveTab] = useState("rate");

  return (
    <div className="flex flex-col items-center w-full bg-white shadow-lg rounded-lg p-4 mb-20 pb-20">
      {/* Header with Back Button */}
      <div className="w-full flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 mb-4">
        {/* Back Button (Aligned Left) */}
        <Link
          to="/products"
          className="flex items-center bg-[#795ded] text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-100 hover:text-[#795ded] font-semibold  transition w-auto max-w-[180px] sm:w-auto justify-center self-start"
        > 
          <FaArrowLeft className="mr-2" />
          <span className="hidden sm:inline">Back to Products</span>
          <span className="inline sm:hidden">Back</span>
        </Link>

        <div className="flex-1"></div>

        {/* Toggle Buttons (Centered on Mobile, Inline on Desktop) */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setActiveTab("rate")}
            className={`w-full cursor-pointer sm:w-auto flex items-center py-2 font-semibold px-6 rounded-lg shadow-md transition justify-center text-sm  ${activeTab === "rate"
              ? "bg-[#795ded] text-white"
              : "bg-purple-100  text-[#795ded] hover:bg-[#795ded] hover:text-white"
              }`}
          >
            Show Rate ({totalRates.totalRates})
          </button>
          <button
            onClick={() => setActiveTab("purchase")}
            className={`w-full cursor-pointer sm:w-auto flex items-center py-2 px-6 rounded-lg shadow-md transition justify-center text-sm font-semibold ${activeTab === "purchase"
              ? "bg-[#795ded] text-white"
              : "bg-purple-100  text-[#795ded] font-bold hover:bg-[#795ded] hover:text-white"
              }`}
          >
            Show Purchase ({totalPurchases.totalPurchases})
          </button>
        </div>
        <div className="flex-2"></div>
      </div>





      {/* Animated Content Section with Auto Height */}
      <div className="w-full bg-white relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
            layout
          >
            {activeTab === "rate" ? (
              <ShowRate totalRates={totalRates} categoryId={categoryId} token={token} productId={productId} />
            ) : (
              <ShowPurchase totalPurchases={totalPurchases} categoryId={categoryId} token={token} productId={productId} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RateModal;
