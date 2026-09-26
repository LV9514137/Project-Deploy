import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { FileSpreadsheet } from "lucide-react";
import Loader from "../../components/Loader";
import { useSearchParams } from "react-router-dom";

const MyParts = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const { backendUrl, token, getParts, parts, loading, setLoading } = useContext(AppContext);

    const [search, setSearch] = useState("")
    const statusFilter = searchParams.get("status") || "All"
    const locationFilter = searchParams.get("location") || "All"
    const modelFilter = searchParams.get("model") || "ALL"

    const filteredParts = parts.filter((part) => {
        const matchesSearch =
            part.partNo.toLowerCase().includes(search.toLowerCase()) ||
            part.partName.toLowerCase().includes(search.toLowerCase()) ||
            part.model.toLowerCase().includes(search.toLowerCase()) ||
            part.location.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || part.status === statusFilter;

        const matchesLocation =
            locationFilter === "All" || part.location === locationFilter;

        const matchesModel =
            modelFilter === "ALL" || part.model === modelFilter;    

        return matchesSearch && matchesStatus && matchesLocation && matchesModel
    });

    //Export to excel
    const exportToExcel = () => {
        const exportData = filteredParts.map((part) => ({
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

        getParts()


    }, []);
    if (loading) {
        return <Loader />
    }
    return (
        /* पूरे कंपोनेंट की हाइट फिक्स करके बाहरी स्क्रॉल बंद किया */
        <div className="h-[calc(100vh-120px)] w-full flex flex-col bg-slate-100 overflow-hidden">


            <div className="flex-none p-6 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">
                        My Parts
                    </h1>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow transition"
                    >
                        <FileSpreadsheet size={20} />
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Search & Filters - अपनी जगह फिक्स रहेगा */}
            <div className="flex-none px-6 mb-6">
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5">
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

            {/* Table Container - केवल यही एरिया अंदर ही अंदर स्क्रॉल होगा */}
            <div className="flex-1 min-h-0 overflow-auto px-6 pb-6">
                <div className="rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
                    {/* border-separate और border-spacing-0 लगाने से sticky थ्रेड्स परफेक्ट काम करते हैं */}
                    <table className="min-w-full table-auto border-separate border-spacing-0">

                        {/* Table Header Sticky */}
                        <thead className="sticky top-0 z-30">
                            <tr className="text-white">
                                {/* हर th पर bg-blue-600 और sticky top-0 सेट कर दिया है */}
                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Sr. No.
                                </th>

                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Part No
                                </th>
                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Part Name
                                </th>
                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Model
                                </th>
                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Location
                                </th>
                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Gap
                                </th>
                                <th className="sticky top-0 bg-blue-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Status
                                </th>
                                <th className="sticky top-0 bg-indigo-600 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap border-b border-slate-200">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {parts.length > 0 ? (
                                filteredParts.map((part, index) => (
                                    <tr
                                        key={part._id}
                                        className="border-b border-slate-200 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        <td className="px-6 py-4 text-center text-[15px] font-semibold text-slate-700 whitespace-nowrap border-b border-slate-100">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[15px] font-semibold text-slate-700 whitespace-nowrap border-b border-slate-100">
                                            {part.partNo}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[15px] font-medium text-slate-700 border-b border-slate-100">
                                            {part.partName}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[15px] font-semibold text-slate-700 border-b border-slate-100">
                                            {part.model}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[15px] font-medium text-slate-700 border-b border-slate-100">
                                            {part.location}
                                        </td>
                                        <td className="px-6 py-4 text-center border-b border-slate-100">
                                            <span className="inline-flex items-center justify-center min-w-[60px] rounded-full bg-red-100 px-4 py-1.5 text-red-600 font-bold text-sm">
                                                {part.gap}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center border-b border-slate-100">
                                            <span
                                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold
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
                                        <td className="px-6 py-4 border-b border-slate-100">
                                            <div className="flex justify-center items-center gap-3">
                                                <button
                                                    onClick={() => navigate(`/supplier/edit-part/${part._id}`)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/supplier/view-part/${part._id}`)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                                                >
                                                    <Eye size={18} />
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

export default MyParts;