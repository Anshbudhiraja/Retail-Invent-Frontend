import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
const DefaultValueModal = ({ isOpen, onClose, onSave, values, setValues }) => {
    const [inputValue, setInputValue] = useState("");

    if (!isOpen) return null; // Don't render if not open

    // Add value to the list
    const handleAddValue = () => {
        if (inputValue.trim() !== "") {
            setValues([...values, inputValue.trim()]); // Add to values list
            setInputValue(""); // Clear input
        }
    };

    // Remove value from the list
    const handleRemoveValue = (index) => {
        const updatedValues = values.filter((_, i) => i !== index);
        setValues(updatedValues);
    };

    return (
        <div
        className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        >
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-lg font-bold mb-4">Set Default Values</h2>

                {/* Input Field */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full border border-gray-400 p-3 rounded-md focus:ring focus:ring-blue-300 outline-none text-gray-800"
                    placeholder="Enter default value..."
                />

                {/* Add Value Button */}
                <button
                    onClick={handleAddValue}
                    className="mt-2 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 w-full"
                >
                    ➕ Add Value
                </button>

                {/* List of Stored Default Values */}
                {values.length > 0 && (
                    <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-gray-100">
                        <ul className="space-y-2">
                            {values.map((val, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
                                >
                                    <span className="text-gray-700">{val}</span>
                                    <button
                                        onClick={() => handleRemoveValue(index)}
                                        className="bg-white-500 cursor-pointer text-red-600 px-3 py-1 text-sm rounded-md hover:bg-white-600 transition duration-300 cursor-pointer"
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 cursor-pointer bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DefaultValueModal;
