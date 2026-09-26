import React, { useContext, useState } from "react";

import SummaryCard from "../components/SummaryCard";
import { AdminContext } from "../context/adminContext";
import { LabelList, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, } from "recharts";
import Loader from "../components/Loader";
import { data, useSearchParams } from "react-router-dom";
import {
    Users,


    ClipboardList,
    CheckCircle2,
    Clock3,
    TriangleAlert,
    CircleAlert
} from "lucide-react";

export const AdminDashboard = () => {
    const COLORS = ["#ef4444", "#facc15", "#22c55e", "#8b5cf6",];


    const { parts, loading, navigate, allSupplierData, delayedParts, supplierCode, setSupplierCode } = useContext(AdminContext);
    console.log("Dashboard Data", parts);

    // Supplier Wise Dashboard 
    const [searchParams] = useSearchParams();



    const filteredParts =
        supplierCode === "All" ? parts : parts.filter((part) => part.supplier.supplierCode === supplierCode)

    const statusData = [
        {
            name: "Open",
            value: filteredParts.filter(
                (item) => item.status === "Open"
            ).length,
        },
        {
            name: "In Progress",
            value: filteredParts.filter(
                (item) => item.status === "In Progress"
            ).length,
        },
        {
            name: "Completed",
            value: filteredParts.filter(
                (item) => item.status === "Completed"
            ).length,
        },
    ];

    // Parts data loaction wise
    const locationChartData = [
        {
            location: "Gurgaon",
            count: filteredParts.filter((item) => item.location === "Gurgaon").length,
        },
        {
            location: "Manesar",
            count: filteredParts.filter((item) => item.location === "Manesar").length,
        },
        {
            location: "Kharkhoda",
            count: filteredParts.filter((item) => item.location === "Kharkhoda").length,
        },
        {
            location: "Gujarat",
            count: filteredParts.filter((item) => item.location === "Gujarat").length,
        },

        {
            location: "Bangalore",
            count: filteredParts.filter((item) => item.location === "Bangalore").length,
        },
    ];
    console.log("AAA", locationChartData);

    //Model wise data

    const modelChartData = [
        {
            model: "YCA",
            count: filteredParts.filter((item) => item.model === "YCA").length,
        },
        {
            model: "YG8",
            count: filteredParts.filter((item) => item.model === "YG8").length,
        },
        {
            model: "Y9T",
            count: filteredParts.filter((item) => item.model === "Y9T").length,
        },
        {
            model: "YWD",
            count: filteredParts.filter((item) => item.model === "YWD").length,
        },
        {
            model: "YJC",
            count: filteredParts.filter((item) => item.model === "YJC").length,
        },
        {
            model: "YFG",
            count: filteredParts.filter((item) => item.model === "YFG").length,
        },
        {
            model: "Y17",
            count: filteredParts.filter((item) => item.model === "Y17").length,
        },
        {
            model: "YXA",
            count: filteredParts.filter((item) => item.model === "YXA").length,
        },
        {
            model: "YHB",
            count: filteredParts.filter((item) => item.model === "YHB").length,
        },
        {
            model: "YHC",
            count: filteredParts.filter((item) => item.model === "YHC").length,
        },
        {
            model: "YED NB",
            count: filteredParts.filter((item) => item.model === "YED NB").length,
        },
        {
            model: "Y1K",
            count: filteredParts.filter((item) => item.model === "Y1K").length,
        },
        {
            model: "YTA",
            count: filteredParts.filter((item) => item.model === "YTA").length,
        },
        {
            model: "YTB",
            count: filteredParts.filter((item) => item.model === "YTB").length,
        },
        {
            model: "YED HB",
            count: filteredParts.filter((item) => item.model === "YED HB").length,
        },
        {
            model: "YY8",
            count: filteredParts.filter((item) => item.model === "YY8").length,
        },
    ];

    const dashboardSummary = {
        totalParts: filteredParts.length,
        openParts: filteredParts.filter(p => p.status === "Open").length,
        inProgressParts: filteredParts.filter(p => p.status === "In Progress").length,
        completedParts: filteredParts.filter(p => p.status === "Completed").length,
        delayedParts: filteredParts.filter(
            p =>
                p.status !== "Completed" &&
                new Date(p.targetDate) < new Date()
        ).length,
    };



    if (loading) {

        return <Loader />
    }
    return (
        <div className="space-y-8">

            <select
                value={supplierCode}
                onChange={(e) => {
                    const value = e.target.value;

                    setSupplierCode(value);

                    navigate(
                        value === "All"
                            ? "/admin/dashboard"
                            : `/admin/dashboard?supplierCode=${value}`
                    );
                }}
                className="border rounded-lg px-3 py-2"
            >
                <option value="All">All Suppliers</option>

                {allSupplierData.map((supplier) => (
                    <option
                        key={supplier._id}
                        value={supplier.supplierCode}
                    >
                        {supplier.supplierCode} - {supplier.supplierName}
                    </option>
                ))}
            </select>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {supplierCode === "All" &&
                    <SummaryCard
                        title="Total Suppliers"
                        value={allSupplierData.length}
                        className="border-l-4 border-gray-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => navigate("/admin/suppliers")}
                        icon={<Users className="w-6 h-6 text-gray-600" />}
                    />
                }

                <SummaryCard
                    title="Total Parts"
                    value={dashboardSummary.totalParts}
                    className="border-l-4 border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    // Total Parts
                    onClick={() =>
                        navigate(
                            `/admin/all-parts${supplierCode !== "All" ? `?supplier=${supplierCode}` : ""}`
                        )
                    }
                    icon={<ClipboardList className="w-6 h-6 text-blue-600" />}

                />


                <SummaryCard
                    title="Open Parts"
                    value={dashboardSummary.openParts}
                    className="border-l-4 border-purple-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onClick={() =>
                        navigate(
                            `/admin/all-parts?status=Open${supplierCode !== "All" ? `&supplierCode=${supplierCode}` : ""}`
                        )
                    }
                    icon={<CircleAlert className="w-6 h-6 text-purple-600" />}
                />

                <SummaryCard
                    title="In Progress"
                    value={dashboardSummary.inProgressParts}
                    className="border-l-4 border-yellow-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    // In Progress
                    onClick={() =>
                        navigate(
                            `/admin/all-parts?status=In%20Progress${supplierCode !== "All" ? `&supplierCode=${supplierCode}` : ""}`
                        )
                    }
                    icon={<Clock3 className="w-6 h-6 text-yellow-600" />}
                />

                <SummaryCard
                    title="Completed"
                    value={dashboardSummary.completedParts}
                    className="border-l-4 border-green-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    // Completed
                    onClick={() =>
                        navigate(
                            `/admin/all-parts?status=Completed${supplierCode !== "All" ? `&supplierCode=${supplierCode}` : ""}`
                        )
                    }
                    icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                />

                <SummaryCard
                    title="OverDue"
                    value={dashboardSummary.delayedParts}
                    className="border-l-4 border-red-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    // OverDue
                    onClick={() =>
                        navigate(
                            `/admin/overdue-parts${supplierCode !== "All" 
                                ?`?supplierCode=${supplierCode}` : ""}`
                        )


                        
                    }
                    icon={<TriangleAlert className="w-6 h-6 text-red-600" />}
                />


            </div>
            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Pie Chart */}
                <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50 rounded-3xl border border-slate-200 shadow-2xl p-6">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                📊 Status Wise Parts
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Overall Parts Distribution
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            {dashboardSummary.totalParts} Parts
                        </div>

                    </div>

                    {/* Chart */}
                    <div className="relative h-[430px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <PieChart>

                                <defs>

                                    <linearGradient id="openGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#60A5FA" />
                                    </linearGradient>

                                    <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#F97316" />
                                        <stop offset="100%" stopColor="#FDBA74" />
                                    </linearGradient>

                                    <linearGradient id="completedGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#22C55E" />
                                        <stop offset="100%" stopColor="#86EFAC" />
                                    </linearGradient>

                                    <linearGradient id="delayGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#EF4444" />
                                        <stop offset="100%" stopColor="#FCA5A5" />
                                    </linearGradient>

                                </defs>

                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={88}
                                    outerRadius={145}
                                    paddingAngle={5}
                                    stroke="#fff"
                                    strokeWidth={4}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                    label={({ name, value }) => value > 0 ? `${name} (${value})` : ""}
                                    labelLine={false}

                                    onClick={(data) => {
                                        navigate(`/admin/all-parts?status=${encodeURIComponent(data.name)}&supplierCode=${supplierCode}`);
                                    }}

                                >

                                    <Cell fill="url(#openGradient)" />
                                    <Cell fill="url(#progressGradient)" />
                                    <Cell fill="url(#completedGradient)" />
                                    <Cell fill="url(#delayGradient)" />

                                </Pie>

                                <Tooltip
                                    contentStyle={{
                                        background: "#fff",
                                        border: "none",
                                        borderRadius: "18px",
                                        boxShadow: "0 15px 35px rgba(0,0,0,.15)",
                                        padding: "10px 14px",
                                    }}
                                />

                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingTop: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                />

                            </PieChart>

                        </ResponsiveContainer>

                        {/* Center Card */}

                        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">

                            <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-100 shadow-2xl flex flex-col items-center justify-center">

                                <span className="text-4xl font-extrabold text-slate-800">
                                    {dashboardSummary.totalParts}
                                </span>

                                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">
                                    Total Parts
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Location Wise Part Count */}
                <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50 rounded-3xl border border-gray-200 shadow-xl p-6">

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                📍 Location Wise Part Count
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Distribution of parts across manufacturing locations
                            </p>
                        </div>
                    </div>

                    <div className="h-[430px]">

                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart
                                data={locationChartData}
                                margin={{
                                    top: 35,
                                    right: 25,
                                    left: 0,
                                    bottom: 10,
                                }}
                                dataKey="count"

                            >

                                {/* Premium Grid */}
                                <CartesianGrid
                                    strokeDasharray="5 5"
                                    vertical={false}
                                    stroke="#E5E7EB"
                                />

                                {/* Gradient */}
                                <defs>

                                    <linearGradient
                                        id="locationGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#2563EB"
                                        />

                                        <stop
                                            offset="45%"
                                            stopColor="#4F46E5"
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#9333EA"
                                        />

                                    </linearGradient>

                                </defs>

                                <XAxis
                                    dataKey="location"
                                    tick={{
                                        fill: "#374151",
                                        fontSize: 13,
                                        fontWeight: 600,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{
                                        fill: "#374151",
                                        fontSize: 13,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip
                                    cursor={{
                                        fill: "#EEF2FF",
                                    }}
                                    contentStyle={{
                                        borderRadius: "15px",
                                        border: "none",
                                        boxShadow:
                                            "0 8px 25px rgba(0,0,0,0.15)",
                                    }}
                                />

                                <Bar
                                    dataKey="count"
                                    fill="url(#locationGradient)"

                                    barSize={55}
                                    onClick={(data) =>
                                        navigate(`/admin/all-parts?location=${encodeURIComponent(data.location)}&supplierCode=${supplierCode}`)
                                    }
                                >

                                    <LabelList
                                        dataKey="count"
                                        position="top"
                                        style={{
                                            fill: "#111827",
                                            fontWeight: "bold",
                                            fontSize: 15,
                                        }}
                                    />

                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>
            {/* Model Wise Part Count */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl border border-gray-200 shadow-xl p-6">

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        🚗 Model Wise Part Count
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Distribution of Parts Across Different Models
                    </p>
                </div>

                <div className="h-[430px]">

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={modelChartData}
                            margin={{
                                top: 30,
                                right: 20,
                                left: 0,
                                bottom: 5,
                            }}
                        >

                            {/* Gradient */}
                            <defs>

                                <linearGradient
                                    id="modelGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#EC4899" />
                                    <stop offset="50%" stopColor="#8B5CF6" />
                                    <stop offset="100%" stopColor="#3B82F6" />
                                </linearGradient>

                                <filter
                                    id="modelShadow"
                                    x="-20%"
                                    y="-20%"
                                    width="140%"
                                    height="140%"
                                >
                                    <feDropShadow
                                        dx="0"
                                        dy="5"
                                        stdDeviation="6"
                                        floodColor="#8B5CF6"
                                        floodOpacity="0.35"
                                    />
                                </filter>

                            </defs>

                            <CartesianGrid
                                strokeDasharray="4 4"
                                vertical={false}
                                stroke="#E5E7EB"
                            />

                            <XAxis
                                dataKey="model"
                                tick={{
                                    fill: "#374151",
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{
                                    fill: "#374151",
                                    fontSize: 13,
                                }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "rgba(139,92,246,0.08)",
                                }}
                                contentStyle={{
                                    borderRadius: "16px",
                                    border: "none",
                                    boxShadow:
                                        "0 10px 30px rgba(0,0,0,0.15)",
                                    background: "#fff",
                                }}
                            />

                            <Bar
                                dataKey="count"
                                fill="url(#modelGradient)"

                                barSize={55}
                                filter="url(#modelShadow)"
                                onClick={(data) =>
                                    navigate(`/admin/all-parts?model=${encodeURIComponent(data.model)}&supplierCode=${supplierCode}`)
                                }
                            >
                                <LabelList
                                    dataKey="count"
                                    position="top"
                                    style={{
                                        fill: "#111827",
                                        fontWeight: "bold",
                                        fontSize: 15,
                                    }}
                                />
                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    );
};