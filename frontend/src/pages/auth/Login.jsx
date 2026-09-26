import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {

  const [supplierCode, setSupplierCode] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl, setToken, token, navigate } = useContext(AppContext)

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/v1/supplier/login`, { supplierCode, password })
      toast.success(response.data.message);

      localStorage.setItem("Token", response.data.data.token)
      setToken(response.data.data.token)
      console.log("Token", response.data.data.token)
      navigate("/supplier/dashboard")

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }


    console.log({
      supplierCode,
      password
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">


      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6">
          Supplier Login
        </h2>

        <form
          onSubmit={submitHandler}
          className="space-y-4"
        >

          <div>
            <label className="block mb-2 font-medium">
              Supplier Code
            </label>

            <input
              type="text"
              placeholder="Enter Supplier Code"
              value={supplierCode}
              onChange={(e) =>
                setSupplierCode(e.target.value)
              }
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>
        <p className="text-center mt-4">
          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-1 hover:underline"
          >
            Sign Up
          </Link>
          <p className="text-right mt-2">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </p>

      </div>

    </div>
  );
};

export default Login;