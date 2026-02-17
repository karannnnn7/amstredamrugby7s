import { homeImgModel } from "../models/homeImg.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { replaceOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

const uploadImg = asyncHandler(async (req, res) => {
    const img = req.file.img[0];
    const type = req.body.type;

    if (!img) {
        throw new ApiError(400, "Image is required")
    }
    const uploadImg = await uploadOnCloudinary(img.path, "home-page")
    if (!uploadImg) {
        throw new ApiError(400, "Image upload failed")
    }
    const homeImg = await homeImgModel.create({
        img: uploadImg.url,
        public_id: uploadImg.public_id,
        filename: uploadImg.filename,
        contentType: uploadImg.contentType,
        type: type
    })
    if (!homeImg) {
        throw new ApiError(400, "Image upload failed")
    }
    res.status(201).json(new ApiResponse(201, homeImg, "Image uploaded successfully"))
})
const updateImg = asyncHandler(async (req, res) => {
    const img = req.file.img[0];
    const type = req.body.type;
    const homeImg = await homeImgModel.findById(req.params.id)
    if (!homeImg) {
        throw new ApiError(404, "Image not found")
    }
    const uploadImg = await replaceOnCloudinary(img.path, homeImg.img, "home-page")
    if (!uploadImg) {
        throw new ApiError(400, "Image upload failed")
    }
    homeImg.img = uploadImg.url
    homeImg.public_id = uploadImg.public_id
    homeImg.filename = uploadImg.filename
    homeImg.contentType = uploadImg.contentType
    homeImg.type = type
    await homeImg.save()
    res.status(200).json(new ApiResponse(200, homeImg, "Image updated successfully"))
})