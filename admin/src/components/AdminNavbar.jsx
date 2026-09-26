import React, { useContext } from "react";

import { useEffect } from "react";
import { AdminContext } from "../context/adminContext";
import { LogOut } from "lucide-react";


export const AdminNavbar = () => {
  const { navigate, setToken, token } = useContext(AdminContext)

  const logoutHandler = () => {
    navigate("/admin/login")
    localStorage.removeItem("adminToken")
    setToken("")
  }

  useEffect(() => {
    console.log("Token Changed:", token);
  }, [token]);

  return (
   <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50 flex items-center justify-between px-6">

    <h1 className="text-3xl font-bold text-blue-600">
      Capacity Tracker
    </h1>

    <button
      onClick={logoutHandler}
      className="w-11 h-11 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
    >
      <LogOut size={20} />
    </button>
</div>

);
}
export default AdminNavbar