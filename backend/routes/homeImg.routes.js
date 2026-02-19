import express from "express";
import { getAllImages, getImageById, uploadImg, updateImg, deleteImg, deleteImagesByType } from "../controller/homeImg.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";
import { upload } from "../middlewears/multer.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllImages);
router.get("/:id", getImageById);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), upload.single("img"), uploadImg);
router.put("/:id", verifyJWT, authorize("admin"), upload.single("img"), updateImg);
router.delete("/:id", verifyJWT, authorize("admin"), deleteImg);
router.delete("/type/:type", verifyJWT, authorize("admin"), deleteImagesByType);

export default router;
