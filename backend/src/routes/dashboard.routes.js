import { Router } from "express";
import { dashboardSummary, supplierWiseSummary,getPartsByStatus,overdueParts,topGapParts ,myParts} from "../controller/dashboard.controller.js";
import authSupplier from "../middleware/authSupplier.middleware.js";
import authAdmin from "../middleware/adminAuth.middleware.js";

const router = Router();

router.get("/summary", authSupplier,dashboardSummary);
router.get("/supplier-summary",authAdmin, supplierWiseSummary);
router.get("/status/:status", authSupplier, getPartsByStatus);

router.get("/overdue", overdueParts);

router.get("/top-gap", topGapParts);
router.get("/my-parts", authSupplier, myParts);

export default router;