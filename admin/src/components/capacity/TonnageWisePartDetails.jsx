
import React, { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";

const TONNAGES = [
    "63T",
    "110T",
    "160T",
    "200T",
    "250T",
    "300T",
    "315T",
    "400T",
    "500T",
    "600T",
    "800T",
];

const TonnageWisePartDetails = ({ parts = [] }) => {

    const [partNoSearch, setPartNoSearch] = useState("");
    const [partNameSearch, setPartNameSearch] = useState("");

    // Get tonnage value from Map or Object
    const getTonnageValue = (item, tonnage) => {
        if (item.tonnage instanceof Map) {
            return Number(item.tonnage.get(tonnage) || 0);
        }

        return Number(item.tonnage?.[tonnage] || 0);
    };

    // Calculate total tonnage
    const getTotal = (item) => {
        return TONNAGES.reduce(
            (total, tonnage) =>
                total + getTonnageValue(item, tonnage),
            0
        );
    };

    // Number formatting
    const formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-IN");

    // Filter parts
    const filteredParts = useMemo(() => {
        return parts.filter((item) => {

            const partNoMatch = String(item.partNo || "")
                .toLowerCase()
                .includes(partNoSearch.trim().toLowerCase());

            const partNameMatch = String(item.partName || "")
                .toLowerCase()
                .includes(partNameSearch.trim().toLowerCase());

            return partNoMatch && partNameMatch;
        });

    }, [parts, partNoSearch, partNameSearch]);

    // Export CSV
    const handleExportCSV = () => {

        const headers = [
            "Sr. No.",
            "Vendor Code",
            "Vendor Name",
            "Plant Loc.",
            "Part No.",
            "Part Name",
            "Model",
            "Qty/veh",
            "Per day req",
            "No. Of Child Part",
            ...TONNAGES,
            "Total",
        ];

        const escapeCSV = (value) => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
        };

        const rows = filteredParts.map((item, index) => [
            item.srNo ?? index + 1,
            item.vendorCode,
            item.vendorName,
            item.plantLocation,
            item.partNo,
            item.partName,
            Array.isArray(item.model)
                ? item.model.join(", ")
                : item.model,
            item.qtyPerVehicle,
            item.perDayRequirement,
            item.noOfChildParts,
            ...TONNAGES.map((tonnage) =>
                getTonnageValue(item, tonnage)
            ),
            getTotal(item),
        ]);

        const csvContent = [
            headers.map(escapeCSV).join(","),
            ...rows.map((row) =>
                row.map(escapeCSV).join(",")
            ),
        ].join("\r\n");

        const blob = new Blob(["\uFEFF" + csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `Part_Wise_Tonnage_${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // Common Header Style
    const headerClass =
        "sticky top-0 z-30 bg-gray-100 px-3 py-3.5 text-xs font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap border-b border-gray-200 shadow-sm";

    return (

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            {/* Header - Fixed */}
            <div className="px-5 py-4 border-b border-gray-100">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            Part Wise Tonnage Details
                        </h2>

                        <p className="text-xs text-gray-400 mt-1">
                            Vendor and part-wise tonnage breakdown
                        </p>
                    </div>

                    {/* Search and Export */}
                    <div className="flex flex-col sm:flex-row gap-3">

                        {/* Part Number Search */}
                        <div className="relative">

                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Enter Part Number..."
                                value={partNoSearch}
                                onChange={(e) => setPartNoSearch(e.target.value)}
                                className="w-full sm:w-52 pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />

                        </div>

                        {/* Part Name Search */}
                        <div className="relative">

                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Enter Part Name..."
                                value={partNameSearch}
                                onChange={(e) => setPartNameSearch(e.target.value)}
                                className="w-full sm:w-52 pl-9 pr-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />

                        </div>

                        {/* Export CSV */}
                        <button
                            onClick={handleExportCSV}
                            disabled={filteredParts.length === 0}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={17} />
                            Export CSV
                        </button>

                    </div>
                </div>
            </div>

            {/* Table - Internal Scroll */}
            <div className="max-h-[450px] overflow-auto relative">

                <table className="min-w-max w-full border-separate border-spacing-0 text-sm text-left">

                    {/* Sticky Header */}
                    <thead>

                        <tr>

                            <th className={`${headerClass} text-left`}>
                                Sr. No.
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Vendor Code
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Vendor Name
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Plant Loc.
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Part No.
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Part Name
                            </th>

                            <th className={`${headerClass} text-left`}>
                                Model
                            </th>

                            <th className={`${headerClass} text-center`}>
                                Qty/veh
                            </th>

                            <th className={`${headerClass} text-center`}>
                                Per day req
                            </th>

                            <th className={`${headerClass} text-center`}>
                                No. Of Child Part
                            </th>

                            {TONNAGES.map((tonnage) => (
                                <th
                                    key={tonnage}
                                    className={`${headerClass} text-center`}
                                >
                                    {tonnage}
                                </th>
                            ))}

                            <th className={`${headerClass} text-center`}>
                                Total
                            </th>

                        </tr>

                    </thead>

                    {/* Table Body */}
                    <tbody>

                        {filteredParts.length > 0 ? (

                            filteredParts.map((item, index) => (

                                <tr
                                    key={item._id || index}
                                    className={`transition-colors duration-150 hover:bg-blue-50/70 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50/60"
                                    }`}
                                >

                                    <td className="px-3 py-3.5 text-gray-500 whitespace-nowrap border-b border-gray-100">
                                        {item.srNo ?? index + 1}
                                    </td>

                                    <td className="px-3 py-3.5 font-semibold text-gray-700 whitespace-nowrap border-b border-gray-100">
                                        {item.vendorCode || "-"}
                                    </td>

                                    <td className="px-3 py-3.5 font-medium text-gray-800 whitespace-nowrap border-b border-gray-100">
                                        {item.vendorName || "-"}
                                    </td>

                                    <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap border-b border-gray-100">
                                        {item.plantLocation || "-"}
                                    </td>

                                    <td className="px-3 py-3.5 font-semibold text-blue-700 whitespace-nowrap border-b border-gray-100">
                                        {item.partNo || "-"}
                                    </td>

                                    <td className="px-3 py-3.5 text-gray-700 whitespace-nowrap border-b border-gray-100">
                                        {item.partName || "-"}
                                    </td>

                                    <td className="px-3 py-3.5 text-gray-600 whitespace-nowrap border-b border-gray-100">
                                        {Array.isArray(item.model)
                                            ? item.model.join(", ")
                                            : item.model || "-"}
                                    </td>

                                    <td className="px-3 py-3.5 text-center text-gray-700 tabular-nums border-b border-gray-100">
                                        {formatNumber(item.qtyPerVehicle)}
                                    </td>

                                    <td className="px-3 py-3.5 text-center font-medium text-gray-700 tabular-nums border-b border-gray-100">
                                        {formatNumber(item.perDayRequirement)}
                                    </td>

                                    <td className="px-3 py-3.5 text-center text-gray-700 tabular-nums border-b border-gray-100">
                                        {formatNumber(item.noOfChildParts)}
                                    </td>

                                    {TONNAGES.map((tonnage) => (
                                        <td
                                            key={tonnage}
                                            className="px-3 py-3.5 text-center text-gray-700 tabular-nums border-b border-gray-100"
                                        >
                                            {formatNumber(
                                                getTonnageValue(item, tonnage)
                                            )}
                                        </td>
                                    ))}

                                    <td className="px-3 py-3.5 text-center font-bold text-gray-800 tabular-nums bg-blue-50/50 border-b border-gray-100">
                                        {formatNumber(getTotal(item))}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan={22}
                                    className="px-4 py-12 text-center text-gray-400"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Search size={26} />
                                        <span className="font-medium">
                                            No parts found
                                        </span>
                                    </div>
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* Footer - Fixed */}
            <div className="px-5 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 bg-gray-50/70">

                <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-bold text-gray-800">
                        {filteredParts.length}
                    </span>
                    {" "}of{" "}
                    <span className="font-bold text-gray-800">
                        {parts.length}
                    </span>
                    {" "}records
                </p>

                <p className="text-xs text-gray-400">
                    Total Tonnage Categories:{" "}
                    <span className="font-semibold text-gray-600">
                        {TONNAGES.length}
                    </span>
                </p>

            </div>

        </div>
    );
};

export default TonnageWisePartDetails;
