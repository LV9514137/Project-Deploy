
import React, { useContext, useState, useRef } from "react";
import axios from "axios";
import { AdminContext } from "../../context/adminContext";

const ImportPressConfiguration = ({ onClose, onSuccess }) => {

    const { backendUrl, token } = useContext(AdminContext);

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const handleImport = async () => {

        if (!file) {
            alert("Please select CSV file");
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            alert("Only CSV files are allowed");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);

            const response = await axios.post(
                `${backendUrl}/api/v1/admin/import/press-configuration`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);

            await onSuccess();
            onClose();

        } catch (error) {
            alert(error.response?.data?.message || "Import failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-lg font-bold text-gray-800">
                        Import Press Data
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 text-xl"
                    >
                        ✕
                    </button>

                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    accept=".csv"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                />

                {/* Select CSV Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">

                    <p className="text-3xl mb-3">📄</p>

                    <p className="text-gray-700 font-medium">
                        Select Press Configuration CSV
                    </p>

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg mt-4"
                    >
                        Import CSV
                    </button>

                    {file && (
                        <p className="text-sm text-green-600 mt-3">
                            Selected: {file.name}
                        </p>
                    )}

                </div>

                <p className="text-xs text-gray-500 mt-3">
                    Only CSV files allowed. Maximum size: 5 MB.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleImport}
                        disabled={loading || !file}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Importing..." : "Upload"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ImportPressConfiguration;
