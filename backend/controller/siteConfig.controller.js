import { SiteConfig } from "../models/siteConfig.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET all config (public)
const getAllConfig = asyncHandler(async (req, res) => {
    const config = await SiteConfig.find({});
    // Transform array to object for easier frontend usage
    const configObj = {};
    config.forEach(item => {
        configObj[item.key] = item.value;
    });
    res.status(200).json(new ApiResponse(200, configObj, "Config fetched successfully"));
});

// GET single config by key (public)
const getConfigByKey = asyncHandler(async (req, res) => {
    const config = await SiteConfig.findOne({ key: req.params.key });
    if (!config) {
        // Return 200 with null value to avoid console 404 errors for optional configs
        return res.status(200).json(new ApiResponse(200, { key: req.params.key, value: null }, "Config not found (defaulting to null)"));
    }
    res.status(200).json(new ApiResponse(200, config, "Config fetched successfully"));
});

// POST or PUT upsert config (admin)
const upsertConfig = asyncHandler(async (req, res) => {
    const { key, value, description } = req.body;

    if (!key || value === undefined) {
        throw new ApiError(400, "Key and value are required");
    }

    const config = await SiteConfig.findOneAndUpdate(
        { key },
        { key, value, description },
        { upsert: true, returnDocument: 'after', runValidators: true }
    );
    res.status(200).json(new ApiResponse(200, config, "Config saved successfully"));
});

// PUT bulk update configs (admin)
const bulkUpsertConfig = asyncHandler(async (req, res) => {
    const { configs } = req.body;

    if (!configs || !Array.isArray(configs)) {
        throw new ApiError(400, "configs array is required");
    }

    const results = [];
    for (const { key, value, description } of configs) {
        if (!key || value === undefined) continue;
        const config = await SiteConfig.findOneAndUpdate(
            { key },
            { key, value, description },
            { upsert: true, returnDocument: 'after', runValidators: true }
        );
        results.push(config);
    }
    res.status(200).json(new ApiResponse(200, results, "Configs saved successfully"));
});

// DELETE config (admin)
const deleteConfig = asyncHandler(async (req, res) => {
    const config = await SiteConfig.findOne({ key: req.params.key });
    if (!config) {
        throw new ApiError(404, "Config key not found");
    }
    await SiteConfig.findByIdAndDelete(config._id);
    res.status(200).json(new ApiResponse(200, null, "Config deleted successfully"));
});

export { getAllConfig, getConfigByKey, upsertConfig, bulkUpsertConfig, deleteConfig };
