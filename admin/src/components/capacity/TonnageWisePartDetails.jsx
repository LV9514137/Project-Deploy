
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
      (total, tonnage) => total + getTonnageValue(item, tonnage),
      0
    );
  };

  // Filter parts by Part Number and Part Name
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

  // Export filtered data to CSV
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Part Wise Tonnage Details
            </h2>

           
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
                className="w-full sm:w-52 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full sm:w-52 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={filteredParts.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Export CSV
            </button>

          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-max w-full text-sm text-left">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-3">Sr. No.</th>
              <th className="px-3 py-3">Vendor Code</th>
              <th className="px-3 py-3">Vendor Name</th>
              <th className="px-3 py-3">Plant Loc.</th>
              <th className="px-3 py-3">Part No.</th>
              <th className="px-3 py-3">Part Name</th>
              <th className="px-3 py-3">Model</th>
              <th className="px-3 py-3 text-center">Qty/veh</th>
              <th className="px-3 py-3 text-center">Per day req</th>
              <th className="px-3 py-3 text-center">
                No. Of Child Part
              </th>

              {TONNAGES.map((tonnage) => (
                <th
                  key={tonnage}
                  className="px-3 py-3 text-center"
                >
                  {tonnage}
                </th>
              ))}

              <th className="px-3 py-3 text-center">Total</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">

            {filteredParts.length > 0 ? (
              filteredParts.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="px-3 py-3">
                    {item.srNo ?? index + 1}
                  </td>

                  <td className="px-3 py-3 font-medium">
                    {item.vendorCode}
                  </td>

                  <td className="px-3 py-3">
                    {item.vendorName}
                  </td>

                  <td className="px-3 py-3">
                    {item.plantLocation}
                  </td>

                  <td className="px-3 py-3 font-medium text-blue-700">
                    {item.partNo}
                  </td>

                  <td className="px-3 py-3">
                    {item.partName}
                  </td>

                  <td className="px-3 py-3">
                    {Array.isArray(item.model)
                      ? item.model.join(", ")
                      : item.model}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {item.qtyPerVehicle}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {item.perDayRequirement}
                  </td>

                  <td className="px-3 py-3 text-center">
                    {item.noOfChildParts}
                  </td>

                  {TONNAGES.map((tonnage) => (
                    <td
                      key={tonnage}
                      className="px-3 py-3 text-center"
                    >
                      {getTonnageValue(item, tonnage)}
                    </td>
                  ))}

                  <td className="px-3 py-3 text-center font-semibold text-gray-800">
                    {getTotal(item)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={22}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No parts found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
        <span>
          Showing {filteredParts.length} of {parts.length} records
        </span>

        <span>
          Total Tonnage Categories: {TONNAGES.length}
        </span>
      </div>

    </div>
  );
};

export default TonnageWisePartDetails;
