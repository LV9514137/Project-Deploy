
import { PressConfiguration } from "../models/presscapacity/press.configuration.model.js";
import { Supplier } from "../models/supplier.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import mongoose from "mongoose";
import { PartTonnageDetails } from "../models/presscapacity/part.tonnage.model.js";

// Create Press Configuration
const createPressConfiguration = asyncHandler(async (req, res) => {
    const {
        supplierCode,
        supplierName,
        location,
        tonnage,
        numberOfPresses,
        strokesPerMinute,
        shiftsPerDay,
        hoursPerShift,
        efficiencyPercent,

    } = req.body;

    if (!supplierCode || !location || !tonnage) {
        throw new ApiError(
            400,
            "Supplier, location and tonnage are required"
        );
    }

    let supplierExists = await Supplier.findOne({ supplierCode });

    // Agar frontend se MongoDB ID aa rahi hai
    if (!supplierExists && mongoose.isValidObjectId(supplierCode)) {
        supplierExists = await Supplier.findById(supplierCode);
    }

    if (!supplierExists) {
        throw new ApiError(404, "Supplier not found");
    }
    console.log("Supplier Code:", supplierExists.supplierCode);
    const existingConfiguration = await PressConfiguration.findOne({
        supplierCode: supplierExists.supplierCode,
        location,
        tonnage,
    });

    if (existingConfiguration) {
        throw new ApiError(400, "Press configuration already exists");
    }

    const configuration = await PressConfiguration.create({
        supplierCode: supplierExists.supplierCode,
        supplierName,
        location,
        tonnage,
        numberOfPresses,
        strokesPerMinute,
        shiftsPerDay,
        hoursPerShift,
        efficiencyPercent,
    });


    return res.status(201).json(
        new ApiResponse(
            201,
            configuration,
            "Press configuration created successfully"
        )
    );
});

// Get All Press Configurations (Admin)
const getAllPressConfigurations = asyncHandler(async (req, res) => {
    const configurations = await PressConfiguration.find()
        .populate("supplier", "supplierCode supplierName")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            configurations,
            "Press configurations fetched successfully"
        )
    );
});

// Get Press Configurations by ID
const getPressConfigurationById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const configuration = await PressConfiguration.findById(id)
        .populate("supplier", "supplierCode supplierName");

    if (!configuration) {
        throw new ApiError(404, "Press configuration not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            configuration,
            "Press configuration fetched successfully"
        )
    );
});


// Delete Press Configuration
const deletePressConfiguration = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const configuration = await PressConfiguration.findByIdAndDelete(id);

    if (!configuration) {
        throw new ApiError(404, "Press configuration not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Press configuration deleted successfully"
        )
    );
});

const getAvailablePressCapacity = asyncHandler(async (req, res) => {

    const configuration = await PressConfiguration.find();

    if (configuration.length === 0) {
        throw new ApiError(400, "No press configuration found")
    }

    const capacity = configuration.map((press) => {

        const availablestrokes =
            press.numberOfPresses * press.strokesPerMinute * 60 * press.shiftsPerDay * press.hoursPerShift * (press.efficiencyPercent / 100)


        return {
            supplierCode: press.supplierCode,
            supplierName: press.supplierName,
            location: press.location,
            tonnage: press.tonnage,
            numberOfPresses: press.numberOfPresses,
            strokesPerMinute: press.strokesPerMinute,
            hoursPerShift: press.hoursPerShift,
            shiftsPerDay: press.shiftsPerDay,
            efficiencyPercent: press.efficiencyPercent,
            availableStrokesPerDay: availablestrokes,
        }
    })
    return res.status(200).json(
        new ApiResponse(
            200,
            capacity,
            "Available press capacity calculated successfully"
        )
    );


})

const getCapacityUtilization = asyncHandler(async (req, res) => {

    const configurations = await PressConfiguration.find();
    const parts = await PartTonnageDetails.find();

    const result = [];

    for (const press of configurations) {

        const availableStrokes =
            press.numberOfPresses *
            press.strokesPerMinute *
            60 *
            press.shiftsPerDay *
            press.hoursPerShift *
            (press.efficiencyPercent / 100);

        let requiredStrokes = 0;

        for (const part of parts) {

            if (part.vendorCode === press.supplierCode) {

                const strokesPerPart = part.tonnage.get(press.tonnage) || 0;

                requiredStrokes +=
                    part.qtyPerVehicle *
                    part.perDayRequirement *
                    strokesPerPart;
            }
        }

        const utilization =
            availableStrokes > 0
                ? (requiredStrokes / availableStrokes) * 100
                : 0;

        result.push({
            supplierCode: press.supplierCode,
            supplierName:press.supplierName,
            location: press.location,
            tonnage: press.tonnage,
            numberOfPresses: press.numberOfPresses,
            availableStrokesPerDay: Math.round(availableStrokes),
            requiredStrokesPerDay: requiredStrokes,
            utilizationPercent: Number(utilization.toFixed(2)),
            remainingCapacity: Math.round(availableStrokes - requiredStrokes)
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            result,
            "Capacity utilization calculated successfully"
        )
    );
});

export {
    createPressConfiguration,
    getAllPressConfigurations,
    getPressConfigurationById,
    deletePressConfiguration,
    getAvailablePressCapacity,
    getCapacityUtilization
};



