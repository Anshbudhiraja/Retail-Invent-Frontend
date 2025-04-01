import React, { useEffect, useState, useRef } from 'react';
import MobileVendorList from './MobileVendorList';
import { FaPlus, FaEllipsisV, FaEdit, FaTrash, FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Api from '../../../Api/InstanceApi';
import VendorPopup from './VendorPopup';
import AddVendorPopup from './AddVendorPopup';
import EmergencyLogout from '../../EmergencyLogout';

const VendorsComponent = ({ token }) => {
  const [search, setSearch] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);
  const [addVendor, setaddVendor] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const parseData = JSON.parse(localStorage.getItem('Id'));
    if (parseData && parseData.SubSubid) {
      setCategoryId(parseData.SubSubid);
      fetchVendors(parseData.SubSubid);
    }
  }, []);

  const fetchVendors = async (categoryId) => {
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
        setVendors([])
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

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(search.toLowerCase())
  );


  const handleDelete = async (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await Api.delete(`/deleteVendor/${vendorId}`, {
          headers: {
            Authorization: token
          }
        });
        fetchVendors(categoryId);
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
    }
  };

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  const getColorFromLetter = (letter) => {
    const gradients = [
      "bg-blue-400",
      "bg-green-400",
      "bg-yellow-400",
      "bg-red-400",
      "bg-purple-400",
    ];
    return gradients[letter.charCodeAt(0) % gradients.length];
  };
  return (
    <div className="m-3 md:m-6 mt-4 bg-white border-form border border-1px rounded-2xl card p-6  min-h-screen font-[Urbanist]" style={{ minHeight: "600px" }} >

      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        {/* Back Button */}
        <Link
          to="/Products"
          className="inline-flex items-center bg-[#795ded] text-white py-2 px-5 rounded-lg shadow-md transition"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </Link>

        {/* Search Bar - Hidden on Mobile, Visible on md+ */}
        <div className="hidden md:flex relative flex items-center bg-white p-2 rounded-full shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition w-[300px] md:w-[350px] lg:w-[400px]">
          {/* Search Icon */}
          <FaSearch className="text-gray-400 ml-3 mr-2 flex-shrink-0" />

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search Vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow flex-shrink-0 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none py-1 px-2 "
          />

          {/* Clear Button */}
          {search && (
            <button
              className="text-gray-500 cursor-pointer hover:text-red-500 transition shrink-0"
              onClick={() => setSearch("")}
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Add Vendor Button */}
        <button
          onClick={() => setaddVendor(true)}
          className="hidden lg:flex bg-[#795ded] cursor-pointer text-white rounded-lg transition py-2 px-5 items-center gap-2 cursor-pointer"
        >
          <FaPlus size={16} className="text-white" /> Add Vendor
        </button>

      </div>


      {loading ? (
        <p className="text-center py-5">Loading vendors...</p>
      ) : filteredVendors.length === 0 ? (
        <p className="text-center py-5 text-gray-600">No vendors found.</p>
      ) : (
        <>
          <MobileVendorList addVendor={() => setaddVendor(true)} token={token} vendors={vendors} fetchVendors={() => fetchVendors(categoryId)} />

          <div className="hidden md:block  ">
            {filteredVendors.length === 0 ? (
              <p className="text-gray-500 text-center">No vendors available</p>
            ) : (
              <div className="grid gap-4">
                {filteredVendors.map((vendor, index) => {
                  const initial = vendor.name.charAt(0).toUpperCase();
                  const bgColor = getColorFromLetter(initial);
                  return (
                    <div
                      key={vendor._id}
                      className="flex justify-between items-center p-4 bg-white border-1 border-gray-100 rounded-lg shadow-sm"
                    >

                      <div className='flex' >
                        <div className={`w-12 h-12 ${bgColor} text-white flex items-center justify-center rounded-full text-lg font-bold shadow-lg`}>
                          {initial}
                        </div>
                        <div className='pl-3' >
                          <h3 className="text-lg font-semibold text-gray-800">
                            {vendor.name}
                          </h3>
                          <p className="text-sm text-gray-500">Vendor #{index + 1}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditVendor(vendor)}
                          className="btn-icon cursor-pointer bg-purple-100 size-10 flex-center rounded-full  transition"
                        >
                          <i className="ri-edit-2-line text-purple-500 text-[15px] "></i>
                        </button>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          className="btn-icon cursor-pointer bg-red-100 size-10 flex-center rounded-full  transition"
                        >
                          <i className="ri-delete-bin-line text-red-500 text-[15px] "></i>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
      {editVendor && editVendor._id && (
        <VendorPopup token={token} editVendor={editVendor} refreshVendors={() => fetchVendors(categoryId)} cancelEdit={() => setEditVendor(null)} />
      )}
      {addVendor && (
        <AddVendorPopup token={token} refreshVendors={() => fetchVendors(categoryId)} cancelVendor={() => setaddVendor(false)} categoryId={categoryId} />
      )}

      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default VendorsComponent;
