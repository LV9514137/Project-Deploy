
import React, { useState } from "react";

import {
    TableProperties,
    Search,
    Download
} from "lucide-react";

const SupplierCapacityTable = ({ capacityData = [] }) => {

    const [search, setSearch] = useState("");

    // Search Filter
    const filteredData = capacityData.filter((item) =>
        `${item.supplierCode} ${item.supplierName} ${item.location} ${item.tonnage}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Number Formatting
    const formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-IN");

    // Export CSV
    const exportCSV = () => {

        const headers = [
            "Supplier Code",
            "Supplier Name",
            "Location",
            "Tonnage",
            "No. of Presses",
            "Available Strokes / Day",
            "Required Strokes / Day",
            "Utilization",
            "Remaining Capacity"
        ];

        const escapeCSV = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const rows = filteredData.map(item => [
            item.supplierCode,
            item.supplierName,
            item.location,
            item.tonnage,
            item.numberOfPresses,
            item.availableStrokesPerDay,
            item.requiredStrokesPerDay,
            item.utilizationPercent,
            item.remainingCapacity
        ]);

        const csv = [
            headers.map(escapeCSV).join(","),
            ...rows.map(row => row.map(escapeCSV).join(","))
        ].join("\r\n");

        const blob = new Blob(["\uFEFF" + csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Supplier-Capacity-Report.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // Utilization Badge
    const getUtilizationStyle = (utilization) => {

        if (utilization > 100) {
            return "bg-red-50 text-red-700 border-red-200";
        }

        if (utilization >= 80) {
            return "bg-orange-50 text-orange-700 border-orange-200";
        }

        if (utilization >= 50) {
            return "bg-green-50 text-green-700 border-green-200";
        }

        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    const headerClass =
        "px-4 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap bg-gray-50 border-b border-gray-200";

    return (

        <div className="bg-white mt-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100">

                <div className="flex items-center gap-3">

                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                        <TableProperties size={21} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            Supplier-wise Capacity Details
                        </h2>

                       
                    </div>

                </div>

                {/* Search and Export */}
                <div className="flex flex-col sm:flex-row gap-3">

                    <div className="relative">

                        <Search
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search Supplier / Tonnage"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-200 bg-gray-50 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition w-full sm:w-64"
                        />

                    </div>

                    <button
                        onClick={exportCSV}
                        disabled={filteredData.length === 0}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={17} />
                        Export CSV
                    </button>

                </div>

            </div>

            {/* Table Scroll Area */}
            <div className="max-h-[450px] overflow-auto relative">

                <table className="w-full min-w-[1150px] border-separate border-spacing-0 text-sm text-left">

                    {/* Sticky Header */}
                    <thead className="sticky top-0 z-20">

                        <tr>

                            <th className={`${headerClass} text-left`}>
                                Supplier Code
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Supplier Name
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Location
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Tonnage
                            </th>

                            <th className={`${headerClass} text-center`}>
                                No. of Presses
                            </th>

                            <th className={`${headerClass} text-right`}>
                                Available Strokes / Day
                            </th>

                            <th className={`${headerClass} text-right`}>
                                Required Strokes / Day
                            </th>

                            <th className={`${headerClass} text-center`}>
                                Utilization
                            </th>

                            <th className={`${headerClass} text-right`}>
                                Remaining Capacity
                            </th>

                        </tr>

                    </thead>

                    {/* Table Body */}
                    <tbody>

                        {filteredData.length > 0 ? (

                            filteredData.map((item, index) => {

                                const utilization = Number(
                                    item.utilizationPercent || 0
                                );

                                return (

                                    <tr
                                        key={item._id || index}
                                        className={`transition-colors duration-150 hover:bg-blue-50/70 ${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50/60"
                                        }`}
                                    >

                                        {/* Supplier Code */}
                                        <td className="px-4 py-3.5 font-semibold text-blue-700 whitespace-nowrap border-b border-gray-100">
                                            {item.supplierCode || "-"}
                                        </td>

                                        {/* Supplier Name */}
                                        <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap border-b border-gray-100">
                                            {item.supplierName || "-"}
                                        </td>

                                        {/* Location */}
                                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap border-b border-gray-100">
                                            {item.location || "-"}
                                        </td>

                                        {/* Tonnage */}
                                        <td className="px-4 py-3.5 border-b border-gray-100">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">
                                                {item.tonnage || "-"}
                                            </span>
                                        </td>

                                        {/* Number of Presses */}
                                        <td className="px-4 py-3.5 text-center font-medium text-gray-700 tabular-nums border-b border-gray-100">
                                            {formatNumber(item.numberOfPresses)}
                                        </td>

                                        {/* Available Strokes */}
                                        <td className="px-4 py-3.5 text-right font-semibold text-blue-700 tabular-nums whitespace-nowrap border-b border-gray-100">
                                            {formatNumber(item.availableStrokesPerDay)}
                                        </td>

                                        {/* Required Strokes */}
                                        <td className="px-4 py-3.5 text-right font-semibold text-orange-600 tabular-nums whitespace-nowrap border-b border-gray-100">
                                            {formatNumber(item.requiredStrokesPerDay)}
                                        </td>

                                        {/* Utilization */}
                                        <td className="px-4 py-3.5 text-center border-b border-gray-100">

                                            <span className={`inline-flex items-center justify-center min-w-[65px] px-2.5 py-1 rounded-md border text-xs font-bold tabular-nums ${getUtilizationStyle(utilization)}`}>
                                                {utilization.toFixed(1)}%
                                            </span>

                                        </td>

                                        {/* Remaining Capacity */}
                                        <td className="px-4 py-3.5 text-right font-semibold text-gray-700 tabular-nums whitespace-nowrap border-b border-gray-100">
                                            {formatNumber(item.remainingCapacity)}
                                        </td>

                                    </tr>

                                );

                            })

                        ) : (

                            <tr>
                                <td
                                    colSpan="9"
                                    className="text-center py-12 text-gray-400"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <TableProperties size={28} />
                                        <span className="font-medium">
                                            No capacity data available
                                        </span>
                                    </div>
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 bg-gray-50/70">

                <p className="text-xs text-gray-500">
                    Total Records:{" "}
                    <span className="font-bold text-gray-800">
                        {filteredData.length}
                    </span>
                </p>

                <p className="text-xs text-gray-400">
                    Press Capacity Report
                </p>

            </div>

        </div>
    );
};

export default SupplierCapacityTable;
