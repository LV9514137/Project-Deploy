import { Supplier } from "../models/supplier.model.js";
import validator from "validator"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import generateSupplierToken from "../utils/generateSupplierToken.js";
import crypto from "crypto";
import transporter from "../utils/sendEmail.js";


const resetToken = crypto.randomBytes(32).toString("hex");




const createSupplier = asyncHandler(async (req, res) => {

    const { supplierName, supplierCode, password, contactPerson, email, phone, address } = req.body

    if (
        [supplierName, supplierCode, password, contactPerson, email, phone, address].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Please enter a valid email");
    }

    const existedsupplier = await Supplier.findOne({
        $or: [
            { supplierCode },
            { email }
        ]
    })

    if (existedsupplier) {
        throw new ApiError(400, "Supplier Already Exists");
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const createdSupplier = await Supplier.create({
        supplierName,
        supplierCode,
        password: hashPassword,
        contactPerson,
        email,
        phone,
        address
    })

    if (!createdSupplier) {
        throw new ApiError(500, "Something went wrong while creating supplier");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdSupplier,
            "Supplier created successfully"
        )
    );

});

const loginSupplier = asyncHandler(async (req, res) => {

    const { supplierCode, password } = req.body;

    if (!supplierCode || !password) {
        throw new ApiError(
            400,
            "Supplier Code and Password are required"
        );
    }

    const supplier = await Supplier.findOne({
        supplierCode
    });

    if (!supplier) {
        throw new ApiError(
            404,
            "Supplier not found"
        );
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        supplier.password
    );

    if (!isPasswordCorrect) {
        throw new ApiError(
            400,
            "Invalid Password"
        );
    }

    const token = generateSupplierToken(supplier._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                supplier,
                token
            },
            "Supplier Login Successfully"
        )
    );
});

//Forgot Password Link

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiError(400, "All field required")
    }
    const supplier = await Supplier.findOne({ email })

    if (!supplier) {
        throw new ApiError(400, "Email Not Found")
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry =
        Date.now() +
        Number(process.env.RESET_TOKEN_EXPIRY) * 60 * 1000;

    supplier.resetToken = resetToken
    supplier.resetTokenExpiry = resetTokenExpiry
    await supplier.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    const data = await transporter.sendMail({
        to: supplier.email,
        subject: "Reset Password Link",
        html: `<a href="${resetLink}">Reset Password</a>`
    })



    /*
  Second Method (Using updateOne)
 
  await Supplier.updateOne(
     { email },
     {
       $set: {
         resetToken,
         resetTokenExpiry,
       },
     }
  );
 */

    return res.status(200).json(
        new ApiResponse(200, { resetToken, resetTokenExpiry, data }, "Password reset link has been sent in registered email..")
    )
})

//Reset Password

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params  // ye reset token nikalega 
    const { password, confirmPassword } = req.body

    if (!password || !confirmPassword) {
        throw new ApiError(400, "All feild required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(400, "Password and Confirm Password do not match");
    }

    const supplier = await Supplier.findOne({
        resetToken: token // restToken data base me save ha o match krega useparams wale token se
    })
    if (!supplier) {
        throw new ApiError(400, "Invalid Reset Link")
    }
    if (supplier.resetTokenExpiry < Date.now()) {
        throw new ApiError(400, "Reset Link Expired");
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    supplier.password = hashedPassword
    supplier.resetTokenExpiry = undefined;
    supplier.resetTokenExpiry = undefined;
    await supplier.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password Reset Successfully"
        )
    );
})


const getAllSuppliers = asyncHandler(async (req, res) => {

    const supplierDetails = await Supplier.aggregate([
        {
            $lookup: {
                from: "partdetails",
                localField: "_id",
                foreignField: "supplier",
                as: "parts",
            },
        },
        {
            $project: {
                supplierName: 1,
                supplierCode: 1,
                contactPerson: 1,
                email: 1,
                phone: 1,
                address: 1,

                totalParts: {
                    $size: "$parts",
                },

                totalGap: {
                    $sum: "$parts.gap",
                },
            },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            supplierDetails,
            "Supplier Details Fetched Successfully"
        )
    );
});

const getSupplierById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const supplierDetails = await Supplier.findById(id);

    if (!supplierDetails) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            supplierDetails,
            "Supplier Details Fetched Successfully"
        )
    );
});

const updateSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            supplier,
            "Supplier updated successfully"
        )
    );
});

const deleteSupplier = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
        throw new ApiError(404, "Supplier not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Supplier deleted successfully"
        )
    );
});

export { createSupplier, loginSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier, forgotPassword,resetPassword }