import express from "express";
import { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam } from "../controller/team.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeams);
router.get("/:id", getTeamById);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), createTeam);
router.put("/:id", verifyJWT, authorize("admin"), updateTeam);
router.delete("/:id", verifyJWT, authorize("admin"), deleteTeam);

export default router;
