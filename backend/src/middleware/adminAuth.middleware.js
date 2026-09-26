import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";

const authAdmin = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new ApiError(401, "Please login first");
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.email !== process.env.ADMIN_EMAIL_ID) {
        throw new ApiError(403, "Unauthorized Access");
    }

    next();
});

export default authAdmin;