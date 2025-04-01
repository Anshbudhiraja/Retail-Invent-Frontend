import { useContext, useEffect, useState } from "react";
import Sidebar from "../../../../Common/Components/Sidebar";
import Navbar from "../../../../Common/Components/Navbar";
import DashboardComponent from "../Components/DashboardComponent";
import "../../../../css/index.css";
import { useNavigate } from "react-router-dom";
import Api from "../../../../Api/InstanceApi";
import CommonComp from "../../../../Common/Components/CommonComp";
import AdminContext from "../../../AdminContext";
import EmergencyLogout from "../../../EmergencyLogout";

const Dashboard = () => {
  const [shouldLogout, setShouldLogout] = useState(false);
  const { token } = useContext(AdminContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate()
  const [newpassword, setNewpassword] = useState(false)
  const getPassInfo = async (token) => {
    try {
      const response = await Api.get('/checkUserPassword', {
        headers: {
          'Authorization': token
        }
      })
      if (response.data.data.status) {
        if (response?.data?.data?.required === "password") {
          setNewpassword(true)
        } else {
          console.log(response.data.message)
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 || error.response.status === 401) {
          setShouldLogout(true)
        }
        alert(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    }
  }
  useEffect(() => {
    const fetchData = async () => {

      if (!token) return;
      await getPassInfo(token);
    }
    fetchData()
  }, [token])
  return (


    <div>
      {
        newpassword ? (
          <CommonComp setNewpassword={setNewpassword} />
        ) : (<div className="flex bg-gray-100 min-h-screen">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          {/* Main Content */}
          <div
            className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "md:ml-[220px]" : "md:ml-[70px]"}`}
          >
            <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            {token && <DashboardComponent token={token} />}
          </div>
        </div>)
      }
      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default Dashboard;
