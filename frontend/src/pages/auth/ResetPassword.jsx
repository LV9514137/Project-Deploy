import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

export const ResetPassword = () => {

    const { backendUrl } = useContext(AppContext);

    const navigate = useNavigate();

    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await axios.post(
                `${backendUrl}/api/v1/supplier/reset-password/${token}`,
                {
                    password,
                    confirmPassword,
                }
            );

            toast.success(response.data.message);

            navigate("/login");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

                <h2 className="text-3xl font-bold text-center">
                    Reset Password
                </h2>

                <form
                    onSubmit={submitHandler}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>

        </div>
    );
};