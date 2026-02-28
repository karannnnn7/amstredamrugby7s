import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    price: { type: String },
    category: {
        type: String
    },
    logo: { type: String },
    color: { type: String, default: "bg-gray-600" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const Team = mongoose.model("Team", teamSchema)
