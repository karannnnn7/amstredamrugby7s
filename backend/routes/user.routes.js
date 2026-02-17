import express from "express";
import { registerUser, login, logout, refreshAccessToken, getCurrentUser } from "../controller/auth.controller.js";
import { verifyJWT } from "../middlewears/auth.middlewares.js";

const router = express.Router()

// router.route("/register").post(registerUser)
router.post("/register", registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT,getCurrentUser)

export default router