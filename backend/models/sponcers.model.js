import mongoose from "mongoose";

const sponcersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subName: { type: String },
    role: { type: String },
    type: {
        type: String,
        enum: ["official-sponsors", "sub-sponsors"],
        default: "sub-sponsors"
    },
    filename: { type: String },
    img: { type: String },
    public_id: { type: String },
    contentType: { type: String },
}, { timestamps: true })

export const Sponsor = mongoose.model("Sponsor", sponcersSchema)