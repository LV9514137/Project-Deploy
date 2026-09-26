import React from 'react'




import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Pencil, Trash2, Eye, Target } from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import Loader from '../components/Loader';
import { useSearchParams } from "react-router-dom";



import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { AdminContext } from '../context/adminContext';

const AllParts = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    console.log("Status", status)

    const { backendUrl, token, getAllParts, parts, loading } = useContext(AdminContext);

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

    const location = searchParams.get("location");
    const model = searchParams.get("model");
    const supplierCode= searchParams.get("supplierCode")

    const filteredParts = parts.filter((part) => {

        const matchesSearch =
            part.partNo.toLowerCase().includes(search.toLowerCase()) ||
            part.partName.toLowerCase().includes(search.toLowerCase()) ||
            part.model.toLowerCase().includes(search.toLowerCase()) ||
            part.supplier.supplierCode.toLowerCase().includes(search.toLowerCase()) ||
            part.supplier.supplierName.toLowerCase().includes(search.toLowerCase()) ||
            part.location.toLowerCase().includes(search.toLowerCase())

        const matchesStatus =
            (status ? part.status === status :
                statusFilter === "All" || part.status === statusFilter)


        const matchesLocation =
            !location || part.location === location;

        const matchesModel=  
         !model || part.model === model;  

         const matchSupplierCode=
         !supplierCode || part.supplier.supplierCode === supplierCode

        return matchesSearch && matchesStatus && matchesLocation && matchesModel & matchSupplierCode
    });

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
            TargetDate: part.targetDate
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

    if (loading) {
        return <Loader />
    }
    return (
        <div className="min-h-screen bg-slate-100 p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-slate-800">
                    All Parts
                </h1>

                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow transition"
                >
                    <FileSpreadsheet size={20} />
                    Export Excel
                </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        type="text"
                        placeholder="🔍 Search Part No, Vendor, Model..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className=" overflow-hidden rounded-2xl  bg-white shadow-lg border border-slate-200">

                <div className="overflow-x-auto">

                    <table className="min-w-full ">

                        <thead>
                            <tr className="sticky top-0 z-10 bg-gradient-to-r  from-blue-600 to-indigo-600 text-white">

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
                                    Sr. No.
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Vendor Code
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Vendor Name
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Part No
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Part Name
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Model
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Location
                                </th>

                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Gap
                                </th>


                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    TargetDate
                                </th>
                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Status
                                </th>



                                <th className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">

                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {parts.length > 0 ? (

                                filteredParts.map((part, index) => (

                                    <tr
                                        key={part._id}
                                        className="border-b border-slate-200 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        <td className="px-6 py-5 text-center text-[14px] font-semibold text-slate-700">
                                            {index + 1}
                                        </td>

                                        <td className="px-6 py-5 text-center text-[14px] font-semibold text-slate-700 whitespace-nowrap">
                                            {part.supplier.supplierCode}
                                        </td>

                                        <td className="px-6 py-5 text-center text-[14px] font-medium text-slate-700 whitespace-nowrap">
                                            {part.supplier.supplierName}
                                        </td>

                                        <td className="px-6 py-5 text-center text-[14px] font-semibold text-slate-700 whitespace-nowrap">
                                            {part.partNo}
                                        </td>

                                        <td className="px-6 py-5 text-center text-[14px] font-medium text-slate-700">
                                            {part.partName}
                                        </td>

                                        <td className="px-6 py-5 text-center text-[14px] font-semibold text-slate-700">
                                            {part.model}
                                        </td>

                                        <td className="px-6 py-5 text-center text-[14px] font-medium text-slate-700">
                                            {part.location}
                                        </td>

                                        <td className="px-6 py-5 text-center ">
                                            <span className="text-[13px] inline-flex items-center justify-center min-w-[60px] rounded-full bg-red-100 px-4 py-2 text-red-600 font-bold text-sm">
                                                {part.gap}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className=" text-[13px] inline-flex items-center justify-center min-w-[60px] rounded-full bg-red-100 px-4 py-2 text-red-600 font-bold text-sm">
                                                {new Date(part.targetDate).toLocaleDateString("en-GB")}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-center">

                                            <span
                                                className={`text-[13px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold
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

                                        <td className="px-6 py-5">

                                            <div className="flex justify-center items-center gap-3">

                                                <button
                                                    onClick={() => navigate(`/admin/edit-part/${part._id}`)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    <Pencil size={15} />
                                                </button>

                                                <button
                                                    onClick={() => deletePart(part._id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                >
                                                    <Trash2 size={15} />
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/admin/view-part/${part._id}`)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    <Eye size={15} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="9"
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
