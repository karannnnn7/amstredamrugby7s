import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: { type: String }
}, { timestamps: true })

export const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema)
