
import React, {
    useContext,
    useEffect,
    useState,
    useRef
} from "react";

import axios from "axios";
import { AdminContext } from "../context/adminContext";

import {
    Users,
    Factory,
    Layers,
    Gauge,
    Upload
} from "lucide-react";

import TonnageChart from "../components/capacity/TonnageChart";
import CapacityComparisonChart from "../components/capacity/CapacityComparisonChart";
import SupplierCapacityTable from "../components/capacity/SupplierCapacityTable";

const CapacityDashboard = () => {

    const {
        token,
        backendUrl,
        capacityData,
        getCapacityData
    } = useContext(AdminContext);

    const [loading, setLoading] = useState(false);
    const [importingPress, setImportingPress] = useState(false);

    const pressFileRef = useRef(null);

    // Filters
    const [supplierCodeFilter, setSupplierCodeFilter] = useState("All");
    const [supplierNameFilter, setSupplierNameFilter] = useState("All");
    const [tonnageFilter, setTonnageFilter] = useState("All");

    // Filtered Data
    const filteredCapacityData = capacityData.filter((item) =>
        (supplierCodeFilter === "All" ||
            item.supplierCode === supplierCodeFilter) &&

        (supplierNameFilter === "All" ||
            item.supplierName === supplierNameFilter) &&

        (tonnageFilter === "All" ||
            item.tonnage === tonnageFilter)
    );

    // Summary Calculations
    const totalSuppliers = new Set(
        filteredCapacityData.map(item => item.supplierCode)
    ).size;

    const totalPresses = filteredCapacityData.reduce(
        (sum, item) => sum + Number(item.numberOfPresses || 0),
        0
    );

    const availableStrokes = filteredCapacityData.reduce(
        (sum, item) => sum + Number(item.availableStrokesPerDay || 0),
        0
    );

    const requiredStrokes = filteredCapacityData.reduce(
        (sum, item) => sum + Number(item.requiredStrokesPerDay || 0),
        0
    );

    const overallUtilization = availableStrokes > 0
        ? ((requiredStrokes / availableStrokes) * 100).toFixed(1)
        : "0.0";

    // Fetch Capacity Data
    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                setLoading(true);

                try {
                    await getCapacityData();
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [token]);

    // Import Press Configuration CSV
    const handlePressImport = async (event) => {

        const file = event.target.files[0];

        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".csv")) {
            alert("Please select a CSV file.");
            event.target.value = "";
            return;
        }

        try {
            setImportingPress(true);

            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `${backendUrl}/api/v1/admin/import/press-configuration`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                response.data.message ||
                "Press Configuration imported successfully!"
            );

            await getCapacityData();

        } catch (error) {

            console.error("Press Import Error:", error);

            alert(
                error.response?.data?.message ||
                "Press Configuration import failed."
            );

        } finally {
            setImportingPress(false);
            event.target.value = "";
        }
    };

    if (loading) {
        return (
            <div className="p-5">
                Loading capacity data...
            </div>
        );
    }

    return (
        <div className="p-5 bg-slate-50 min-h-screen">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Gauge size={28} className="text-blue-600" />
                        Press Capacity Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Supplier-wise and tonnage-wise capacity overview.
                    </p>
                </div>

                {/* Hidden CSV Input */}
                <input
                    type="file"
                    accept=".csv"
                    ref={pressFileRef}
                    onChange={handlePressImport}
                    className="hidden"
                />

                {/* Import Press Data Button */}
                <button
                    onClick={() => pressFileRef.current?.click()}
                    disabled={importingPress}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl shadow-sm transition"
                >
                    <Upload size={18} />

                    {importingPress
                        ? "Importing..."
                        : "Import Press Data"
                    }
                </button>

            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                {/* Supplier Code */}
                <select
                    value={supplierCodeFilter}
                    onChange={(e) => setSupplierCodeFilter(e.target.value)}
                    className="border border-gray-300 bg-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                >
                    <option value="All">All Supplier Codes</option>

                    {[...new Set(
                        capacityData.map(i => i.supplierCode)
                    )].map(code => (
                        <option key={code} value={code}>
                            {code}
                        </option>
                    ))}
                </select>

                {/* Supplier Name */}
                <select
                    value={supplierNameFilter}
                    onChange={(e) => setSupplierNameFilter(e.target.value)}
                    className="border border-gray-300 bg-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                >
                    <option value="All">All Supplier Names</option>

                    {[...new Set(
                        capacityData.map(i => i.supplierName).filter(Boolean)
                    )].map(name => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>

                {/* Tonnage */}
                <select
                    value={tonnageFilter}
                    onChange={(e) => setTonnageFilter(e.target.value)}
                    className="border border-gray-300 bg-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                >
                    <option value="All">All Tonnage</option>

                    {[
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
                        "800T"
                    ].map(t => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">

                {/* Total Suppliers */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 border-l-4 border-l-blue-600 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                Total Suppliers
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                {totalSuppliers}
                            </h2>
                        </div>

                        <div className="bg-blue-500 text-white p-3 rounded-xl">
                            <Users size={30} />
                        </div>

                    </div>
                </div>

                {/* Total Presses */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100 border-l-4 border-l-purple-600 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                Total Presses
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                {totalPresses.toLocaleString("en-IN")}
                            </h2>
                        </div>

                        <div className="bg-purple-500 text-white p-3 rounded-xl">
                            <Factory size={30} />
                        </div>

                    </div>
                </div>

                {/* Available Strokes */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-100 border-l-4 border-l-amber-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                Available Strokes
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                {availableStrokes.toLocaleString("en-IN")}
                            </h2>
                        </div>

                        <div className="bg-amber-500 text-white p-3 rounded-xl">
                            <Layers size={30} />
                        </div>

                    </div>
                </div>

                {/* Overall Utilization */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 border-l-4 border-l-green-600 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-semibold text-gray-600">
                                Overall Utilization
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                {overallUtilization}%
                            </h2>
                        </div>

                        <div className="bg-green-500 text-white p-3 rounded-xl">
                            <Gauge size={30} />
                        </div>

                    </div>
                </div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-6 items-stretch">

                <div className="min-w-0">
                    <TonnageChart
                        capacityData={filteredCapacityData}
                    />
                </div>

                <div className="min-w-0">
                    <CapacityComparisonChart
                        capacityData={filteredCapacityData}
                    />
                </div>

            </div>

            {/* Supplier Table */}
            <SupplierCapacityTable
                capacityData={filteredCapacityData}
            />

        </div>
    );
};

export default CapacityDashboard;
