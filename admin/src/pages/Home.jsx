import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Factory,
  Users,
  Boxes,
  ChartColumn,
  ShieldCheck,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-6">

      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Left */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-12 flex flex-col justify-center">

          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
            <Factory size={45} />
            
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Capacity
            <br />
            Tracker
          </h1>

          <p className="mt-6 text-blue-100 text-lg leading-8">
            Supplier Capacity Monitoring System designed to
            monitor supplier capacity, production readiness,
            part availability and manufacturing performance.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-10">

            <div className="flex items-center gap-3">
              <Users className="text-green-300" />
              <span>Supplier Management</span>
            </div>

            <div className="flex items-center gap-3">
              <Boxes className="text-yellow-300" />
              <span>Part Tracking</span>
            </div>

            <div className="flex items-center gap-3">
              <ChartColumn className="text-cyan-300" />
              <span>Analytics</span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="text-pink-300" />
              <span>Secure Access</span>
            </div>

          </div>

        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-12">

          <div className="text-center">

            <Factory
              size={70}
              className="mx-auto text-blue-600"
            />

            <h2 className="text-3xl font-bold text-slate-800 mt-6">
              Admin Portal
            </h2>

            <p className="text-gray-500 mt-4 leading-7">
              Access dashboards, monitor supplier performance,
              manage parts, generate reports and track
              manufacturing capacity across locations.
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/login")}
            className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            Login as Admin
          </button>

          <div className="mt-10 border-t pt-6 text-center text-gray-500 text-sm">
            Capacity Tracker v1.0
            <br />
            Manufacturing Operations Management System
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;