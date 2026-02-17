const sponcersSchema = new mongoose.Schema({
    name: { type: String },
    type: {
        type: String,
        enum: ["official-sponsors", "sub-sponsors"],
        default: "sub-ponsors"
    },
    filename: { type: String },
    img: { type: String },
    public_id: { type: String },
    contentType: { type: String },
},{timestamps:true})