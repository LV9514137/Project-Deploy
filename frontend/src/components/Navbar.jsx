import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import { LogOut } from "lucide-react";

const Navbar = () => {

  const { navigate, setToken, token ,parts} = useContext(AppContext)

  const logoutHandler = () => {
    navigate("/login")
    localStorage.removeItem("Token")
    setToken("")
  }

  useEffect(() => {
    console.log("Token Changed:", token);
  }, [token]);

  return (
    <div className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 ">
      <h1 className="text-3xl font-bold text-blue-600 tracking-tight">
        Capacity Tracker
      </h1>
      <div className="flex justify-end items-center gap-3 text-2xl ">
        <span className="text-gray-700 font-bold text-red-600">
          Welcome:-  
        </span>
        <span className="text-gray-700 font-bold text-purple-700">
          {parts[0]?.supplier?.supplierName}
          
        </span>
        
        

        <button
          onClick={logoutHandler}
          className="w-11 h-11 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
};

export default Navbar;