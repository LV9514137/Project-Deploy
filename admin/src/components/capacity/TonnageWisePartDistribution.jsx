
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

const TonnageWisePartDistribution = ({ parts = [] }) => {

    const tonnageList = [
        "63T", "110T", "160T", "200T", "250T",
        "300T", "315T", "400T", "500T", "600T", "800T"
    ];

    const chartData = tonnageList.map(tonnage => ({
        tonnage,
        count: parts.filter(item =>
            Number(
                item.tonnage?.get
                    ? item.tonnage.get(tonnage)
                    : item.tonnage?.[tonnage] || 0
            ) > 0
        ).length
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-800">
                        {label}
                    </p>

                    <p className="text-sm font-medium text-blue-600 mt-1">
                        Total Parts: {payload[0].value}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-3">

                <div>
                    <h2 className="text-base font-bold text-gray-800">
                        Tonnage Wise Part Distribution
                    </h2>

                   
                </div>

                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <ChartColumnIncreasing size={20} />
                </div>

            </div>

            {/* Chart */}
            <div className="w-full h-[210px]">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 8,
                            left: -20,
                            bottom: 0
                        }}
                        barCategoryGap="25%"
                    >

                        <defs>
                            <linearGradient
                                id="partTonnageGradient"
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
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#94A3B8",
                                fontSize: 11
                            }}
                        />

                        <Tooltip
                            cursor={{ fill: "#EFF6FF" }}
                            content={<CustomTooltip />}
                        />

                        <Bar
                            dataKey="count"
                            name="Total Parts"
                            fill="url(#partTonnageGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={38}
                            animationDuration={800}
                        >

                            <LabelList
                                dataKey="count"
                                position="top"
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

            {/* Footer */}
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">

                <p className="text-xs text-gray-400">
                    Total Tonnage Categories
                </p>

                <p className="text-sm font-semibold text-blue-600">
                    {chartData.filter(item => item.count > 0).length}
                </p>

            </div>

        </div>
    );
};

export default TonnageWisePartDistribution;
