import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Api from "../../Api/InstanceApi";
import { useNavigate } from "react-router-dom";

const CategoryTree = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categories, setCategories] = useState(null);
    const [selectedMain, setSelectedMain] = useState("");
    const [selectedSub, setSelectedSub] = useState("");
    const [selectedSubSub, setSelectedSubSub] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const Auth = JSON.parse(localStorage.getItem("Authorization"));
        if (!Auth?.token) {
            localStorage.clear();
            navigate("/", { replace: true });
            return;
        }

        const fetchCategories = async () => {
            try {
                const response = await Api.get("/categories", {
                    headers: {
                        Authorization: Auth.token,
                    },
                });

                if (response.status === 202) {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [navigate]);

    const handleNext = () => {
        if (selectedSubSub) {
            const subSubId = categories[selectedMain]?.subCategories[selectedSub]?.subSubCategories[selectedSubSub]?.id;
            if (subSubId) {
                localStorage.setItem("Id", JSON.stringify({ SubSubid: subSubId }));
                navigate('/Products');
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}>
                <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="m-6 mt-1 bg-white border border-gray-300 rounded-2xl p-6 min-h-screen font-[Urbanist]"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Your Category</h2>
                    {categories ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border border-gray-300 p-4 rounded-lg">
                                <label className="block font-semibold text-gray-700 mb-2">Main Category:</label>
                                <select
                                    className="border p-3 w-full rounded-lg bg-gray-50 shadow-sm hover:bg-white transition ease-in-out"
                                    value={selectedMain}
                                    onChange={(e) => {
                                        setSelectedMain(e.target.value);
                                        setSelectedSub("");
                                        setSelectedSubSub("");
                                    }}
                                >
                                    <option value="">Select</option>
                                    {Object.keys(categories).map((mainCategory) => (
                                        <option key={mainCategory} value={mainCategory}>
                                            {categories[mainCategory].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedMain && categories[selectedMain]?.subCategories && (
                                <div className="border border-gray-300 p-4 rounded-lg">
                                    <label className="block font-semibold text-gray-700 mb-2">Subcategory:</label>
                                    <select
                                        className="border p-3 w-full rounded-lg bg-gray-50 shadow-sm hover:bg-white transition ease-in-out"
                                        value={selectedSub}
                                        onChange={(e) => {
                                            setSelectedSub(e.target.value);
                                            setSelectedSubSub("");
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {Object.keys(categories[selectedMain].subCategories).map((subCategory) => (
                                            <option key={subCategory} value={subCategory}>
                                                {categories[selectedMain].subCategories[subCategory].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {selectedSub && categories[selectedMain]?.subCategories?.[selectedSub]?.subSubCategories && (
                                <div className="border border-gray-300 p-4 rounded-lg">
                                    <label className="block font-semibold text-gray-700 mb-2">Sub-Subcategory:</label>
                                    <select
                                        className="border p-3 w-full rounded-lg bg-gray-50 shadow-sm hover:bg-white transition ease-in-out"
                                        value={selectedSubSub}
                                        onChange={(e) => setSelectedSubSub(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {Object.keys(categories[selectedMain].subCategories[selectedSub].subSubCategories).map((subSubCategory) => (
                                            <option key={subSubCategory} value={subSubCategory}>
                                                {categories[selectedMain].subCategories[selectedSub].subSubCategories[subSubCategory].name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center text-gray-500">
                            Loading categories...
                        </motion.p>
                    )}
                    {selectedSubSub && (
                        <motion.button
                            className="mt-6 w-full cursor-pointer bg-[#795ded] text-white py-3 rounded-lg shadow-md  transition"
                            onClick={handleNext}
                        >
                            Next
                        </motion.button>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CategoryTree;
