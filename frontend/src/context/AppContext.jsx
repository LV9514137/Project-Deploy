import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(() => localStorage.getItem("Token") || "");
    const navigate = useNavigate();
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    if (!token) {
        navigate("/login", { replace: true });
    }
}, [token]);

    const getParts = async () => {

        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/v1/part/my-parts`, {


                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setParts(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const locations = [
        "Gurgaon",
        "Manesar",
        "Kharkhoda",
        "Gujarat",
        "Bangalore",
    ];
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
    return (
        <AppContext.Provider
            value={{ backendUrl, token, setToken, navigate, parts, setParts, getParts, locations, MODELS, loading, setLoading }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;