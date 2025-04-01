import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Auth/Pages/Login';
import SuperAdminDashboard from './SuperAdmin/Pages/SuperAdminDashboard';
import Dashboard from './Admin/Category/1st Level/Pages/Dashboard';
import SubDashboard from './Admin/Category/2nd Level/Pages/SubDashboard';
import SubSubDashboard from './Admin/Category/3rd Level/Pages/SubSubDashboard';
import Products from './Admin/Product/Pages/Products';
import CreateFeilds from './Admin/Product/Pages/CreateFeilds';
import Vendors from './Admin/Vendor/Pages/Vendors';
import AddVendor from './Admin/Vendor/Pages/AddVendor';
import AdminRouttes from './Admin/AdminRouttes';
import CategoryTree from './Common/Pages/CategoryTree';
import ChangePass from './Common/Pages/ChangePass';
import Settings from './Common/Pages/Settings';
import Profile from './Common/Pages/Profile';
import RateModalPage from './Admin/Product/Pages/RateModalPage'

const App = () => {

  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path='/' />

          <Route path='/SuperAdminDashboard' element={<SuperAdminDashboard />}></Route>
          <Route path='/Superadmin' element={<Navigate to="/SuperAdminDashboard" replace />}></Route>

          <Route element={<AdminRouttes />} >
            <Route element={<Settings />} path='/Settings' />
            <Route element={<Dashboard />} path='/Admin' />
            {/* {/* <Route element={<Dashboard />} path='/' /> */}
            <Route element={<SubDashboard />} path='/SubDashboard' />
            <Route element={<SubSubDashboard />} path='/SubSubDashboard' />
            <Route element={<Products />} path='/Products' />
            <Route element={<CreateFeilds />} path='/CreateFeilds' />
            <Route element={<Vendors />} path='/Vendors' />
            <Route element={<AddVendor />} path='/AddVendor' />
            <Route element={<RateModalPage />} path='/Modal' />
            <Route element={<CategoryTree />} path='/AddCategoryProduct' />
            <Route element={<ChangePass />} path='/ChangePassword' />
            <Route element={<Profile />} path='/Profile' />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App