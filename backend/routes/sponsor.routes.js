import express from "express";
import { getAllSponsors, getSponsorById, createSponsor, updateSponsor, deleteSponsor } from "../controller/sponsor.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";
import { upload } from "../middlewears/multer.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllSponsors);
router.get("/:id", getSponsorById);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), upload.single("img"), createSponsor);
router.put("/:id", verifyJWT, authorize("admin"), upload.single("img"), updateSponsor);
router.delete("/:id", verifyJWT, authorize("admin"), deleteSponsor);

export default router;
