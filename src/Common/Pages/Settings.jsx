import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import SettingsComp from '../Components/SettingsComp';
import { useEffect, useState } from 'react';

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
    <div className="flex flex-col md:flex-row  min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
      >
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="m-2">
          <SettingsComp Token={Token} />
        </div>
      </div>

    </div>
  )
}

export default Settings