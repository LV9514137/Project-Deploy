
import { PartTonnageDetails } from "../models/presscapacity/part.tonnage.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getPartTonnageDashboard = asyncHandler(async (req, res) => {

    const parts = await PartTonnageDetails.find();

    const totalParts = parts.length;

    const suppliers = [...new Set(parts.map(item => item.vendorCode))];

    const models = [...new Set(
        parts.flatMap(item => item.model || [])
    )];

    const tonnageList = [
        "63T", "110T", "160T", "200T", "250T",
        "300T", "315T", "400T", "500T", "600T", "800T"
    ];

    const tonnageDistribution = tonnageList.map(tonnage => ({
        tonnage,
        count: parts.filter(item => item.tonnage.get(tonnage) > 0).length
    }));

    const supplierDistribution = suppliers.map(code => ({
        name: code,
        count: parts.filter(item => item.vendorCode === code).length
    }));

    const modelDistribution = models.map(name => ({
        name,
        count: parts.filter(item => item.model.includes(name)).length
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            totalParts,
            totalSuppliers: suppliers.length,
            totalModels: models.length,
            tonnageDistribution,
            supplierDistribution,
            modelDistribution,
            parts
        }, "Part tonnage dashboard data fetched successfully")
    );
});

export { getPartTonnageDashboard };
