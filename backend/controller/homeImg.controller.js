import { homeImgModel } from "../models/homeImg.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, replaceOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

// GET all images (public) — supports pagination and filtering
const getAllImages = asyncHandler(async (req, res) => {
    const filter = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    if (req.query.type) {
        filter.type = req.query.type;
    }

    // Support excluding specific types (e.g., exclude system types like slider, social, festival)
    if (req.query.exclude_type) {
        const excluded = req.query.exclude_type.split(',');
        filter.type = { $nin: excluded };
    }

    const images = await homeImgModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json(new ApiResponse(200, images, "Images fetched successfully"));
});

// GET single image by id
const getImageById = asyncHandler(async (req, res) => {
    const image = await homeImgModel.findById(req.params.id);
    if (!image) {
        throw new ApiError(404, "Image not found");
    }
    res.status(200).json(new ApiResponse(200, image, "Image fetched successfully"));
});

// POST upload image (admin)
const uploadImg = asyncHandler(async (req, res) => {
    const imgFile = req.file;
    const type = req.body.type;

    if (!imgFile) {
        throw new ApiError(400, "Image file is required");
    }
    const uploaded = await uploadOnCloudinary(imgFile.path, "home-page");
    if (!uploaded) {
        throw new ApiError(400, "Image upload to Cloudinary failed");
    }
    const homeImg = await homeImgModel.create({
        img: uploaded.url,
        public_id: uploaded.public_id,
        filename: uploaded.original_filename || imgFile.originalname,
        contentType: imgFile.mimetype,
        type: type || "slider"
    });
    res.status(201).json(new ApiResponse(201, homeImg, "Image uploaded successfully"));
});

// PUT update image (admin)
const updateImg = asyncHandler(async (req, res) => {
    const homeImg = await homeImgModel.findById(req.params.id);
    if (!homeImg) {
        throw new ApiError(404, "Image not found");
    }

    const imgFile = req.file;
    const type = req.body.type;

    if (imgFile) {
        const uploaded = await replaceOnCloudinary(imgFile.path, homeImg.img, "home-page");
        if (!uploaded) {
            throw new ApiError(400, "Image upload to Cloudinary failed");
        }
        homeImg.img = uploaded.url;
        homeImg.public_id = uploaded.public_id;
        homeImg.filename = uploaded.original_filename || imgFile.originalname;
        homeImg.contentType = imgFile.mimetype;
    }

    if (type) homeImg.type = type;
    await homeImg.save();
    res.status(200).json(new ApiResponse(200, homeImg, "Image updated successfully"));
});

// DELETE image (admin)
const deleteImg = asyncHandler(async (req, res) => {
    const homeImg = await homeImgModel.findById(req.params.id);
    if (!homeImg) {
        throw new ApiError(404, "Image not found");
    }
    if (homeImg.img) {
        await deleteOnCloudinary(homeImg.img);
    }
    await homeImgModel.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Image deleted successfully"));
});

// DELETE all images by type (admin)
const deleteImagesByType = asyncHandler(async (req, res) => {
    const { type } = req.params;
    if (!type) throw new ApiError(400, "Type is required");

    // Find all images of this type
    const images = await homeImgModel.find({ type });

    // Delete from Cloudinary
    for (const img of images) {
        if (img.img) {
            await deleteOnCloudinary(img.img);
        }
    }

    // Delete from DB
    await homeImgModel.deleteMany({ type });

    res.status(200).json(new ApiResponse(200, null, `All images of type '${type}' deleted successfully`));
});

export { getAllImages, getImageById, uploadImg, updateImg, deleteImg, deleteImagesByType };