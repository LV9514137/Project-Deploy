import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    const [token, setToken] = useState(
        () => localStorage.getItem("adminToken") || ""
    );

    const [parts, setParts] = useState([]);
    const [delayParts, setDelayedParts] = useState([])

    const overdueParts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/v1/dashboard/overdue`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setDelayedParts(response.data.data)
            toast.success(response.data.message)

        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Something went wrong")
        }
    }
    useEffect(() => {
        console.log("AdminToken:", token);
        if (token) {
            overdueParts();

        }
    }, [token]);
    useEffect(() => {
        console.log("OverDue:", delayParts);

    }, []);

    useEffect(() => {
        if (!token) {
            navigate("/admin/login", { replace: true });
        }
    }, [token]);

    const getAllParts = async () => {

        setLoading(true)
        try {
            const response = await axios.get(`${backendUrl}/api/v1/part/all-parts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setParts(response.data.data);
            console.log("GetAll", response.data.data)
        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("AdminToken:", token);
        if (token) {
            getAllParts();

        }
    }, [token]);
    useEffect(() => {
        console.log("Parts", parts);
    }, [parts]);


    {/*model list*/ }

    const MODELS = [
        "YCA",
        "YG8",
        "Y9T",
        "YWD",
        "YJC",
        "YFG",
        "Y17",
        "YXA",
        "YHB",
        "YHC",
        "YED NB",
        "Y1K",
        "YTA",
        "YTB",
        "YED HB",
        "YY8",
    ];
    const locations = [
        "Gurgaon",
        "Manesar",
        "Kharkhoda",
        "Gujarat",
        "Bangalore",
    ];

    // Supplier List
    const [allSupplierData, setAllSupplierData] = useState([])
    const getAllSupplier = async () => {
        console.log("Calling Supplier API...");

        const response = await axios.get(`${backendUrl}/api/v1/supplier`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        setAllSupplierData(response.data.data)
        toast.success(response.data.message)
        console.log("All Supplier Data", response.data.data);

    }
    const [supplierCode, setSupplierCode] = useState("All");
    useEffect(() => {
        if (token) {
            getAllSupplier()
        }
    }, [token]);
    useEffect(() => {
        console.log("AllSu", allSupplierData);
    }, [allSupplierData]);



    return (
        <AdminContext.Provider
            value={{
                backendUrl,
                token,
                setToken,
                navigate,
                parts,
                setParts,
                getAllParts,
                supplierCode,
                setSupplierCode,
                MODELS,
                locations,
                loading,
                setLoading,
                allSupplierData,
                overdueParts,
                delayParts,
                setDelayedParts
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;