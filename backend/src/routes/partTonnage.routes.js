
import express from "express";

import {
    getPartTonnageDashboard
} from "../controller/partTonnage.controller.js";



const router = express.Router();

router.get(
    "/part-tonnage-dashboard",
    getPartTonnageDashboard
);

export default router;
