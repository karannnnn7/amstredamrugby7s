import express from "express";
import { getAllNews, getNewsById, createNews, updateNews, deleteNews } from "../controller/news.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";
import { upload } from "../middlewears/multer.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/:id", getNewsById);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), upload.single("img"), createNews);
router.put("/:id", verifyJWT, authorize("admin"), upload.single("img"), updateNews);
router.delete("/:id", verifyJWT, authorize("admin"), deleteNews);

export default router;
