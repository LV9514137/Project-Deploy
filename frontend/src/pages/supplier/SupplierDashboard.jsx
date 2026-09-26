import axios from 'axios'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react'
import SummaryCard from '../../components/SummaryCard'
import { LabelList, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, } from "recharts";
import Loader from '../../components/Loader'



export const SupplierDashboard = () => {
    const { backendUrl, token, navigate, parts, setParts, getParts, loading, setLoading } = useContext(AppContext);
    const [partStatus, setPartStatus] = useState({})


    const partData = async () => {

        try {
            const response = await axios.get(`${backendUrl}/api/v1/dashboard/summary`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPartStatus(response.data.data)
            console.log(response.data.data);

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    //location wise data

    const locationChartData = [
        {
            location: "Gurgaon",
            count: parts.filter((item) => item.location === "Gurgaon").length,
        },
        {
            location: "Manesar",
            count: parts.filter((item) => item.location === "Manesar").length,
        },
        {
            location: "Kharkhoda",
            count: parts.filter((item) => item.location === "Kharkhoda").length,
        },
        {
            location: "Gujarat",
            count: parts.filter((item) => item.location === "Gujarat").length,
        },

        {
            location: "Bangalore",
            count: parts.filter((item) => item.location === "Bangalore").length,
        },
    ];


    //Model wise data

    const modelChartData = [
        {
            model: "YCA",
            count: parts.filter((item) => item.model === "YCA").length,
        },
        {
            model: "YG8",
            count: parts.filter((item) => item.model === "YG8").length,
        },
        {
            model: "Y9T",
            count: parts.filter((item) => item.model === "Y9T").length,
        },
        {
            model: "YWD",
            count: parts.filter((item) => item.model === "YWD").length,
        },
        {
            model: "YJC",
            count: parts.filter((item) => item.model === "YJC").length,
        },
        {
            model: "YFG",
            count: parts.filter((item) => item.model === "YFG").length,
        },
        {
            model: "Y17",
            count: parts.filter((item) => item.model === "Y17").length,
        },
        {
            model: "YXA",
            count: parts.filter((item) => item.model === "YXA").length,
        },
        {
            model: "YHB",
            count: parts.filter((item) => item.model === "YHB").length,
        },
        {
            model: "YHC",
            count: parts.filter((item) => item.model === "YHC").length,
        },
        {
            model: "YED NB",
            count: parts.filter((item) => item.model === "YED NB").length,
        },
        {
            model: "Y1K",
            count: parts.filter((item) => item.model === "Y1K").length,
        },
        {
            model: "YTA",
            count: parts.filter((item) => item.model === "YTA").length,
        },
        {
            model: "YTB",
            count: parts.filter((item) => item.model === "YTB").length,
        },
        {
            model: "YED HB",
            count: parts.filter((item) => item.model === "YED HB").length,
        },
        {
            model: "YY8",
            count: parts.filter((item) => item.model === "YY8").length,
        },
    ];

    console.log("Location", locationChartData)
    console.log("Model", modelChartData)
    console.log("Parts", parts.length)

    useEffect(() => {

        const fetchData = async () => {

            setLoading(true);

            await partData();
            await getParts();

            setLoading(false);
        };

        fetchData();

    }, []);


    //pi chart 
    const chartData = [
        { name: "Open", value: partStatus.openParts },
        { name: "In Progress", value: partStatus.inProgressParts },
        { name: "Completed", value: partStatus.completedParts },
        { name: "Delayed", value: partStatus.delayedParts },
    ];
    const COLORS = ["#ef4444", "#facc15", "#22c55e", "#8b5cf6",];
    if (loading) {
        return <Loader />;
    }
    return (
        <div className="space-y-8">

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <SummaryCard
                    title="Total Parts"
                    value={partStatus.totalParts}
                    className="border-l-4 border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onclick={() => navigate("/supplier/my-parts")}
                />

                <SummaryCard
                    title="Open Parts"
                    value={partStatus.openParts}
                    className="border-l-4 border-red-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onclick={() => navigate("/supplier/my-parts?status=Open")}
                />

                <SummaryCard
                    title="In Progress"
                    value={partStatus.inProgressParts}
                    className="border-l-4 border-yellow-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onclick={() => navigate("/supplier/my-parts?status=In Progress")}
                />

                <SummaryCard
                    title="Completed"
                    value={partStatus.completedParts}
                    className="border-l-4 border-green-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onclick={() => navigate("/supplier/my-parts?status=Completed")}
                />

                <SummaryCard
                    title="Delayed"
                    value={partStatus.delayedParts}
                    className="border-l-4 border-purple-500 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onclick={() => navigate("/supplier/my-parts?status=Delayed")}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* Pie Chart */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-lg p-6">

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Status Wise Parts
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Overall Parts Distribution
                            </p>
                        </div>

                        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {partStatus.totalParts} Parts
                        </div>
                    </div>

                    <div className="h-[420px]">

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>


                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={70}
                                    outerRadius={135}
                                    paddingAngle={4}
                                    label
                                    onClick={(data) =>
                                        navigate(`/supplier/my-parts?status=${encodeURIComponent(data.name)}`)
                                    }
                                    

                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}

                                </Pie>

                                <Tooltip />

                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                />

                            </PieChart>
                        </ResponsiveContainer>

                    </div>
                </div>

                {/* Loaction wise Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-lg p-6">

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Location wise Part Count

                        </h2>


                    </div>

                    <div className="h-[420px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={locationChartData}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="location" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="count"
                                    fill="#3b82f6"
                                    radius={[8, 8, 0, 0]}
                                    onClick={(data)=> navigate(`/supplier/my-parts?location=${encodeURIComponent(data.location)}`)}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>
            {/* Model wise Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-lg p-6">

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Model wise Part Count

                    </h2>


                </div>

                <div className="h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={modelChartData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="model" />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="count"
                                fill="#8b5cf6"
                                radius={[8, 8, 0, 0]}
                                onClick={(data)=> navigate(`/supplier/my-parts?model=${encodeURIComponent(data.model)}`)}
                            />

                            <LabelList
                                dataKey="count"
                                position="top"
                                fill="#374151"
                                fontSize={14}
                                fontWeight="bold"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>


        </div>
    );
}
