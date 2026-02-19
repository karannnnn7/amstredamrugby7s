import express from "express";
import { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket } from "../controller/ticket.controller.js";
import { verifyJWT, authorize } from "../middlewears/auth.middlewares.js";

const router = express.Router();

// Public routes
router.get("/", getAllTickets);
router.get("/:id", getTicketById);

// Admin routes
router.post("/", verifyJWT, authorize("admin"), createTicket);
router.put("/:id", verifyJWT, authorize("admin"), updateTicket);
router.delete("/:id", verifyJWT, authorize("admin"), deleteTicket);

export default router;
