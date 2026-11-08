import { parse } from "csv-parse/sync";
import { PressConfiguration } from "../models/presscapacity/press.configuration.model.js";
import { Supplier } from "../models/supplier.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { PartTonnageDetails } from "../models/presscapacity/part.tonnage.model.js";

const importPressdataConfiguration = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, "Please upload CSV file");
    }

    const rows = parse(req.file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    let importedCount = 0;

    for (const row of rows) {

        const supplier = await Supplier.findOne({
            supplierCode: row.supplierCode,
        });

        if (!supplier) {
            continue;
        }

        await PressConfiguration.create({
            supplierCode: supplier.supplierCode,
            supplierName: supplier.supplierName,
            location: row.location,
            tonnage: row.tonnage,
            numberOfPresses: Number(row["Number Of Presses"]),
            strokesPerMinute: Number(row["Strokes Per Minute"]),
            shiftsPerDay: Number(row["Shifts Per Day"]),
            hoursPerShift: Number(row["Hours Per Shift"]),
            efficiencyPercent: Number(row["Efficiency Percent"] || 85),
        });

        importedCount++;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { importedCount },
            "Press configuration imported successfully"
        )
    );
});


const importPartWiseTonnage = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, "Please upload CSV file");
    }

    const rows = parse(req.file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    for (const row of rows) {

        await PartTonnageDetails.create({

            srNo: Number(row["Sr. No."]),
            vendorCode: row["Vendor Code"],
            vendorName: row["Vendor Name"],
            plantLocation: row["Plant Loc."],
            partNo: row["Part No."],
            partName: row["Part Name"],

            model: row["Model"].split(",").map(item => item.trim()),

            qtyPerVehicle: Number(row["Qty/veh"]),
            perDayRequirement: Number(row["Per day req"]),
            noOfChildParts: Number(row["No. Of Child Part"]),

            tonnage: {
                "63T": Number(row["63T"] || 0),
                "110T": Number(row["110T"] || 0),
                "160T": Number(row["160T"] || 0),
                "200T": Number(row["200T"] || 0),
                "250T": Number(row["250T"] || 0),
                "300T": Number(row["300T"] || 0),
                "315T": Number(row["315T"] || 0),
                "400T": Number(row["400T"] || 0),
                "500T": Number(row["500T"] || 0),
                "600T": Number(row["600T"] || 0),
                "800T": Number(row["800T"] || 0),
            },
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Part-wise tonnage CSV uploaded successfully"
        )
    );
});

export { importPressdataConfiguration, importPartWiseTonnage };