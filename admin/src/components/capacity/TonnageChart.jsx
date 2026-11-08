
import React from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from "recharts";

import { ChartColumnIncreasing } from "lucide-react";

const TonnageChart = ({ capacityData }) => {

    const tonnageOrder = [
        "63T", "110T", "160T", "200T", "250T",
        "300T", "315T", "400T", "500T", "600T", "800T"
    ];

    const chartData = tonnageOrder.map((tonnage) => {

        const filteredData = capacityData.filter(
            item => item.tonnage === tonnage
        );

        const available = filteredData.reduce(
            (sum, item) => sum + Number(item.availableStrokesPerDay || 0), 0
        );

        const required = filteredData.reduce(
            (sum, item) => sum + Number(item.requiredStrokesPerDay || 0), 0
        );

        return {
            tonnage,
            utilization: available > 0
                ? Number(((required / available) * 100).toFixed(1))
                : 0
        };
    }).filter(item => item.utilization > 0);

    return (
        <div className="bg-white p-5 h-full flex flex-col rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">

                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        Tonnage-wise Utilization
                    </h2>

                  
                </div>

                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <ChartColumnIncreasing size={24} />
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
                            left: -15,
                            bottom: 5
                        }}
                    >

                        <defs>
                            <linearGradient
                                id="utilizationGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#1D4ED8" />
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
                            domain={[0, "auto"]}
                            allowDataOverflow={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#94A3B8",
                                fontSize: 11
                            }}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <Tooltip
                            cursor={{ fill: "#EFF6FF" }}
                            contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #E2E8F0",
                                borderRadius: "12px",
                                padding: "10px 14px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                            }}
                            formatter={(value) => [
                                `${value}%`,
                                "Utilization"
                            ]}
                            labelStyle={{
                                color: "#1E293B",
                                fontWeight: 600,
                                marginBottom: "5px"
                            }}
                        />

                        <Bar
                            dataKey="utilization"
                            name="Utilization"
                            fill="url(#utilizationGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={38}
                        >

                            <LabelList
                                dataKey="utilization"
                                position="top"
                                formatter={(value) => `${value}%`}
                                style={{
                                    fill: "#374151",
                                    fontSize: 11,
                                    fontWeight: 600
                                }}
                            />

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

            <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                    Total Tonnage Categories
                </p>

                <p className="text-sm font-semibold text-blue-600">
                    {chartData.length}
                </p>
            </div>

        </div>
    );
};

export default TonnageChart;
