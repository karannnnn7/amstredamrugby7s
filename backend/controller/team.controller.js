import { Team } from "../models/team.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET all teams (public) — optional ?category=ELITE MEN filter
const getAllTeams = asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) {
        filter.category = req.query.category;
    }
    const teams = await Team.find(filter).sort({ name: 1 });
    res.status(200).json(new ApiResponse(200, teams, "Teams fetched successfully"));
});

// GET single team
const getTeamById = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
        throw new ApiError(404, "Team not found");
    }
    res.status(200).json(new ApiResponse(200, team, "Team fetched successfully"));
});

// POST create team (admin)
const createTeam = asyncHandler(async (req, res) => {
    const { name, country, category, logo, color } = req.body;

    if (!name || !country || !category) {
        throw new ApiError(400, "Name, country, and category are required");
    }

    const team = await Team.create({ name, country, category, logo, color });
    res.status(201).json(new ApiResponse(201, team, "Team created successfully"));
});

// PUT update team (admin)
const updateTeam = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    const { name, country, category, logo, color, isActive } = req.body;

    if (name !== undefined) team.name = name;
    if (country !== undefined) team.country = country;
    if (category !== undefined) team.category = category;
    if (logo !== undefined) team.logo = logo;
    if (color !== undefined) team.color = color;
    if (isActive !== undefined) team.isActive = isActive;

    await team.save();
    res.status(200).json(new ApiResponse(200, team, "Team updated successfully"));
});

// DELETE team (admin)
const deleteTeam = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
        throw new ApiError(404, "Team not found");
    }
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Team deleted successfully"));
});

export { getAllTeams, getTeamById, createTeam, updateTeam, deleteTeam };
