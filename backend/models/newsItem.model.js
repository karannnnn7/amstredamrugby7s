import mongoose from "mongoose";

const newsItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    category: {
        type: String,
        enum: ["Tournament", "Festival", "Tickets", "General"],
        default: "General"
    },
    img: { type: String },
    public_id: { type: String },
    filename: { type: String },
    contentType: { type: String },
    body: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

export const NewsItem = mongoose.model("NewsItem", newsItemSchema)
