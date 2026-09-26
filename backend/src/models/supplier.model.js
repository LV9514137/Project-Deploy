import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
      trim: true,
    },

    supplierCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true
    },


    contactPerson: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },
    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Supplier =
  mongoose.models.Supplier ||
  mongoose.model("Supplier", supplierSchema);