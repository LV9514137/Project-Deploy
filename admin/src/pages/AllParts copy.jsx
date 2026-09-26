import React from 'react'




import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { AdminContext } from '../context/adminContext';

const AllParts = () => {

    const navigate = useNavigate();

    const { backendUrl, token, getAllParts, parts } = useContext(AdminContext);

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [locationFilter, setLocationFilter] = useState("All")
    console.log(statusFilter)


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
            getAllParts();
        } catch (error) {
            console.log(error)
        }
    }

    const filteredParts = parts.filter((part) => (
        part.partNo.toLowerCase().includes(search.toLowerCase()) ||
        part.partName.toLowerCase().includes(search.toLowerCase()) ||
        part.model.toLowerCase().includes(search.toLowerCase())) ||
        part.supplier.supplierCode.toLowerCase().includes(search.toLocaleLowerCase()) ||
        part.supplier.supplierName.toLowerCase().includes(search.toLocaleLowerCase())
        && (statusFilter === "All" || part.status === statusFilter) && (locationFilter === "All" || part.location === locationFilter)
    );

    //Export to excel
    const exportToExcel = () => {
        const exportData = filteredParts.map((part) => ({
            VendorCode: part.supplier.supplierCode,
            VendorCode: part.supplier.supplierName,
            PartNo: part.partNo,
            PartName: part.partName,
            Model: part.model,
            Location: part.location,
            Gap: part.gap,
            Status: part.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Parts");

        XLSX.writeFile(workbook, "MyParts.xlsx");

        console.log(exportData);

        // yahan XLSX export code chalega
    };

    useEffect(() => {
        getAllParts()
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-6">

            {/* Heading */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-800">
                    My Parts

                </h1>
                <button
                    onClick={exportToExcel}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-md transition duration-200"
                >
                    📥 Export to Excel
                </button>
            </div>



            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        type="text"
                        placeholder="🔍 Search Part No,Part Name.Vendor or Model..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-[15px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                        <option value="All">All Locations</option>
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Manesar">Manesar</option>
                        <option value="Kharkhoda">Kharkhoda</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Bangalore">Bangalore</option>
                    </select>

                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-slate-200">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Vendor Code
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Vendor Name
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Part No
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Part Name
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Model
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Location
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Gap
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {parts.length > 0 ? (
                                filteredParts.map((part) => (
                                    <tr
                                        key={part._id}
                                        className="border-b hover:bg-slate-50 transition duration-200"
                                    >

                                        <td className="px-6 py-4 text-center text-slate-700 font-medium">
                                            {part.supplier.
                                                supplierCode
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-700 font-medium">
                                            {part.supplier.supplierName}
                                        </td>

                                        <td className="px-6 py-4 text-center text-slate-700 font-medium">
                                            {part.partNo}
                                        </td>

                                        <td className="px-6 py-4 text-center text-slate-700">
                                            {part.partName}
                                        </td>

                                        <td className="px-6 py-4 text-center text-slate-700">
                                            {part.model}
                                        </td>

                                        <td className="px-6 py-4 text-center text-slate-700">
                                            {part.location}
                                        </td>


                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                                                {part.gap}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold
                                                        ${part.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : part.status === "In Progress"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {part.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() => navigate(`/admin/edit-part/${part._id}`)}
                                                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                <button
                                                    onClick={() => deletePart(part._id)}
                                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="py-10 text-center text-lg text-slate-500"
                                    >
                                        No Parts Found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default AllParts
