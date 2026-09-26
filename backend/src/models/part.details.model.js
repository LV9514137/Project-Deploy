import mongoose from "mongoose";

const partDetailsSchema = new mongoose.Schema(
    {
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
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
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
            
        },

        currentCapacity: {
            type: Number,
            required: true,
        },

        requiredCapacity: {
            type: Number,
            required: true,
        },

        gap: {
            type: Number,
            required: true,
        },

        targetDate: {
            type: Date,
            required: true,
        },

        actualDate: {
            type: Date,
        },

        status: {
            type: String,
            enum: [
                "Open",
                "In Progress",
                "Completed",
                "Delayed",
            ],
            default: "Open",
        },

        remarks: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PartDetails =
    mongoose.models.PartDetails ||
    mongoose.model(
        "PartDetails",
        partDetailsSchema
    );