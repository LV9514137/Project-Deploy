import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Pencil } from "lucide-react";

export const ViewPage = () => {
    const { backendUrl, token,navigate } = useContext(AppContext)
    const { id } = useParams()
    const [viewPartDetails, setViewPartDetails] = useState({})

    const partDetails = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/part/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log("View", response.data.data);
            setViewPartDetails(response.data.data)
            toast.success(response.data.message)
        } catch (error) {
            toast.error(response.data.message)
        }

    }
    useEffect(() => {
        partDetails()
    }, [])

    return (
  <div className="min-h-screen bg-slate-100 p-4">

    <div className="max-w-4xl mx-auto">

      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100 transition"
        >
          <ArrowLeft/>
        </button>

        <button
          onClick={()=>navigate(`/supplier/edit-part/${viewPartDetails._id}`)}
          
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
        <Pencil/>
        </button>

      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow border border-gray-200">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Part Details
            </h1>

            <p className="text-gray-500 mt-1">
              {viewPartDetails.partNo}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold
            ${
              viewPartDetails.status === "Completed"
                ? "bg-green-100 text-green-700"
                : viewPartDetails.status === "In Progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {viewPartDetails.status}
          </span>

        </div>

        {/* Details */}
        <div className="p-6">

          <div className="grid grid-cols-2 gap-y-4">

            <p className="text-gray-500">Part Name</p>
            <p className="font-semibold">{viewPartDetails.partName}</p>

            <p className="text-gray-500">Model</p>
            <p className="font-semibold">{viewPartDetails.model}</p>

            <p className="text-gray-500">Location</p>
            <p className="font-semibold">{viewPartDetails.location}</p>

            <p className="text-gray-500">Current Capacity</p>
            <p className="font-semibold">
              {viewPartDetails.currentCapacity}
            </p>

            <p className="text-gray-500">Required Capacity</p>
            <p className="font-semibold">
              {viewPartDetails.requiredCapacity}
            </p>

            <p className="text-gray-500">Gap</p>

            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold w-fit">
              {viewPartDetails.gap}
            </span>

            <p className="text-gray-500">Target Date</p>
            <p className="font-semibold">
              {viewPartDetails.targetDate?.substring(0, 10)}
            </p>

          </div>

          {/* Remarks */}

          <div className="mt-6 border-t pt-4">

            <h3 className="font-semibold text-slate-800 mb-2">
              Remarks
            </h3>

            <div className="bg-slate-50 border rounded-lg p-3 text-gray-700">
              {viewPartDetails.remarks || "No Remarks Available"}
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}
