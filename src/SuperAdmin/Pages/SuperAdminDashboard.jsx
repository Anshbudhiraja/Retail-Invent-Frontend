import React, { useEffect, useState } from 'react'
import SuperAdminNavbar from '../Components/SuperAdminNavbar'
import SuperAdminComp from '../Components/SuperAdminComp'
import CommonComp from '../../Common/Components/CommonComp'
import { useNavigate } from 'react-router-dom'
import Api from '../../Api/InstanceApi'
import EmergencyLogout from '../../Admin/EmergencyLogout'

const SuperAdminDashboard = () => {
  const [Token, setToken] = useState(null)
  const navigate = useNavigate()
  const [shouldLogout, setShouldLogout] = useState(false);
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
      const Auth = JSON.parse(localStorage.getItem("Authorization"))
      if (!Auth && !Auth.token) {
        localStorage.clear();
        navigate("/")
      }
      await getPassInfo(Auth.token);
      setToken(Auth.token)
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">


        {/* Main Content */}
        <div className="transition-all duration-300    flex-1">
          {
            newpassword ? (
              <CommonComp setNewpassword={setNewpassword} />
            ) : (<>   <SuperAdminNavbar />
              <SuperAdminComp Token={Token} />
            </>)
          }
        </div>
      </div>

      {shouldLogout && <EmergencyLogout />}
    </div>

  )
}

export default SuperAdminDashboard