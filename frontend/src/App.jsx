import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import CreatePart from "./pages/supplier/CreatePart";
import MyParts from "./pages/supplier/MyParts";
import EditPart from "./pages/supplier/EditPart";
import { SupplierDashboard } from "./pages/supplier/SupplierDashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { ViewPage } from "./pages/supplier/ViewPage";
import Loader from "./components/Loader";



function App() {

  const location = useLocation();
  const { token } = useContext(AppContext)

  const isAuthPage = [
  "/login",
  "/signup",
  "/forgot-password",
].includes(location.pathname);
    

  return (
    <>
      {!isAuthPage && <Navbar />}

      <div className="flex">
        {!isAuthPage && <Sidebar />}

        <div
          className={`flex-1 p-5 ${!isAuthPage ? "ml-64 mt-16" : ""
            }`}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/supplier/create-part" element={<CreatePart />} />
            <Route path="/supplier/my-parts" element={<MyParts />} />
            <Route path="/supplier/edit-part/:id" element={<EditPart />} />
            <Route path="/supplier/delete-part/:id" />
            <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
            <Route path="/supplier/view-part/:id" element={<ViewPage />} />
            <Route path="/" element={<Loader />} />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password/:token"
              element={<ResetPassword />}
            />



          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;