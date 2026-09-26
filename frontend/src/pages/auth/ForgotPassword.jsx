import React, { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const ForgotPassword = () => {

    const { backendUrl, loading, setLoading } = useContext(AppContext);

    const [email, setEmail] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.post(
                `${backendUrl}/api/v1/supplier/forgot-password`,
                { email }
            );

            toast.success(response.data.message);
            setEmail("");

        } catch (error) {
            
            console.log(error.response?.data);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center text-slate-800">
                    Forgot Password
                </h2>

                <p className="text-gray-500 text-center mt-2">
                    Enter your registered email.
                </p>

                <form
                    onSubmit={submitHandler}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default ForgotPassword;