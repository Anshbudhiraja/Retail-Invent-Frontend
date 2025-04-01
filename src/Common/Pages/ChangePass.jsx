import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Navbar from '../Components/Navbar'
import ChangePassword from '../Components/ChangePassword'

const ChangePass = () => { 
    const [Token,setToken]=useState(null)
    const [isSidebarOpen,setIsSidebarOpen]=useState(false)
    
    useEffect(() => {
        const authData = localStorage.getItem("Authorization");

        if (!authData) {
            setLoading(false);
            return;
        }

        const Auth = JSON.parse(authData);
        if (!Auth?.token) {
            setLoading(false);
            return;
        }
        setToken(Auth?.token)
        


    }, []);
    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

{/* Main Content */}
<div
  className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
>
                <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className='p-3' >
                <ChangePassword Token={Token} />

                </div>
            </div>
        </div>
    )
}

export default ChangePass