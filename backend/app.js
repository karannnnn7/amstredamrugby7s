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
  origin: process.env.CORS_ORIGIN.split(',') ,
  credentials: true,
}))

app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({ extended: true, limit: "100kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Auth routes
import userRouter from './routes/user.routes.js'
app.use('/api/v1/users', userRouter)

// Content routes
import homeImgRouter from './routes/homeImg.routes.js'
import contentRouter from './routes/content.routes.js'
import sponsorRouter from './routes/sponsor.routes.js'
import teamRouter from './routes/team.routes.js'
import ticketRouter from './routes/ticket.routes.js'
import newsRouter from './routes/news.routes.js'
import ruleRouter from './routes/rule.routes.js'
import siteConfigRouter from './routes/siteConfig.routes.js'

app.use('/api/v1/images', homeImgRouter)
app.use('/api/v1/content', contentRouter)
app.use('/api/v1/sponsors', sponsorRouter)
app.use('/api/v1/teams', teamRouter)
app.use('/api/v1/tickets', ticketRouter)
app.use('/api/v1/news', newsRouter)
app.use('/api/v1/rules', ruleRouter)
app.use('/api/v1/config', siteConfigRouter)

app.use(errorHandler)

export default app 