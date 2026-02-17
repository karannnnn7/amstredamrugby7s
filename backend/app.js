import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import { errorHandler } from "./middlewears/errorHandler.middlewares.js";
import connectDB from "./db/db.js";

await connectDB().then(() => {
    console.log("db connected");
}).catch((error) => {
    console.log("db connection error", error);
})
const app = express()
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({ extended: true, limit: "100kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

import userRouter from './routes/user.routes.js'
app.use('/api/v1/users', userRouter)




app.use(errorHandler)

export { app }