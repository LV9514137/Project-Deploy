import React, { useContext } from 'react'
import { AdminContext } from '../context/adminContext';
import { useSearchParams } from 'react-router-dom';

const OverdueParts = () => {

    const { delayParts, loading } = useContext(AdminContext)
    console.log("DelayedList", delayParts)
    const [searchParams] = useSearchParams();
    const supplierCode = searchParams.get("supplierCode");

    const filterParts = delayParts.filter((part) => {
        return !supplierCode || part.supplier.supplierCode === supplierCode
    })
    console.log("DelayedListFilter", filterParts)

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        /* h-[calc(100vh-120px)] और w-full overflow-hidden से बाहरी पेज का स्क्रॉल बिल्कुल बंद हो जाएगा */
        <div className="h-[calc(100vh-120px)] w-full flex flex-col bg-slate-100 overflow-hidden">

            {/* 1. FIXED TOP HEADER */}
            <div className="flex-none p-6 pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Overdue Parts
                    </h1>
                </div>
            </div>

            {/* 2. SCROLLABLE CONTAINER (टेबल रैपर) */}
            {/* flex-1 min-h-0 overflow-auto सबसे ज़रूरी है ताकि स्क्रॉल केवल इस डिब्बे के अंदर हो */}
            <div className="flex-1 min-h-0 overflow-auto px-6 pb-6">
                <div className="rounded-2xl bg-white shadow-lg border border-slate-200">
                    <table className="min-w-full table-auto border-separate border-spacing-0">

                        {/* Table Header Fixed */}
                        <thead className="sticky top-0 z-30">
                            <tr className="text-white">
                                {/* ध्यान दें: CSS में sticky th के साथ काम करने के लिए 'before:content-[""]' या सीधे सॉलिड बैकग्राउंड क्लास (जैसे bg-blue-600) अनिवार्य है ताकि नीचे का डेटा इसके पीछे छिपे */}
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Sr. No.
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Vendor Code
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Vendor Name
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Part No
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Part Name
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Model
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Location
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Gap
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-blue-600 border-b border-slate-200">
                                    Target Date
                                </th>
                                <th className="sticky top-0 px-6 py-4 text-center text-sm font-semibold whitespace-nowrap bg-indigo-600 border-b border-slate-200">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {filterParts.length > 0 ? (
                                filterParts.map((part, index) => (
                                    <tr
                                        key={part._id}
                                        className="border-b border-slate-200 hover:bg-blue-50 transition-all duration-200"
                                    >
                                        <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700 border-b border-slate-100">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700 whitespace-nowrap border-b border-slate-100">
                                            {part.supplier.supplierCode}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-700 whitespace-nowrap border-b border-slate-100">
                                            {part.supplier.supplierName}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700 whitespace-nowrap border-b border-slate-100">
                                            {part.partNo}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-700 border-b border-slate-100">
                                            {part.partName}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[14px] font-semibold text-slate-700 border-b border-slate-100">
                                            {part.model}
                                        </td>
                                        <td className="px-6 py-4 text-center text-[14px] font-medium text-slate-700 border-b border-slate-100">
                                            {part.location}
                                        </td>
                                        <td className="px-6 py-4 text-center border-b border-slate-100">
                                            <span className="inline-flex items-center justify-center min-w-[60px] rounded-full bg-red-100 px-4 py-1.5 text-red-600 font-bold text-sm">
                                                {part.gap}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center border-b border-slate-100">
                                            <span className="inline-flex items-center justify-center min-w-[60px] rounded-full bg-red-100 px-4 py-1.5 text-red-600 font-bold text-sm">
                                                {part.targetDate ? new Date(part.targetDate).toLocaleDateString("en-GB") : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center border-b border-slate-100">
                                            <span
                                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold
                                                    ${part.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : part.status === "In Progress"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {part.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="10"
                                        className="py-10 text-center text-lg text-slate-500"
                                    >
                                        No Parts Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default OverdueParts;