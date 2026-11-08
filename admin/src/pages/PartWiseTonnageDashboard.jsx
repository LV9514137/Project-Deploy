
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import axios from "axios";
import { AdminContext } from "../context/adminContext";

import {
  Box,
  Users,
  Car,
  Layers,
  Filter,
  RotateCcw,
  Search,
  Upload,
  FileSpreadsheet,
} from "lucide-react";

import TonnageWisePartDistribution from "../components/capacity/TonnageWisePartDistribution";
import ModelWisePartDistribution from "../components/capacity/ModelWisePartDistribution";
import TonnageWisePartDetails from "../components/capacity/TonnageWisePartDetails";

const TONNAGES = [
  "63T", "110T", "160T", "200T", "250T",
  "300T", "315T", "400T", "500T", "600T", "800T",
];

const PartWiseTonnageDashboard = () => {
  const {
    token,
    backendUrl,
    partTonnageData,
    getPartTonnageData,
  } = useContext(AdminContext);

  const fileInputRef = useRef(null);

  const [filters, setFilters] = useState({
    supplier: "All",
    model: "All",
    location: "All",
    tonnage: "All",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    supplier: "All",
    model: "All",
    location: "All",
    tonnage: "All",
  });

  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState(false);

  useEffect(() => {
    if (token) getPartTonnageData();
  }, [token]);

  const parts = partTonnageData?.parts || [];

  // Get tonnage value
  const getTonnageValue = (item, tonnage) => {
    if (item.tonnage instanceof Map) {
      return Number(item.tonnage.get(tonnage) || 0);
    }

    return Number(item.tonnage?.[tonnage] || 0);
  };

  // Filter options
  const suppliers = useMemo(
    () => [...new Set(parts.map(item => item.vendorCode).filter(Boolean))],
    [parts]
  );

  const models = useMemo(
    () => [
      ...new Set(parts.flatMap(item => item.model || []).filter(Boolean)),
    ],
    [parts]
  );

  const locations = useMemo(
    () => [
      ...new Set(parts.map(item => item.plantLocation).filter(Boolean)),
    ],
    [parts]
  );

  // Filter parts
  const filteredParts = useMemo(() => {
    return parts.filter(item => {
      const supplierMatch =
        appliedFilters.supplier === "All" ||
        item.vendorCode === appliedFilters.supplier;

      const modelMatch =
        appliedFilters.model === "All" ||
        (item.model || []).includes(appliedFilters.model);

      const locationMatch =
        appliedFilters.location === "All" ||
        item.plantLocation === appliedFilters.location;

      const tonnageMatch =
        appliedFilters.tonnage === "All" ||
        getTonnageValue(item, appliedFilters.tonnage) > 0;

      return (
        supplierMatch &&
        modelMatch &&
        locationMatch &&
        tonnageMatch
      );
    });
  }, [parts, appliedFilters]);

  // Apply filters
  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      supplier: "All",
      model: "All",
      location: "All",
      tonnage: "All",
    };

    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  // Summary calculations
  const totalParts = filteredParts.length;

  const totalSuppliers = new Set(
    filteredParts.map(item => item.vendorCode).filter(Boolean)
  ).size;

  const totalModels = new Set(
    filteredParts.flatMap(item => item.model || [])
  ).size;

  const totalTonnageCategories =
    appliedFilters.tonnage === "All"
      ? TONNAGES.filter(tonnage =>
          filteredParts.some(
            item => getTonnageValue(item, tonnage) > 0
          )
        ).length
      : filteredParts.length > 0 ? 1 : 0;

  // CSV Import
  const handleImport = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setImportError(true);
      setImportMessage("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    try {
      setImporting(true);
      setImportMessage("");
      setImportError(false);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${backendUrl}/api/v1/admin/import/part-tonnage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImportMessage(
        response.data.message || "CSV imported successfully!"
      );

      await getPartTonnageData();

    } catch (error) {
      setImportError(true);

      setImportMessage(
        error.response?.data?.message || "CSV import failed."
      );
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  // Summary card configuration
  const summaryCards = [
    {
      title: "Total Parts",
      value: totalParts,
      icon: Box,
      cardColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "bg-blue-100 text-blue-600",
      valueColor: "text-blue-800",
    },
    {
      title: "Total Suppliers",
      value: totalSuppliers,
      icon: Users,
      cardColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "bg-purple-100 text-purple-600",
      valueColor: "text-purple-800",
    },
    {
      title: "Total Models",
      value: totalModels,
      icon: Car,
      cardColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "bg-green-100 text-green-600",
      valueColor: "text-green-800",
    },
    {
      title: "Tonnage Categories",
      value: totalTonnageCategories,
      icon: Layers,
      cardColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "bg-orange-100 text-orange-600",
      valueColor: "text-orange-800",
    },
  ];

  if (!partTonnageData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 font-medium">
          Loading Part Wise Tonnage Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-end">

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Supplier
            </label>
            <select
              value={filters.supplier}
              onChange={e => setFilters({ ...filters, supplier: e.target.value })}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Model
            </label>
            <select
              value={filters.model}
              onChange={e => setFilters({ ...filters, model: e.target.value })}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Models</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Plant Location
            </label>
            <select
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Tonnage
            </label>
            <select
              value={filters.tonnage}
              onChange={e => setFilters({ ...filters, tonnage: e.target.value })}
              className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Tonnage</option>
              {TONNAGES.map(tonnage => (
                <option key={tonnage} value={tonnage}>{tonnage}</option>
              ))}
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="h-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
          >
            <Filter size={16} />
            Apply Filter
          </button>

          <button
            onClick={resetFilters}
            className="h-10 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Dashboard Heading + Import */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Part Wise Tonnage Dashboard
          </h1>
         
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <Search size={16} />
            Showing {filteredParts.length} of {parts.length} parts
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="h-10 px-4 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            {importing ? (
              <span>Importing...</span>
            ) : (
              <>
                <Upload size={17} />
                Import CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Message */}
      {importMessage && (
        <div className={`mb-5 p-3 rounded-lg text-sm font-medium ${
          importError
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {importMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {summaryCards.map(card => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`${card.cardColor} ${card.borderColor} border rounded-xl shadow-sm p-5 flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  {card.title}
                </p>
                <h2 className={`text-3xl font-bold mt-1 ${card.valueColor}`}>
                  {card.value}
                </h2>
              </div>

              <div className={`${card.iconColor} p-3.5 rounded-xl`}>
                <Icon size={25} strokeWidth={2.2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis Heading */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Parts Distribution Analysis
        </h2>
        
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <TonnageWisePartDistribution parts={filteredParts} />
        <ModelWisePartDistribution parts={filteredParts} />
      </div>

      {/* Part Details Table */}
      <div className="mt-5">
        <TonnageWisePartDetails parts={filteredParts} />
      </div>

    </div>
  );
};

export default PartWiseTonnageDashboard;
