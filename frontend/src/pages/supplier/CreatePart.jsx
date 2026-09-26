import axios from "axios";
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CreatePart = () => {
    const [partNo, setPartNo] = useState("");
    const [partName, setPartName] = useState("");
    const [model, setModel] = useState("");
    const [location, setLocation] = useState("");
    const [currentCapacity, setCurrentCapacity] = useState("");
    const [requiredCapacity, setRequiredCapacity] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [remarks, setRemarks] = useState("");

    const { backendUrl, token, locations, MODELS } = useContext(AppContext)

    const submitHandler = async (e) => {
        e.preventDefault();

        const data = {
            partNo, partName, model, location, requiredCapacity, currentCapacity, targetDate, remarks
        };

        try {
            if (!token) {
                toast.error("Login required to create a part.");
                return;
            }

            const response = await axios.post(`${backendUrl}/api/v1/part`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(response.data.message);
            console.log(response.data.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
            console.log(error);
        }

    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-center mb-6">
                    Add Part Details
                </h2>

                <form
                    onSubmit={submitHandler}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <input
                        type="text"
                        placeholder="Part Number"
                        value={partNo}
                        onChange={(e) => setPartNo(e.target.value)}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Part Name"
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="border p-3 rounded-lg"
                        required
                    >
                        <option value="">Select Model</option>

                        {MODELS.map((mod) => (
                            <option key={mod} value={mod}>
                                {mod}
                            </option>
                        ))}
                    </select>

                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border p-3 rounded-lg"
                        required
                    >
                        <option>Select Location</option>

                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Current Capacity"
                        value={currentCapacity}
                        onChange={(e) => setCurrentCapacity(e.target.value)}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="number"
                        placeholder="Required Capacity"
                        value={requiredCapacity}
                        onChange={(e) => setRequiredCapacity(e.target.value)}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <div>
                        <label className="block mb-2 font-medium">
                            Target Date
                        </label>

                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full border p-3 rounded-lg"
                            required
                        />
                    </div>

                    <textarea
                        placeholder="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="border p-3 rounded-lg md:col-span-2"
                        rows="3"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 md:col-span-2"
                    >
                        Add Part
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePart;