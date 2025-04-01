import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const FilterComponent = ({ onClose, options, applyFilters, existingFilters }) => {
    const [activeTab, setActiveTab] = useState(options[0]?.name || "");
    const [selectedFilters, setSelectedFilters] = useState(existingFilters || {});

    useEffect(() => {
        setSelectedFilters(existingFilters || {});
    }, [existingFilters]);

    const handleCheckboxChange = (category, value) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (!updatedFilters[category]) {
                updatedFilters[category] = [];
            }
            if (updatedFilters[category].includes(value)) {
                updatedFilters[category] = updatedFilters[category].filter((item) => item !== value);
            } else {
                updatedFilters[category].push(value);
            }
            return updatedFilters;
        });
    };

    const handleClearFilters = () => {
        setSelectedFilters({});
    };

    const handleApply = () => {
        applyFilters(selectedFilters);
        onClose();
    };

    return (
        <AnimatePresence>
            {/* Background Blur */}
            <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Filter Panel */}
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl overflow-hidden max-w-4xl mx-auto border border-gray-200 z-69 h-[75vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                    <button onClick={onClose} className="text-gray-600 cursor-pointer hover:text-[#795DED] transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex h-[50vh]">
                    {/* Sidebar Tabs */}
                    <div className="w-1/4 border-r bg-white overflow-y-auto">
                        {options.map((filter) => {
                            const selectedCount = selectedFilters[filter.name]?.length || 0;
                            return (
                                <div
                                    key={filter.name}
                                    className={`p-4 text-sm font-medium cursor-pointer transition-all text-center border-b 
                                        ${activeTab === filter.name
                                            ? "bg-[#795DED] text-white border-l-4 border-[#5D4CB8]"
                                            : "text-gray-800 hover:bg-gray-100"}`}
                                    onClick={() => setActiveTab(filter.name)}
                                >
                                    {filter.name} {selectedCount > 0 && `(${selectedCount})`}
                                </div>
                            );
                        })}
                    </div>

                    {/* Filter Values */}
                    <div className="w-3/4 p-6 overflow-y-auto bg-white">
                        {options.map(
                            (filter) =>
                                activeTab === filter.name && (
                                    <motion.div
                                        key={filter.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ul className="grid grid-cols-2 gap-4">
                                            {filter.values.map((value) => (
                                                <li key={value} className="flex items-center gap-2 mb-3">
                                                    <input
                                                        type="checkbox"
                                                        id={value}
                                                        className="w-4 h-4 accent-[#795DED]"
                                                        checked={selectedFilters[filter.name]?.includes(value) || false}
                                                        onChange={() => handleCheckboxChange(filter.name, value)}
                                                    />
                                                    <label htmlFor={value} className="text-sm cursor-pointer text-gray-800">
                                                        {value}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between p-4 border-t bg-white">
                    <button
                        className="px-6 py-2 bg-gray-100 cursor-pointer text-gray-800 rounded-md hover:bg-gray-200 transition"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 bg-[#795DED] cursor-pointer text-white rounded-md hover:bg-[#5D4CB8] transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FilterComponent;
