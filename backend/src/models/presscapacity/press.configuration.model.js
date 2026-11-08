
import mongoose from "mongoose";

const pressConfigurationSchema = new mongoose.Schema(
    {
        supplierCode: {
     type: String,
            required: true,
            trim: true
},


        supplierName: {
     type: String,
      required: true,
    
            trim: true
},

        location: {
            type: String,
            required: true,
            trim: true,
        },

        tonnage: {
            type: String,
            required: true,
            enum: [
                "63T",
                "110T",
                "160T",
                "200T",
                "250T",
                "300T",
                "315T",
                "400T",
                "500T",
                "600T",
                "800T",
            ],
        },

        numberOfPresses: {
            type: Number,
            required: true,
            min: 0,
        },

        strokesPerMinute: {
            type: Number,
            required: true,
            min: 0,
        },

        shiftsPerDay: {
            type: Number,
            required: true,
            min: 0,
        },

        hoursPerShift: {
            type: Number,
            required: true,
            min: 0,
        },

        efficiencyPercent: {
            type: Number,
            min: 0,
            max: 100,
            default: 85,
        },

       
    },
    {
        timestamps: true,
    }
);

// One configuration per supplier, plant and tonnage
pressConfigurationSchema.index(
    { supplierCode: 1, location: 1, tonnage: 1 },
    { unique: true }
);

export const PressConfiguration =
    mongoose.models.PressConfiguration ||
    mongoose.model("PressConfiguration", pressConfigurationSchema);
