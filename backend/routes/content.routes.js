import express from "express";
import { getContentByPage, getContentBySection, getAllContent, createContent, updateContent, deleteContent } from "../controller/content.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/page/:page", getContentByPage);
router.get("/page/:page/:section", getContentBySection);

// Admin routes
router.get("/", verifyJWT, authorize("admin"), getAllContent);
router.post("/", verifyJWT, authorize("admin"), createContent);
router.put("/:id", verifyJWT, authorize("admin"), updateContent);
router.delete("/:id", verifyJWT, authorize("admin"), deleteContent);

export default router;
