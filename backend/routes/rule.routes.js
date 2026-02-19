import express from "express";
import { getAllRules, getRuleById, createRule, updateRule, deleteRule } from "../controller/rule.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllRules);
router.get("/:id", getRuleById);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), createRule);
router.put("/:id", verifyJWT, authorize("admin"), updateRule);
router.delete("/:id", verifyJWT, authorize("admin"), deleteRule);

export default router;
