import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";



const Signup = () => {
  const [supplierName, setSupplierName] = useState("");
  const [supplierCode, setSupplierCode] = useState("");
  const [password, setPassword] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { backendUrl, navigate } = useContext(AppContext)

  const submitHandler = async (e) => {
    e.preventDefault();

    const supplierData = {
      supplierName,
      supplierCode,
      password,
      contactPerson,
      email,
      phone,
      address,
    };
    console.log("Backend URL:", backendUrl);
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/supplier/register`,
        supplierData
      );

      toast.success(response.data.message);
      console.log(response.data)
      setSupplierName("");
      setSupplierCode("");
      setPassword("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setAddress("");
      navigate("/login")

    } catch (error) {

      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Supplier Registration
        </h2>

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Supplier Code"
            value={supplierCode}
            onChange={(e) => setSupplierCode(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Contact Person"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-3 rounded-lg md:col-span-2"
            rows="3"
          />

          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 md:col-span-2"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 ml-1 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;