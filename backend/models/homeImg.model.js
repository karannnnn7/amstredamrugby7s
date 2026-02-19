import mongoose from "mongoose";

const homeImgSchema = new mongoose.Schema({
    filename: { type: String },
    img: { type: String, required: true },
    public_id: { type: String, required: true },
    contentType: { type: String },
    type: {
        type: String,
        default: "slider"
    }
}, {
    timestamps: true
})

export const homeImgModel = mongoose.model("homeImg", homeImgSchema)
