import { Rule } from "../models/rule.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET all rules (public)
const getAllRules = asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) {
        filter.category = req.query.category;
    }
    const rules = await Rule.find(filter).sort({ order: 1 });
    res.status(200).json(new ApiResponse(200, rules, "Rules fetched successfully"));
});

// GET single rule
const getRuleById = asyncHandler(async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
        throw new ApiError(404, "Rule not found");
    }
    res.status(200).json(new ApiResponse(200, rule, "Rule fetched successfully"));
});

// POST create rule (admin)
const createRule = asyncHandler(async (req, res) => {
    const { title, rules, category, order } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const rule = await Rule.create({ title, rules, category, order });
    res.status(201).json(new ApiResponse(201, rule, "Rule created successfully"));
});

// PUT update rule (admin)
const updateRule = asyncHandler(async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
        throw new ApiError(404, "Rule not found");
    }

    const { title, rules, category, order, isActive } = req.body;

    if (title !== undefined) rule.title = title;
    if (rules !== undefined) rule.rules = rules;
    if (category !== undefined) rule.category = category;
    if (order !== undefined) rule.order = order;
    if (isActive !== undefined) rule.isActive = isActive;

    await rule.save();
    res.status(200).json(new ApiResponse(200, rule, "Rule updated successfully"));
});

// DELETE rule (admin)
const deleteRule = asyncHandler(async (req, res) => {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
        throw new ApiError(404, "Rule not found");
    }
    await Rule.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Rule deleted successfully"));
});

export { getAllRules, getRuleById, createRule, updateRule, deleteRule };
