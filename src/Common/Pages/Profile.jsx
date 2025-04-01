import React, { useEffect, useState } from 'react'
import ProfileComp from '../Components/ProfileComp'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'


const Profile = () => {
    const [isSidebarOpen,setIsSidebarOpen]=useState(false)
    const [Token, setToken] = useState("")
        useEffect(() => {
            const Auth = JSON.parse(localStorage.getItem("Authorization"));
            if (!Auth?.token) {
                localStorage.clear();
                navigate("/", { replace: true });
                return;
            }
            setToken(Auth.token)
    
        }, [])
    return (
        <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
           {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

{/* Main Content */}
<div
  className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
>
                <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <ProfileComp Token={Token} />
            </div>
        </div>
    )
}

export default Profile