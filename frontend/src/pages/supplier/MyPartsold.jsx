import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyParts = () => {

    const navigate = useNavigate();

    const { backendUrl, token } = useContext(AppContext);
    const [parts, setParts] = useState([]);
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [locationFilter, setLocationFilter] = useState("All")
    console.log(statusFilter)
    const getParts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/part`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setParts(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deletePart = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this part?"
        );

        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${backendUrl}/api/v1/part/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            },)

            toast.success(response.data.message)
            console.log(response.data.data)
            getParts();
        } catch (error) {
            console.log(error)
        }
    }

    const filteredParts = parts.filter((part) => (
        part.partNo.toLowerCase().includes(search.toLowerCase()) ||
        part.partName.toLowerCase().includes(search.toLowerCase()) ||
        part.model.toLowerCase().includes(search.toLowerCase()))
        && (statusFilter === "All" || part.status === statusFilter) && (locationFilter === "All" || part.location === locationFilter)
    );

    useEffect(() => {
        getParts();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                My Parts
            </h1>

            <div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by Part No,Model or Part Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                >
                    <option value="All">All Locations</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Manesar">Manesar</option>
                    <option value="Kharkhoda">Kharkhoda</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Bangalore">Bangalore</option>

                </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="px-5 py-4 text-center font-semibold">Part No</th>
                            <th className="px-5 py-4 text-center font-semibold">Part Name</th>
                            <th className="px-5 py-4 text-center font-semibold">Model</th>
                            <th className="px-5 py-4 text-center font-semibold">Location</th>
                            <th className="px-5 py-4 text-center font-semibold">Gap</th>
                            <th className="px-5 py-4 text-center font-semibold">Status</th>
                            <th className="px-5 py-4 text-center space-x-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parts.length > 0 ? (
                            filteredParts.map((part) => (
                                <tr
                                    key={part._id}
                                    className="border-b hover:bg-blue-50 transition-all duration-200"
                                >
                                    <td className="px-5 py-4 text-gray-700">{part.partNo}</td>
                                    <td className="px-5 py-4 text-gray-700">{part.partName}</td>
                                    <td className="px-5 py-4 text-gray-700">{part.model}</td>
                                    <td className="px-5 py-4 text-gray-700">{part.location}</td>
                                    <td className="px-5 py-4 text-gray-700">{part.gap}</td>
                                    <td className="px-5 py-4 text-gray-700">{part.status}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => navigate(`/supplier/edit-part/${part._id}`)}
                                            className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white text-sm font-medium shadow"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deletePart(part._id)}
                                            className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-white text-sm font-medium shadow"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-8 text-gray-500 text-lg font-medium"
                                >
                                    No Parts Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyParts;