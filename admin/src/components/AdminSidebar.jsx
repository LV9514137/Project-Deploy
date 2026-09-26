import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/adminContext";
import {
  LayoutDashboard,
  Package,
  Users,
  TriangleAlert,
  FileText,
} from "lucide-react";

const AdminSidebar = () => {

  const { supplierCode } = useContext(AdminContext)

  return (
    <div className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-gray-900 text-white p-5 overflow-y-auto">


      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>

      <div className="flex flex-col gap-4">

        <NavLink
          to={`/admin/dashboard${supplierCode !== "All"
              ? `?supplierCode=${supplierCode}`
              : ""
            }`}
          className={({ isActive }) =>
            `flex items-center gap-3 ${isActive
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/suppliers"
          className={({ isActive }) =>
            `flex items-center gap-3 ${isActive
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
            }`
          }
        >
          <Users size={20} />
          Suppliers
        </NavLink>

        <NavLink
          to="/admin/all-parts"
          className={({ isActive }) =>
            `flex items-center gap-3 ${isActive
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
            }`
          }
        >
          <Package size={20} />
          All Parts
        </NavLink>

        <NavLink
          to="/admin/overdue-parts"
          className={({ isActive }) =>
            `flex items-center gap-3 ${isActive
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
            }`
          }
        >
          <TriangleAlert size={20} />
          Overdue Parts
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 ${isActive
              ? "text-blue-400 font-semibold"
              : "hover:text-blue-400"
            }`
          }
        >
          <FileText size={20} />
          Reports
        </NavLink>

      </div>
    </div>
  );
};

export default AdminSidebar;