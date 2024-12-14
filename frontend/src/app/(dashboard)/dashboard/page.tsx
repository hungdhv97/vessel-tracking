"use client";

import React, { useMemo } from "react";
import { FaAnchor, FaExclamationTriangle, FaShip, FaTools, FaWater } from "react-icons/fa";
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useFetchVessels } from "@/queries/vessel";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const VesselManagementDashboard: React.FC = () => {
    const { data: vessels = [] } = useFetchVessels();

    const statusMapping = useMemo(() => ({
        active: { label: "Hoạt động", color: "#3B82F6" },
        inactive: { label: "Không hoạt động", color: "#10B981" },
        maintenance: { label: "Bảo trì", color: "#F59E0B" },
        warning: { label: "Cảnh Báo", color: "#F87171" },
        sunk: { label: "Đã Chìm", color: "#6B7280" },
    }), []);

    const pieChartData = useMemo(() =>
            Object.keys(statusMapping).map((status) => ({
                name: statusMapping[status as keyof typeof statusMapping].label,
                value: vessels.filter(vessel => vessel.status === status).length,
                color: statusMapping[status as keyof typeof statusMapping].color,
            })),
        [vessels, statusMapping],
    );

    const lineChartData = useMemo(() => [
        { month: "Tháng 1", value: 4 },
        { month: "Tháng 2", value: 3 },
        { month: "Tháng 3", value: 5 },
        { month: "Tháng 4", value: 4 },
        { month: "Tháng 5", value: 6 },
        { month: "Tháng 6", value: 5 },
    ], []);

    const statusCards = useMemo(() => [
        { icon: FaShip, color: "text-blue-500", label: "Tổng Số Tàu", value: vessels.length },
        {
            icon: FaAnchor,
            color: "text-green-500",
            label: "Tàu Không Hoạt Động",
            value: vessels.filter(v => v.status === "inactive").length,
        },
        {
            icon: FaShip,
            color: "text-blue-500",
            label: "Tàu Đang Hoạt Động",
            value: vessels.filter(v => v.status === "active").length,
        },
        {
            icon: FaTools,
            color: "text-yellow-500",
            label: "Tàu Đang Bảo Trì",
            value: vessels.filter(v => v.status === "maintenance").length,
        },
        {
            icon: FaExclamationTriangle,
            color: "text-red-500",
            label: "Tàu Cảnh Báo",
            value: vessels.filter(v => v.status === "warning").length,
        },
        {
            icon: FaWater,
            color: "text-gray-500",
            label: "Tàu Đã Chìm",
            value: vessels.filter(v => v.status === "sunk").length,
        },
    ], [vessels]);

    return (
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
                {statusCards.map(({ icon: Icon, color, label, value }, index) => (
                    <div className="bg-white p-6 rounded-lg shadow" key={index}>
                        <div className="flex items-center">
                            <Icon className={`${color} text-3xl mr-4`} />
                            <div>
                                <p className="text-gray-500">{label}</p>
                                <p className="text-2xl font-bold">{value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Phân Phối Trạng Thái Tàu</h2>
                    <div className="h-64">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Xu Hướng Vận Chuyển Hàng Tháng</h2>
                    <div className="h-64">
                        <ResponsiveContainer>
                            <LineChart data={lineChartData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#3B82F6" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Theo Dõi Thời Gian Thực</h2>
                <Map />
            </div>
        </div>
    );
};

export default VesselManagementDashboard;
