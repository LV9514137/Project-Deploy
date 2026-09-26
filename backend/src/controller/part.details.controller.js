import { PartDetails } from "../models/part.details.model.js";
import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const createPart = asyncHandler(async (req, res) => {

    const {
        partNo,
        partName,
        model,
        location,
        currentCapacity,
        requiredCapacity,
        targetDate,
        remarks
    } = req.body;

    const existingPart = await PartDetails.findOne({
        supplier: req.supplierId,
        partNo
    });

    if (existingPart) {
        throw new ApiError(
            400,
            "Part already exists"
        );
    }
    if (Number(requiredCapacity) < Number(currentCapacity)) {
        throw new ApiError(
            400,
            "Required Capacity cannot be less than Current Capacity"
        );
    }

    const gap =
        Number(requiredCapacity) -
        Number(currentCapacity);

    const createdPart = await PartDetails.create({
        supplier: req.supplierId,
        partNo,
        partName,
        model,
        location,
        currentCapacity,
        requiredCapacity,
        gap,
        targetDate,
        remarks
    });

    const partdetails = await PartDetails
        .findById(createdPart._id)
        .populate(
            "supplier",
            "supplierCode supplierName"
        );

    return res.status(201).json(
        new ApiResponse(
            201,
            partdetails,
            "Part created successfully"
        )
    );
});

const getPartDetailsById = asyncHandler(async (req, res) => {

    const { id } = req.params

    const partdetails = await PartDetails.findById(id).populate("supplier", "supplierCode supplierName contactPerson email")

    if (!partdetails) {
        throw new ApiError(
            404,
            "Part not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            partdetails,
            "Part Details Fetched Successfully"
        )
    );
})

// For Admin
const getAllPartDetails = asyncHandler(async (req, res) => {

    const partdetails = await PartDetails.find().populate("supplier", "supplierCode supplierName contactPerson email")

    if (!partdetails) {
        throw new ApiError(
            404,
            "Part not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            partdetails,
            "All Part Details Fetched Successfully"
        )
    );
})

//for supplier
const getMyParts = asyncHandler(async (req, res) => {
    const parts = await PartDetails.find({
        supplier: req.supplierId
    }).populate(
        "supplier",
        "supplierCode supplierName"
    );

    return res.status(200).json(
        new ApiResponse(200, parts, "My Parts")
    );
});

const updatePartDetails = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const part = await PartDetails.findById(id);

    if (!part) {
        throw new ApiError(404, "Part not found");
    }

    if (
        req.body.currentCapacity !== undefined ||
        req.body.requiredCapacity !== undefined
    ) {
        req.body.gap =
            Number(
                req.body.requiredCapacity ??
                part.requiredCapacity
            ) -
            Number(
                req.body.currentCapacity ??
                part.currentCapacity
            );
    }

    const updatedPart = await PartDetails.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "supplier",
        "supplierCode supplierName"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPart,
            "Part updated successfully"
        )
    );
});

const deletePartDetails = asyncHandler(async (req, res) => {
    const { id } = req.params
    const deletedpart = await PartDetails.findByIdAndDelete(id)

    if (!deletedpart) {
        throw new ApiError(400, "Part Not Found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Part deleted successfully"
        )
    );
})

export { createPart, getPartDetailsById, getAllPartDetails, updatePartDetails, deletePartDetails,getMyParts }