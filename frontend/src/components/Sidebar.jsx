import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CirclePlus,
  Package,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-gray-900 text-white p-5 overflow-y-auto">

      <h2 className="text-2xl font-bold mb-8">
        Supplier Panel
      </h2>

      <div className="flex flex-col gap-4">

        <NavLink
          to="/supplier/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 ${
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-400"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/supplier/create-part"
          className={({ isActive }) =>
            `flex items-center gap-3 ${
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-400"
            }`
          }
        >
          <CirclePlus size={20} />
          Create Part
        </NavLink>

        <NavLink
          to="/supplier/my-parts"
          className={({ isActive }) =>
            `flex items-center gap-3 ${
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-400"
            }`
          }
        >
          <Package size={20} />
          My Parts
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;