import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { AdminContext } from '../context/adminContext'
import { toast } from "react-toastify";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  TrendingUp,
  ArrowRight,
} from "lucide-react";



const SupplierDetails = () => {
  const { AllsupplierData, allSupplierData,navigate } = useContext(AdminContext)
  console.log("DataChaiye", allSupplierData);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Supplier Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSupplierData.map((supplier) => (
          <div
            key={supplier._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {supplier.supplierName}
                    </h2>

                    <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {supplier.supplierCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3 text-gray-700">

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <span>{supplier.contactPerson}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{supplier.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{supplier.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{supplier.address}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="px-5 py-1 border-t bg-gray-50 flex justify-between">

              <div className="text-center">

                <p className="text-xs text-gray-700 font-bold">Total Parts</p>
                <p className="font-bold text-lg">{supplier.totalParts}</p>
              </div>

              <div className="text-center">

                <p className="text-xs text-gray-700 font-bold">Total Gap</p>
                <p className="font-bold text-lg text-red-600">
                  {supplier.totalGap}
                </p>
              </div>

            </div>

            {/* Footer */}
            <button
              className="w-full py-3 border-t flex items-center justify-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 transition"
              onClick={()=>navigate(`/admin/all-parts?supplierCode=${encodeURIComponent(supplier.supplierCode)}`)}
            >
              View Details
              <ArrowRight className="w-4 h-4" />
              
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


export default SupplierDetails