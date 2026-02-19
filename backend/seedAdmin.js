import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/amsterdam-rugby";

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ userName: "admin" });
        if (existing) {
            console.log("Admin user already exists!");
            console.log("  userName: admin");
            console.log("  role:", existing.role);
            await mongoose.disconnect();
            return;
        }

        const admin = await User.create({
            userName: "admin",
            password: "admin123",
            role: "admin",
        });

        console.log("Admin user created successfully!");
        console.log("  userName: admin");
        console.log("  password: admin123");
        console.log("  role: admin");
        console.log("  id:", admin._id);

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error seeding admin:", err.message);
        process.exit(1);
    }
}

seedAdmin();
