import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    category: {
        type: String,
        enum: ["ELITE MEN", "ELITE WOMEN", "SOCIAL", "VETS"],
        required: true
    },
    logo: { type: String },
    color: { type: String, default: "bg-gray-600" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const Team = mongoose.model("Team", teamSchema)
