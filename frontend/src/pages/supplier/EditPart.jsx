import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
const EditPart = () => {
    const { id } = useParams();


    const { backendUrl, token, navigate, parts, getParts, locations, MODELS } = useContext(AppContext);

    const [partNo, setPartNo] = useState("");
    const [partName, setPartName] = useState("");
    const [model, setModel] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");


    const getPart = async () => {
        try {

            const response = await axios.get(`${backendUrl}/api/v1/part/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const partDetails = response.data.data

            setPartNo(partDetails.partNo);
            setPartName(partDetails.partName);
            setModel(partDetails.model);
            setLocation(partDetails.location);
            setStatus(partDetails.status);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getPart();
    }, []);

    const updatePart = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`${backendUrl}/api/v1/part/${id}`,
                {
                    partNo,
                    partName,
                    model,
                    location,
                    status,
                }
                ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            toast.success(response.data.message);
            console.log(response.data.data)
            navigate("/supplier/my-parts");

        } catch (error) {
            console.log(error);
        }


    }

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Edit Part</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition"
                >
                   <ArrowLeft size={18} strokeWidth={1.25} />
                </button>
            </div>


            <form onSubmit={updatePart} className="space-y-4">
                <input
                    type="text"
                    placeholder="Part No"
                    value={partNo}
                    onChange={(e) => setPartNo(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="text"
                    placeholder="Part Name"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full border p-2 rounded"
                />
               <div className=" flex justify-between">
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
</div>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update Part
                </button>
            </form>



        </div>
    );
};

export default EditPart;