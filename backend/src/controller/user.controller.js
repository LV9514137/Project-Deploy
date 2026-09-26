import { User } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import validator from "validator";
import bcrypt from "bcrypt"
import generateUserToken from "../utils/generateUserToken.js";
import jwt from "jsonwebtoken"


const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body
    if (!email || !name || !password) {
        throw new ApiError(400, "All fields are required")
    }


    // check vaild email
    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email")
    }
    const existedUser = await User.findOne({
        email
    })

    if (existedUser) {
        throw new ApiError(400, "User already exits")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create(
        {
            name,
            email,
            password: hashPassword
        }
    )

    if (!user) {
        throw new ApiError(400, "Something went wrong while creating the user")
    }
    return res.status(201).json(
        new ApiResponse(200, user, "User created sucessfully")
    )
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All feilds are required ")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Pl enter vaild email")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(400, "User doesn't exits")
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "incorrect password")
    }

    const token = generateUserToken(user._id)

    return res.status(201).json(
        new ApiResponse(200, { user, token }, "User login successfully")
    )
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please enter email and password");
    }

    if (
        email !== process.env.ADMIN_EMAIL_ID ||
        password !== process.env.ADMIN_LOGIN_PASSWORD
    ) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            token,
            "Admin Login Successfully"
        )
    );
});

export { registerUser, loginUser, loginAdmin }