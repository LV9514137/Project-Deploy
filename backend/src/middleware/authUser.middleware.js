import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";

const authUser = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    throw new ApiError(401, "Please login first");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY
    );

    req.userId = decoded.userId;
x
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Token");
  }
});

export default authUser;