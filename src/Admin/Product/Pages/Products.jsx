import React, { useContext, useEffect, useState } from "react";
import ProductsComponent from "../Components/ProductsComponent";
import Navbar from "../../../Common/Components/Navbar";
import Api from "../../../Api/InstanceApi";
import AddProductsComponent from "../Components/AddProductsComponent";
import Sidebar from "../../../Common/Components/Sidebar";
import { Link, parsePath } from "react-router-dom";
import AdminContext from "../../AdminContext";
import EmergencyLogout from "../../EmergencyLogout";
import { FaArrowLeft } from "react-icons/fa";

const Products = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { token } = useContext(AdminContext)
  const [addProductToogle, setaddProductToogle] = useState(false)
  const [vendors, setVendors] = useState([]);
  const [subSubCategory, setsubSubCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [PrivacyPassword, setPrivacyPassword] = useState(true)
  const [shouldLogout, setShouldLogout] = useState(false)
  const [ParseData, setParseData] = useState({})
  useEffect(() => {
    if (!token) return;
    const storedData = JSON.parse(localStorage.getItem("Id"));
    if (storedData?.SubSubid) {
      setParseData(storedData)
      setsubSubCategory(storedData.SubSubid)
      fetchVendors(storedData.SubSubid, token);
      fetchProduct(storedData.SubSubid, token);
      fetchPrivacyPassword(token);
    }
  }, [token]);


  const fetchPrivacyPassword = async (token) => {
    try {
      const response = await Api.get(`/fetchPrivacyPassword`, {
        headers: { Authorization: token },
      });
      if (response.status === 202) {
        setPrivacyPassword(response?.data?.data?.status);
      }
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };


  const fetchVendors = async (categoryId, token) => {
    try {
      const response = await Api.get(`/getAllVendors/${categoryId}`, {
        headers: {
          Authorization: token
        }
      });
      if (response.status === 202) {
        setVendors(response.data.data);
      }
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };

  const fetchProduct = async (SubSubid, token) => {
    const storedId = JSON.parse(localStorage.getItem("Id"));
    if (!storedId) {
      alert("Wrong Category");
      setLoading(false);
      return;
    }

    try {
      const response = await Api.get(`/getAllProducts/${SubSubid}`, {
        headers: {
          Authorization: token
        }
      });
      if (response.status !== 202) {
        alert("Something went wrong");
        setLoading(false);
        return;
      }
      setProducts(response.data.data);
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        setProducts([])
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
      >
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="mt-3" > {/* Added margin */}
          {addProductToogle ? (
            <AddProductsComponent
              refreshProducts={fetchProduct}
              products={products}
              loading={loading}
              token={token}
              subSubCategory={subSubCategory}
              cancel={() => setaddProductToogle(false)}
              vendors={vendors}
            />
          ) : (
            <ProductsComponent
              ParseData={ParseData}
              refreshProducts={fetchProduct}
              setProducts={setProducts}
              PrivacyPassword={PrivacyPassword}
              refreshPrivacyPassword={() => fetchPrivacyPassword(token)}
              products={products}
              loading={loading}
              token={token}
              subSubCategory={subSubCategory}
              addProductsToogle={() => setaddProductToogle(true)}
            />
          )}
        </div>

        {shouldLogout && <EmergencyLogout />}
      </div>
    </div>
  );

};

export default Products;
