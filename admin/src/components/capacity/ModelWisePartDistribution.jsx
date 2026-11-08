
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

const ModelWisePartDistribution = ({ parts = [] }) => {

    const models = [...new Set(
        parts.flatMap(item => item.model || [])
    )].sort();

    const chartData = models.map(model => ({
        model,
        count: parts.filter(item =>
            (item.model || []).includes(model)
        ).length
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">

                    <p className="text-sm font-semibold text-slate-800">
                        {label}
                    </p>

                    <p className="text-sm font-medium text-green-600 mt-1">
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
                        Model Wise Part Distribution
                    </h2>

                   
                </div>

                <div className="bg-green-50 text-green-600 p-2 rounded-lg">
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
                                id="modelPartGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#22C55E" />
                                <stop offset="100%" stopColor="#15803D" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                        />

                        <XAxis
                            dataKey="model"
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
                            cursor={{ fill: "#F0FDF4" }}
                            content={<CustomTooltip />}
                        />

                        <Bar
                            dataKey="count"
                            name="Total Parts"
                            fill="url(#modelPartGradient)"
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
                    Total Vehicle Models
                </p>

                <p className="text-sm font-semibold text-green-600">
                    {models.length}
                </p>

            </div>

        </div>
    );
};

export default ModelWisePartDistribution;
