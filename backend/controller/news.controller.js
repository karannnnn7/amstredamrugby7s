import { NewsItem } from "../models/newsItem.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, replaceOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

// GET all news (public) — optional ?category=Tournament filter
const getAllNews = asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) {
        filter.category = req.query.category;
    }
    const news = await NewsItem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, news, "News fetched successfully"));
});

// GET single news item
const getNewsById = asyncHandler(async (req, res) => {
    const news = await NewsItem.findById(req.params.id);
    if (!news) {
        throw new ApiError(404, "News item not found");
    }
    res.status(200).json(new ApiResponse(200, news, "News fetched successfully"));
});

// POST create news (admin)
const createNews = asyncHandler(async (req, res) => {
    const { title, date, category, body } = req.body;
    const imgFile = req.file;

    if (!title || !date) {
        throw new ApiError(400, "Title and date are required");
    }

    let imgData = {};
    if (imgFile) {
        const uploaded = await uploadOnCloudinary(imgFile.path, "news");
        if (!uploaded) {
            throw new ApiError(400, "Image upload to Cloudinary failed");
        }
        imgData = {
            img: uploaded.url,
            public_id: uploaded.public_id,
            filename: uploaded.original_filename || imgFile.originalname,
            contentType: imgFile.mimetype
        };
    }

    const news = await NewsItem.create({
        title, date, category, body, ...imgData
    });
    res.status(201).json(new ApiResponse(201, news, "News created successfully"));
});

// PUT update news (admin)
const updateNews = asyncHandler(async (req, res) => {
    const news = await NewsItem.findById(req.params.id);
    if (!news) {
        throw new ApiError(404, "News item not found");
    }

    const { title, date, category, body, isActive } = req.body;
    const imgFile = req.file;

    if (imgFile) {
        if (news.img) {
            const uploaded = await replaceOnCloudinary(imgFile.path, news.img, "news");
            if (!uploaded) throw new ApiError(400, "Image upload failed");
            news.img = uploaded.url;
            news.public_id = uploaded.public_id;
            news.filename = uploaded.original_filename || imgFile.originalname;
            news.contentType = imgFile.mimetype;
        } else {
            const uploaded = await uploadOnCloudinary(imgFile.path, "news");
            if (!uploaded) throw new ApiError(400, "Image upload failed");
            news.img = uploaded.url;
            news.public_id = uploaded.public_id;
            news.filename = uploaded.original_filename || imgFile.originalname;
            news.contentType = imgFile.mimetype;
        }
    }

    if (title !== undefined) news.title = title;
    if (date !== undefined) news.date = date;
    if (category !== undefined) news.category = category;
    if (body !== undefined) news.body = body;
    if (isActive !== undefined) news.isActive = isActive;

    await news.save();
    res.status(200).json(new ApiResponse(200, news, "News updated successfully"));
});

// DELETE news (admin)
const deleteNews = asyncHandler(async (req, res) => {
    const news = await NewsItem.findById(req.params.id);
    if (!news) {
        throw new ApiError(404, "News item not found");
    }
    if (news.img) {
        await deleteOnCloudinary(news.img);
    }
    await NewsItem.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "News deleted successfully"));
});

export { getAllNews, getNewsById, createNews, updateNews, deleteNews };
