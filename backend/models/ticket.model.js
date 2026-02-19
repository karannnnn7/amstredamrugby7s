import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    features: [{ type: String }],
    recommended: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const Ticket = mongoose.model("Ticket", ticketSchema)
