import mongoose from "mongoose";
const hometextSchema = new mongoose.Schema({
    text1: String,
    text2: String,
    text3: String,
    text4: String,
    category: {
        type: String,
        enum: ["home", "about", "contact"],
        default: "home"
    }

},{timestamps:true})

export const hometext = mongoose.model("hometext", hometextSchema)
