
import axios from "axios";
import React, { useContext, useState } from "react";
import { AdminContext } from "../context/adminContext";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    backendUrl,
    setToken,
    navigate,
    loading,
    setLoading,
  } = useContext(AdminContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/v1/admin/login`,
        { email, password }
      );

      localStorage.setItem("adminToken", response.data.data);

      setToken(response.data.data);

      toast.success(response.data.message);

      navigate("/admin/dashboard");

      // Loading will be stopped after dashboard data is loaded.
    } catch (error) {
      setLoading(false);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-4">
        <LoaderCircle
          size={48}
          className="animate-spin text-blue-600"
        />
        <p className="text-gray-700 font-medium">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Admin Login
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
              required
              disabled={loading}
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
