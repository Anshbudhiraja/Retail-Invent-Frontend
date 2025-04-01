import React from 'react'
import CreateFeildsComponent from '../Components/CreateFeildsComponent'
import Navbar from '../../../Common/Components/Navbar'

const CreateFeilds = () => {

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">

      {/* Main Content */}
      <div className="transition-all duration-300  flex-1">
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <CreateFeildsComponent />
      </div>
    </div>
  )
}

export default CreateFeilds