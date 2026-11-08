import { Router } from "express";

import { createPressConfiguration, deletePressConfiguration, getAllPressConfigurations, getAvailablePressCapacity, getPressConfigurationById,getCapacityUtilization } from "../controller/press.configuration.controller.js";
import authAdmin from "../middleware/adminAuth.middleware.js";

const router = Router()

router.post("/create", createPressConfiguration);
// Get all press configurations
router.get("/", getAllPressConfigurations);

router.get("/available-strokes", getAvailablePressCapacity)
router.get( "/capacity-utilization", getCapacityUtilization
);

// Get press configuration by ID
router.get("/:id", getPressConfigurationById);

// Delete press configuration
router.delete("/:id", deletePressConfiguration);



export default router;