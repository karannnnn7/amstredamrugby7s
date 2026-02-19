import { PageContent } from "../models/pageContent.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET all content for a specific page (public)
const getContentByPage = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const content = await PageContent.find({ page, isActive: true }).sort({ order: 1 });
    res.status(200).json(new ApiResponse(200, content, "Content fetched successfully"));
});

// GET single content by page + section (public)
const getContentBySection = asyncHandler(async (req, res) => {
    const { page, section } = req.params;
    const content = await PageContent.findOne({ page, section, isActive: true });
    if (!content) {
        // Return 200 with null rather than 404 to avoid console errors for optional content
        return res.status(200).json(new ApiResponse(200, null, "Content not found (defaulting to null)"));
    }
    res.status(200).json(new ApiResponse(200, content, "Content fetched successfully"));
});

// GET all content (admin)
const getAllContent = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.page) filter.page = req.query.page;
    const content = await PageContent.find(filter).sort({ page: 1, order: 1 });
    res.status(200).json(new ApiResponse(200, content, "All content fetched successfully"));
});

// POST create content (admin)
const createContent = asyncHandler(async (req, res) => {
    const { page, section, heading, subheading, body, bodyItems, ctaText, ctaLink, order } = req.body;

    if (!page || !section) {
        throw new ApiError(400, "Page and section are required");
    }

    const existing = await PageContent.findOne({ page, section });
    if (existing) {
        throw new ApiError(400, `Content for page '${page}' section '${section}' already exists. Use update instead.`);
    }

    const content = await PageContent.create({
        page, section, heading, subheading, body, bodyItems, ctaText, ctaLink, order
    });
    res.status(201).json(new ApiResponse(201, content, "Content created successfully"));
});

// PUT update content (admin)
const updateContent = asyncHandler(async (req, res) => {
    const content = await PageContent.findById(req.params.id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    const { heading, subheading, body, bodyItems, ctaText, ctaLink, order, isActive } = req.body;

    if (heading !== undefined) content.heading = heading;
    if (subheading !== undefined) content.subheading = subheading;
    if (body !== undefined) content.body = body;
    if (bodyItems !== undefined) content.bodyItems = bodyItems;
    if (ctaText !== undefined) content.ctaText = ctaText;
    if (ctaLink !== undefined) content.ctaLink = ctaLink;
    if (order !== undefined) content.order = order;
    if (isActive !== undefined) content.isActive = isActive;

    await content.save();
    res.status(200).json(new ApiResponse(200, content, "Content updated successfully"));
});

// DELETE content (admin)
const deleteContent = asyncHandler(async (req, res) => {
    const content = await PageContent.findById(req.params.id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }
    await PageContent.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Content deleted successfully"));
});

export { getContentByPage, getContentBySection, getAllContent, createContent, updateContent, deleteContent };
