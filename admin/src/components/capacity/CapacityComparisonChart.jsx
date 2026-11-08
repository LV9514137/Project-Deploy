
import React from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from "recharts";

import { Layers } from "lucide-react";

const CapacityComparisonChart = ({ capacityData }) => {

    const tonnageOrder = [
        "63T", "110T", "160T", "200T", "250T",
        "300T", "315T", "400T", "500T", "600T", "800T"
    ];

    const chartData = tonnageOrder.map((tonnage) => {

        const filteredData = capacityData.filter(
            item => item.tonnage === tonnage
        );

        const available = filteredData.reduce(
            (sum, item) =>
                sum + Number(item.availableStrokesPerDay || 0), 0
        );

        const required = filteredData.reduce(
            (sum, item) =>
                sum + Number(item.requiredStrokesPerDay || 0), 0
        );

        return {
            tonnage,
            available,
            required
        };
    }).filter(item => item.available > 0 || item.required > 0);

    // Exact number format for tooltip
    const formatNumber = (value) =>
        Number(value).toLocaleString("en-IN");

    // K and L format for bar labels and Y-axis
    const formatBarLabel = (value) => {
    return Number(value).toLocaleString("en-IN");
};

    return (
        <div className="bg-white p-5 h-full flex flex-col rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">

                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        Available vs Required Strokes
                    </h2>

                    
                </div>

                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <Layers size={24} />
                </div>

            </div>

            {/* Chart */}
            <div className="w-full h-72">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        data={chartData}
                        margin={{
                            top: 25,
                            right: 10,
                            left: 5,
                            bottom: 5
                        }}
                        barGap={5}
                    >

                        <defs>

                            <linearGradient
                                id="availableGradient"
                                x1="0" y1="0"
                                x2="0" y2="1"
                            >
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#1D4ED8" />
                            </linearGradient>

                            <linearGradient
                                id="requiredGradient"
                                x1="0" y1="0"
                                x2="0" y2="1"
                            >
                                <stop offset="0%" stopColor="#FB923C" />
                                <stop offset="100%" stopColor="#EA580C" />
                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                        />

                        <XAxis
                            dataKey="tonnage"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#64748B",
                                fontSize: 11
                            }}
                            dy={8}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#94A3B8",
                                fontSize: 11
                            }}
                            tickFormatter={formatBarLabel}
                        />

                        <Tooltip
                            cursor={{ fill: "#F1F5F9" }}
                            contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #E2E8F0",
                                borderRadius: "12px",
                                padding: "10px 14px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                            }}
                            formatter={(value) => formatNumber(value)}
                            labelStyle={{
                                color: "#1E293B",
                                fontWeight: 600,
                                marginBottom: "5px"
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            wrapperStyle={{
                                paddingTop: "15px",
                                fontSize: "12px"
                            }}
                        />

                        {/* Available Strokes */}
                        <Bar
                            dataKey="available"
                            name="Available Strokes"
                            fill="url(#availableGradient)"
                            radius={[5, 5, 0, 0]}
                            maxBarSize={30}
                        >
                            <LabelList
                                dataKey="available"
                                position="top"
                                formatter={formatBarLabel}
                                style={{
                                    fill: "#2563EB",
                                    fontSize: 10,
                                    fontWeight: 600
                                }}
                            />
                        </Bar>

                        {/* Required Strokes */}
                        <Bar
                            dataKey="required"
                            name="Required Strokes"
                            fill="url(#requiredGradient)"
                            radius={[5, 5, 0, 0]}
                            maxBarSize={30}
                        >
                            <LabelList
                                dataKey="required"
                                position="top"
                                formatter={formatBarLabel}
                                style={{
                                    fill: "#EA580C",
                                    fontSize: 10,
                                    fontWeight: 600
                                }}
                            />
                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default CapacityComparisonChart;
