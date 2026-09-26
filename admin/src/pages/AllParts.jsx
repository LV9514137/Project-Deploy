import React from 'react';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Pencil, Trash2, Eye, FileSpreadsheet } from "lucide-react";
import Loader from '../components/Loader';
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { AdminContext } from '../context/adminContext';

const AllParts = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");

    const { backendUrl, token, getAllParts, parts, loading } = useContext(AdminContext);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [locationFilter, setLocationFilter] = useState("All");

    const deletePart = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this part?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${backendUrl}/api/v1/part/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(response.data.message);
            getAllParts();
        } catch (error) {
            console.log(error);
        }
    };

    const location = searchParams.get("location");
    const model = searchParams.get("model");
    const supplierCode = searchParams.get("supplierCode");

    const filteredParts = parts.filter((part) => {
        const matchesSearch =
            part.partNo.toLowerCase().includes(search.toLowerCase()) ||
            part.partName.toLowerCase().includes(search.toLowerCase()) ||
            part.model.toLowerCase().includes(search.toLowerCase()) ||
            part.supplier.supplierCode.toLowerCase().includes(search.toLowerCase()) ||
            part.supplier.supplierName.toLowerCase().includes(search.toLowerCase()) ||
            part.location.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            status ? part.status === status : (statusFilter === "All" || part.status === statusFilter);

        const matchesLocationFilter = 
            locationFilter === "All" || part.location.toLowerCase() === locationFilter.toLowerCase();

        const matchesLocation = !location || part.location === location;
        const matchesModel = !model || part.model === model;
        const matchSupplierCode = !supplierCode || supplierCode === "All" || part.supplier.supplierCode === supplierCode;

        return matchesSearch && matchesStatus && matchesLocation && matchesModel && matchSupplierCode && matchesLocationFilter;
    });

    const exportToExcel = () => {
        const exportData = filteredParts.map((part) => ({
            VendorCode: part.supplier.supplierCode,
            VendorName: part.supplier.supplierName,
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
    };

    useEffect(() => {
        getAllParts();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        /* पूरे कंपोनेंट की हाइट को बची हुई स्क्रीन स्पेस (h-[calc(100vh-110px)]) में फिक्स कर दिया है ताकि बाहर स्क्रॉल न बने */
        <div className="h-[calc(100vh-110px)] flex flex-col bg-slate-100">
            
            {/* 1. FIXED TOP CONTAINER: हेडर और फिल्टर्स हमेशा ऊपर अपनी जगह पर लॉक रहेंगे */}
            <div className="flex-none bg-slate-100 pb-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-slate-800">All Parts</h1>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow transition whitespace-nowrap"
                    >
                        <FileSpreadsheet size={20} />
                        Export Excel
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-5">
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
            </div>

            {/* 2. SCROLLABLE CONTAINER: केवल यह टेबल वाला डिब्बा ऊपर-नीचे (Vertical) और दाएं-बाएं (Horizontal) स्क्रॉल होगा */}
            <div className="flex-1 overflow-auto bg-white rounded-2xl shadow-lg border border-slate-200 min-h-0 relative z-10">
                <table className="min-w-full table-auto border-collapse">
                    {/* Table Header: जब आप टेबल के अंदर नीचे स्क्रॉल करेंगे तो कॉलम नेम भी टॉप पर चिपके रहेंगे */}
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Sr. No.</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Vendor Code</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Vendor Name</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Part No</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Part Name</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Model</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Location</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Gap</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600">Target Date</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-indigo-600">Status</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-indigo-600">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredParts.length > 0 ? (
                            filteredParts.map((part, index) => (
                                <tr key={part._id} className="border-b border-slate-200 hover:bg-blue-50 transition-all duration-200">
                                    <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700 whitespace-nowrap">{part.supplier.supplierCode}</td>
                                    <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-700 whitespace-nowrap">{part.supplier.supplierName}</td>
                                    <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700 whitespace-nowrap">{part.partNo}</td>
                                    <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-700">{part.partName}</td>
                                    <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700">{part.model}</td>
                                    <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-700">{part.location}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[13px] inline-flex items-center justify-center min-w-[60px] rounded-full bg-red-100 px-4 py-1.5 text-red-600 font-bold text-sm">
                                            {part.gap}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[13px] inline-flex items-center justify-center min-w-[60px] rounded-full bg-blue-50 px-4 py-1.5 text-blue-600 font-bold text-sm">
                                            {part.targetDate ? new Date(part.targetDate).toLocaleDateString("en-GB") : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[13px] inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold
                                            ${part.status === "Completed" ? "bg-green-100 text-green-700" : part.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                                        >
                                            {part.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-3">
                                            <button onClick={() => navigate(`/admin/edit-part/${part._id}`)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition">
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => deletePart(part._id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition">
                                                <Trash2 size={15} />
                                            </button>
                                            <button onClick={() => navigate(`/admin/view-part/${part._id}`)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition">
                                                <Eye size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="py-10 text-center text-lg text-slate-500">No Parts Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AllParts;