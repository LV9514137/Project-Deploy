
import React, { useState } from "react";
import {
    TableProperties,
    Search,
    Download
} from "lucide-react";

const SupplierCapacityTable = ({ capacityData }) => {

    const [search, setSearch] = useState("");

    // Search Filter
    const filteredData = capacityData.filter((item) =>
        `${item.supplierCode} ${item.supplierName} ${item.location} ${item.tonnage}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

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

        const csv = [headers, ...rows]
            .map(row => row.map(value => `"${value ?? ""}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Supplier-Capacity-Report.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white mt-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                        <TableProperties size={23} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-800">
                            Supplier-wise Capacity Details
                        </h2>

                        <p className="text-xs text-gray-400 mt-1">
                            Supplier and tonnage-wise capacity records
                        </p>
                    </div>

                </div>

                {/* Search and Export */}
                <div className="flex flex-col sm:flex-row gap-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search Supplier / Tonnage"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 w-full sm:w-64"
                        />

                    </div>

                    <button
                        onClick={exportCSV}
                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition"
                    >
                        <Download size={17} />
                        Export CSV
                    </button>

                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px] text-sm text-left">

                    <thead className="bg-blue-50 text-gray-800">

                        <tr>
                            <th className="px-4 py-3 font-semibold">Supplier Code</th>
                            <th className="px-4 py-3 font-semibold">Supplier Name</th>
                            <th className="px-4 py-3 font-semibold">Location</th>
                            <th className="px-4 py-3 font-semibold">Tonnage</th>
                            <th className="px-4 py-3 text-center font-semibold">No. of Presses</th>
                            <th className="px-4 py-3 text-right font-semibold">Available Strokes / Day</th>
                            <th className="px-4 py-3 text-right font-semibold">Required Strokes / Day</th>
                            <th className="px-4 py-3 text-center font-semibold">Utilization</th>
                            <th className="px-4 py-3 text-right font-semibold">Remaining Capacity</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredData.length > 0 ? (

                            filteredData.map((item, index) => {

                                const utilization = Number(item.utilizationPercent || 0);

                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-100 hover:bg-blue-50/50 transition"
                                    >

                                        <td className="px-4 py-3 font-semibold text-gray-800">
                                            {item.supplierCode}
                                        </td>

                                        <td className="px-4 py-3 text-gray-700">
                                            {item.supplierName || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {item.location || "-"}
                                        </td>

                                        <td className="px-4 py-3 font-medium text-gray-700">
                                            {item.tonnage}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {item.numberOfPresses || 0}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            {Number(item.availableStrokesPerDay || 0).toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            {Number(item.requiredStrokesPerDay || 0).toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-4 py-3 text-center">

                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                utilization > 100
                                                    ? "bg-red-100 text-red-700"
                                                    : utilization >= 80
                                                        ? "bg-orange-100 text-orange-700"
                                                        : utilization >= 50
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-blue-100 text-blue-700"
                                            }`}>
                                                {utilization.toFixed(1)}%
                                            </span>

                                        </td>

                                        <td className="px-4 py-3 text-right font-medium">
                                            {Number(item.remainingCapacity || 0).toLocaleString("en-IN")}
                                        </td>

                                    </tr>
                                );

                            })

                        ) : (

                            <tr>
                                <td colSpan="9" className="text-center py-10 text-gray-500">
                                    No capacity data available
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center">

                <p className="text-sm text-gray-500">
                    Total Records: <span className="font-semibold text-gray-800">{filteredData.length}</span>
                </p>

                <p className="text-xs text-gray-400">
                    Press Capacity Report
                </p>

            </div>

        </div>
    );
};

export default SupplierCapacityTable;
