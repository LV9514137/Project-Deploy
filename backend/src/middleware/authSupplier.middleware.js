import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";

const authSupplier = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        throw new ApiError(401, "Please login first");
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : authHeader;

    console.log("Token:", token);

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        console.log("Decoded Token:", decoded);

        req.supplierId = decoded.supplierId;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        throw new ApiError(401, "Invalid Token");
    }
});

export default authSupplier;