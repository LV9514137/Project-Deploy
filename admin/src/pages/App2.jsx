import { Routes, Route, useLocation } from "react-router-dom";

import { AdminContext } from "./context/adminContext";
import Login from "./pages/Login";
import { useContext } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import SupplierDetails from "./pages/SupplierDetails";
import { AdminDashboard } from "./pages/AdminDashboard";
import AllParts from "./pages/AllParts";
import EditPart from "./pages/EditPart";
import { ViewPage } from "./pages/ViewPage";
import Home from "./pages/Home";
import OverdueParts from "./pages/OverdueParts";



function App() {

  const location = useLocation();
  const { token } = useContext(AdminContext)

  const isAuthPage =
    location.pathname === "/admin/login"

  return (
    <>

    
         {!isAuthPage && <AdminNavbar />}

    <div className="flex">

      {!isAuthPage && <AdminSidebar />}

      <main
        className={`flex-1 p-5 ${
          !isAuthPage ? "ml-64 mt-16" : ""
        }`}
      >

        <div className="flex-1 p-5">
          <Routes>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/suppliers" element={<SupplierDetails/>} />
            <Route path="/admin/dashboard" element={<AdminDashboard/>} />
            <Route path="/admin/all-parts" element={<AllParts/>} />
            <Route path="/admin/edit-part/:id" element={<EditPart/>}/>
            <Route path="/admin/view-part/:id" element={<ViewPage/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/overdue-parts" element={<OverdueParts/>}/>
            
          </Routes>
        </div>
          </main>
      </div>
    </>
  );
}

export default App;