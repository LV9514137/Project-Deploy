import { PartDetails } from "../models/part.details.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const dashboardSummary = asyncHandler(async (req, res) => {

    const totalParts = await PartDetails.countDocuments({
        supplier: req.supplierId
    });

    const openParts = await PartDetails.countDocuments({
        supplier: req.supplierId,
        status: "Open"
    });

    const inProgressParts = await PartDetails.countDocuments({
        supplier: req.supplierId,
        status: "In Progress"
    });

    const completedParts = await PartDetails.countDocuments({
        supplier: req.supplierId,
        status: "Completed"
    });

    const delayedParts = await PartDetails.countDocuments({
        supplier: req.supplierId,
        status: "Delayed"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalParts,
                openParts,
                inProgressParts,
                completedParts,
                delayedParts
            },
            "Dashboard Summary Fetched Successfully"
        )
    );
});

const supplierWiseSummary = asyncHandler(async (req, res) => {

    const summary = await PartDetails.aggregate(
        [
            {
                $group: {
                    _id: "$supplier",
                    totalParts: {
                        $sum: 1
                    },
                    totalGap: {
                        $sum: "$gap"
                    }
                }
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "supplier"
                }
            },
            {
                $unwind: "$supplier"
            },
            {
                $project: {
                    supplierName:
                        "$supplier.supplierName",

                    supplierCode:
                        "$supplier.supplierCode",

                    totalParts: 1,
                    totalGap: 1
                }
            }
        ]

    )
    return res.status(200).json(
        new ApiResponse(
            200,
            summary,
            "Supplier Summary Fetched Successfully"
        )
    );
})

const supplierWiseDashboard = asyncHandler(async (req, res) => {

    const summary = await PartDetails.aggregate(
        [
            {
                $group: {
                    _id: "$supplier",
                    totalParts: {
                        $sum: 1
                    },
                    openParts: {
                        $sum: 1
                    },
                    inProgressParts: {
                        $sum: 1
                    },
                    completedParts: {
                        $sum: 1
                    },
                    delayedParts: {
                        $sum: 1
                    }
                }
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "supplier"
                }
            },
            {
                $unwind: "$supplier"
            },
            {
                $project: {
                    supplierName:
                        "$supplier.supplierName",

                    supplierCode:
                        "$supplier.supplierCode",

                    totalParts: 1,
                    totalGap: 1
                }
            }
        ]

    )
    return res.status(200).json(
        new ApiResponse(
            200,
            summary,
            "Supplier Summary Fetched Successfully"
        )
    );
})

const getPartsByStatus = asyncHandler(async (req, res) => {

    const { status } = req.params;

    const parts = await PartDetails.find({
        status
    }).populate(
        "supplier",
        "supplierCode supplierName"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            parts,
            "Parts fetched successfully"
        )
    );
});

const overdueParts = asyncHandler(async (req, res) => {

    const parts = await PartDetails.find({
        targetDate: { $lt: new Date() },
        status: { $ne: "Completed" }
    }).populate("supplier");

    return res.status(200).json(
        new ApiResponse(
            200,
            parts,
            "Overdue Parts Fetched"
        )
    );
});

const topGapParts = asyncHandler(async (req, res) => {

    const parts = await PartDetails
        .find()
        .sort({ gap: -1 })
        .limit(10);

    return res.status(200).json(
        new ApiResponse(
            200,
            parts,
            "Top Gap Parts Fetched"
        )
    );
});

const myParts = asyncHandler(async (req, res) => {

    const parts = await PartDetails.find({
        supplier: req.supplierId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            parts,
            "My Parts Fetched Successfully"
        )
    );
});

export { dashboardSummary, supplierWiseSummary, getPartsByStatus, overdueParts, topGapParts, myParts };