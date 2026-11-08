
import mongoose from "mongoose";

const partTonnageSchema = new mongoose.Schema(
    {
        srNo: {
            type: Number,
        },

        vendorCode: {
            type: String,
            required: true,
            trim: true,
        },

        vendorName: {
            type: String,
            required: true,
            trim: true,
        },

        plantLocation: {
            type: String,
            required: true,
            trim: true,
        },

        partNo: {
            type: String,
            required: true,
            trim: true,
        },

        partName: {
            type: String,
            required: true,
            trim: true,
        },

        model: {
            type: [String],
            required: true,
            trim: true,
        },

        qtyPerVehicle: {
            type: Number,
            required: true,
            min: 0,
        },

        perDayRequirement: {
            type: Number,
            required: true,
            min: 0,
        },

        noOfChildParts: {
            type: Number,
            required: true,
            min: 0,
        },

        tonnage: {
            type: Map,
            of: {
                type: Number,
                min: 0,
            },
            default: () => new Map(),
        },
    },
    {
        timestamps: true,
    }
);

partTonnageSchema.index(
    {
        vendorCode: 1,
        plantLocation: 1,
        partNo: 1,
    },
    { unique: true }
);

export const PartTonnageDetails =
    mongoose.models.PartTonnageDetails ||
    mongoose.model("PartTonnageDetails", partTonnageSchema);
