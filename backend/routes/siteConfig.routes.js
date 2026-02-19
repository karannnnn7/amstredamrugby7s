import express from "express";
import { getAllConfig, getConfigByKey, upsertConfig, bulkUpsertConfig, deleteConfig } from "../controller/siteConfig.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllConfig);
router.get("/:key", getConfigByKey);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), upsertConfig);
router.post("/bulk", verifyJWT, authorize("admin"), bulkUpsertConfig);
router.delete("/:key", verifyJWT, authorize("admin"), deleteConfig);

export default router;
