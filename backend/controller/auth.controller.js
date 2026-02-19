import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const giveUserToken = await User.findById(userId)
        const accessToken = giveUserToken.generateAccessToken()
        const refreshToken = giveUserToken.generateRefreshToken()

        giveUserToken.refreshToken = refreshToken // give to db 
        await giveUserToken.save({ validateBeforeSave: false }) // save token // if validation is not false than need to again verfy the user
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "somthing went wrong while generate tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { userName, password, role } = req.body
    if (!userName || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({ userName })
    if (existedUser) {
        throw new ApiError(404, "User already exists")
    }
    const user = await User.create({
        userName: userName,
        password: password,
        role: role || ""
    })
    if (!user) {
        throw new ApiError(404, "User not created")
    }
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    res.status(200).json(new ApiResponse(200, createdUser, "user registered successfully"))
})
const login = asyncHandler(async (req, res) => {
    const { userName, password } = req.body
    if (!userName || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findOne({ userName }).select("+password")
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const isPasswordValid = await user.isPassword(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)
    await user.save({ validateBeforeSave: false })
    const login = user.toObject()
    delete login.password
    delete login.refreshToken
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    }
    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { ...login, accessToken }, "user logged In done"))
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate( // update the token
        req.user._id,
        {

            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = { // not alloed to modify the cookies
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "user logged out"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "user fetched successfully"))
})

export { login, logout, refreshAccessToken, registerUser, getCurrentUser }