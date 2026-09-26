import { Supplier } from "../models/supplier.model.js";
import validator from "validator"
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import generateSupplierToken from "../utils/generateSupplierToken.js";


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

 //Edited
const getAllSuppliers = asyncHandler(async (req, res) => {

    const supplierDetails = await Supplier.find();

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

export { createSupplier, loginSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier }