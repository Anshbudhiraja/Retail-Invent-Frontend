import Sidebar from '../../../Common/Components/Sidebar'
import Navbar from '../../../Common/Components/Navbar'
import VendorsComponent from '../Components/VendorsComponent'
import { useContext, useState } from 'react'
import AdminContext from '../../AdminContext'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";

const Vendors = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { token } = useContext(AdminContext)

    if (!token) return;

    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
            >
                <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="">
                    <VendorsComponent token={token} />
                </div>
            </div>
        </div>
    )
}

export default Vendors