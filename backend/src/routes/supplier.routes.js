import { Router } from "express";
import { createSupplier, deleteSupplier, forgotPassword, getAllSuppliers, getSupplierById, loginSupplier, resetPassword, updateSupplier } from "../controller/supplier.controller.js";
import authAdmin from "../middleware/adminAuth.middleware.js";

const router= Router()

router.post("/register", createSupplier);
router.post("/login", loginSupplier);

router.get("/", authAdmin, getAllSuppliers);

router.get("/:id", authAdmin, getSupplierById);

router.put("/:id", authAdmin, updateSupplier);

router.delete("/:id", authAdmin, deleteSupplier);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token", resetPassword);

export default router