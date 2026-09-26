import dotenv from "dotenv"
import { app } from "../app.js";
import { connectDB } from "./db/index.js";

const result = dotenv.config();

console.log(result);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);



connectDB()
    .then(() => {
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Server Connection failed:", error);
        process.exit(1);
    });


