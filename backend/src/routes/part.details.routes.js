import { Router } from "express";
import { createPart,getAllPartDetails,deletePartDetails,updatePartDetails, getPartDetailsById } from "../controller/part.details.controller.js";
import authSupplier from "../middleware/authSupplier.middleware.js";
import { getMyParts } from "../controller/part.details.controller.js";
import authAdmin from "../middleware/adminAuth.middleware.js";

const router= Router()

router.post("/", authSupplier, createPart);

router.get("/all-parts", authAdmin, getAllPartDetails);
router.get("/my-parts", authSupplier, getMyParts);

router.get("/:id", authSupplier, getPartDetailsById);

router.patch("/:id", authSupplier, updatePartDetails);

router.delete("/:id", authSupplier, deletePartDetails);


export default router