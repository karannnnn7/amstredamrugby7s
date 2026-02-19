import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rules: [{ type: String }],
    category: {
        type: String,
        enum: ["match-format", "scoring", "discipline", "eligibility", "general"],
        default: "general"
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const Rule = mongoose.model("Rule", ruleSchema)
