import { Router } from "express";

import authAdmin from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import { importPartWiseTonnage, importPressdataConfiguration } from "../controller/import.controller.js";

const router = Router();



router.post(
  "/press-configuration",
  
  upload.single("file"),
 importPressdataConfiguration
);

router.post(
  "/part-tonnage",
  
  upload.single("file"),
 importPartWiseTonnage
);


export default router;