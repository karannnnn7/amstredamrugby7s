import mongoose from "mongoose";

const pageContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        enum: ["home", "tickets", "enter-team", "teams", "visitors", "rules", "sustainability", "recycle", "photos", "charity", "contact"]
    },
    section: {
        type: String,
        required: true
    },
    heading: { type: String },
    subheading: { type: String },
    body: { type: String },
    bodyItems: [{ type: String }],
    ctaText: { type: String },
    ctaLink: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

pageContentSchema.index({ page: 1, section: 1 });

export const PageContent = mongoose.model("PageContent", pageContentSchema)
