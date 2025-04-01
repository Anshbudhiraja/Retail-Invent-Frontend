import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminContext from './AdminContext'

const AdminRouttes = () => {
    const navigate = useNavigate()
    const [data, setdata] = useState(null)
    useEffect(() => {
        const Auth = JSON.parse(localStorage.getItem("Authorization"))
        if (!Auth || !Auth.token) {
            localStorage.clear();
            alert("Unauthorised user")
            window.history.replaceState(null, null, "/")
            return navigate("/", { replace: true })
        }
        setdata(Auth?.token)
    }, [])
    return (
        <AdminContext.Provider value={{ "token": data }} >
            <Outlet />
        </AdminContext.Provider>
    )
}

export default AdminRouttes