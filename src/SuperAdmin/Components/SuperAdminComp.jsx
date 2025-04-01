import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Api from "../../Api/InstanceApi";
import AddUserModal from "./AddUserModal";
import EmergencyLogout from "../../Admin/EmergencyLogout";

const SuperAdminComp = ({ Token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    if (Token) {
      fetchUsers();
    }
  }, [Token]);


  const fetchUsers = async () => {
    if (!Token) return; // Prevent API call if Token is not available

    setLoading(true);
    try {
      const response = await Api.get("/getallusers", {
        headers: { Authorization: Token },
      });

      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log("No response from server");
      } else {
        console.log("An unexpected error occurred");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };


  const toggleService = async (id, value) => {
    const endpoint = value ? `/enableUser/${id}` : `/disableUser/${id}`;
    try {
      await Api.put(endpoint, {}, { headers: { Authorization: Token } });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, service: value } : user
        )
      );
    } catch (error) {
      if (error?.response) {
        if (error?.response?.status === 500 || error?.response?.status === 401) {
          setShouldLogout(true); // Trigger EmergencyLogout
        }
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row?.name || "N/A", sortable: true },
    { name: "Phone", selector: (row) => row?.phone || "N/A", sortable: true },
    { name: "Email", selector: (row) => row?.email || "N/A", sortable: true },
    { name: "Address", selector: (row) => row?.address || "N/A" },
    { name: "City", selector: (row) => row?.city || "N/A", sortable: true },
    { name: "State", selector: (row) => row?.state || "N/A", sortable: true },
    { name: "Role", selector: (row) => row?.role || "N/A", sortable: true },
    {
      name: "Service",
      cell: (row) => (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row?.service || false}
            onChange={(e) => toggleService(row._id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 relative transition-all duration-300 shadow-md">
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 ${row?.service ? "left-7" : "left-1"
                }`}
            ></div>
          </div>
        </label>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Users
      </h2>

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 cursor-pointer px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        Add User
      </button>

      <div className="rounded-lg shadow-xl bg-white p-4">
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {showModal && (
        <AddUserModal
          Token={Token}
          onClose={() => setShowModal(false)}
          onUserAdded={fetchUsers}
        />
      )}

      {shouldLogout && <EmergencyLogout />}
    </div>
  );
};

export default SuperAdminComp;
