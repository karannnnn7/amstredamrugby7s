import { Ticket } from "../models/ticket.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET all tickets (public)
const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(new ApiResponse(200, tickets, "Tickets fetched successfully"));
});

// GET single ticket
const getTicketById = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }
    res.status(200).json(new ApiResponse(200, ticket, "Ticket fetched successfully"));
});

// POST create ticket (admin)
const createTicket = asyncHandler(async (req, res) => {
    const { title, price, features, recommended, order } = req.body;

    if (!title || price === undefined) {
        throw new ApiError(400, "Title and price are required");
    }

    const ticket = await Ticket.create({ title, price, features, recommended, order });
    res.status(201).json(new ApiResponse(201, ticket, "Ticket created successfully"));
});

// PUT update ticket (admin)
const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    const { title, price, features, recommended, order, isActive } = req.body;

    if (title !== undefined) ticket.title = title;
    if (price !== undefined) ticket.price = price;
    if (features !== undefined) ticket.features = features;
    if (recommended !== undefined) ticket.recommended = recommended;
    if (order !== undefined) ticket.order = order;
    if (isActive !== undefined) ticket.isActive = isActive;

    await ticket.save();
    res.status(200).json(new ApiResponse(200, ticket, "Ticket updated successfully"));
});

// DELETE ticket (admin)
const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Ticket deleted successfully"));
});

export { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket };
