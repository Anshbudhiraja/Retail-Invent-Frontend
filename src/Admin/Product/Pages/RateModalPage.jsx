import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RateModal from "../Components/RateModal";
import Navbar from "../../../Common/Components/Navbar";
import Sidebar from "../../../Common/Components/Sidebar";
import Api from "../../../Api/InstanceApi"; // Ensure this is the correct API instance

const RateModalPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [productId, setProductId] = useState("");
  const [token, setToken] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [totalPurchases, setTotalPurchases] = useState({});
  const [totalRates, setTotalRates] = useState({});

  useEffect(() => {
    const parseData = JSON.parse(localStorage.getItem("PrivacyAuthorization"));
    if (parseData) {
      setProductId(parseData.productId || "");
      setCategoryId(parseData.categoryId || "");
      setToken(parseData.token || "");
    }
  }, []);

  useEffect(() => {
    if (productId && token) {
      getTotalPurchase();
      getTotalRatePages();
    }
  }, [productId, token]);

  const getTotalPurchase = async () => {
    try {
      const response = await Api.get(`/getTotalPurchasePages/${productId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 202) {
        setTotalPurchases(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching total purchases:", error.response?.data?.message || error.message);
    }
  };

  const getTotalRatePages = async () => {
    try {
      const response = await Api.get(`/getTotalRatePages/${productId}`, {
        headers: { Authorization: token },
      });
      if (response.status === 202) {
        setTotalRates(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching total rates:", error.response?.data?.message || error.message);
    }
  };


  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
      >
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="m-3 md:m-7 mt-4">
          <RateModal totalPurchases={totalPurchases} totalRates={totalRates} token={token} categoryId={categoryId} productId={productId} />
        </div>
      </div>
    </div> 
  );
};

export default RateModalPage;
