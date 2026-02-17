import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = mongoose.Schema({
    userName : {
        type : String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: null
    }
},{timestamps:true})

UserSchema.pre('save',async function(next) {
    if(!this.isModified("password")|| !this.password) return;

    this.password = await bcrypt.hash(this.password,10)
    
})
UserSchema.methods.isPassword = async function(password) {
    return await bcrypt.compare(password,this.password)
}
UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        userName: this.userName,
        role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    } 
)
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",UserSchema)
