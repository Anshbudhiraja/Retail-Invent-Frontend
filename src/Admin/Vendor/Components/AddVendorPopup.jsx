import React, { useState } from 'react'
import Api from '../../../Api/InstanceApi';
import EmergencyLogout from '../../EmergencyLogout';

const AddVendorPopup = ({ token, categoryId, refreshVendors, cancelVendor }) => {
    const [formData, setFormData] = useState({ name: '' });
    const [shouldLogout, setShouldLogout] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryId) {
            alert('wrong Category.');
            return;
        }

        try {
            const response = await Api.post(`/createVendor/${categoryId}`, formData, {
                headers: {
                    Authorization: token
                }
            });


            if (response.status === 201) {
                alert('Vendor added successfully!');
                refreshVendors();
                cancelVendor();
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
            cancelVendor()
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-65 bg-black/25">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Vendor</h2>
                <form className="grid gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-2">Name:</label>
                        <input
                            name="name"
                            type="text"
                            placeholder='enter name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 outline-none"
                        />
                    </div>

                    {/* Buttons Section */}
                    <div className="flex justify-between">
                        <button
                            onClick={cancelVendor}
                            type="button"
                            className="w-1/2 bg-gray-500 cursor-pointer text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-700 transition duration-300 mr-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="w-1/2 cursor-pointer bg-[#795ded] text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300"
                        >
                            Add Vendor
                        </button>
                    </div>
                </form>
            </div>
            {shouldLogout && <EmergencyLogout />}
        </div>
    )
}

export default AddVendorPopup