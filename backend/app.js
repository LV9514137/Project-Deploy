import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

export const app = express()

app.use(cors())
app.use(express.json({ limit: "16kb" }))
app.use(urlencoded({ limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())



import userRouter from "./src/routes/user.routes.js"
import supplierRouter from "./src/routes/supplier.routes.js"
import partdetailsRouter from "./src/routes/part.details.routes.js"
import dashboardRouter from "./src/routes/dashboard.routes.js";
import adminRouter from "./src/routes/admin.routes.js"




app.use("/api/v1/user", userRouter);
app.use("/api/v1/supplier", supplierRouter);
app.use("/api/v1/part", partdetailsRouter);
app.use( "/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/admin", adminRouter);

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});