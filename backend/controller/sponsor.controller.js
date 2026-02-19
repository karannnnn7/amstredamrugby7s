import { Sponsor } from "../models/sponcers.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, replaceOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

// GET all sponsors (public) — optional ?type=official-sponsors filter
const getAllSponsors = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.type) {
        filter.type = req.query.type;
    }
    const sponsors = await Sponsor.find(filter).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, sponsors, "Sponsors fetched successfully"));
});

// GET single sponsor
const getSponsorById = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
        throw new ApiError(404, "Sponsor not found");
    }
    res.status(200).json(new ApiResponse(200, sponsor, "Sponsor fetched successfully"));
});

// POST create sponsor (admin)
const createSponsor = asyncHandler(async (req, res) => {
    const { name, subName, role, type } = req.body;
    const imgFile = req.file;

    if (!name) {
        throw new ApiError(400, "Sponsor name is required");
    }

    let imgData = {};
    if (imgFile) {
        const uploaded = await uploadOnCloudinary(imgFile.path, "sponsors");
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

    const sponsor = await Sponsor.create({
        name, subName, role, type, ...imgData
    });
    res.status(201).json(new ApiResponse(201, sponsor, "Sponsor created successfully"));
});

// PUT update sponsor (admin)
const updateSponsor = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
        throw new ApiError(404, "Sponsor not found");
    }

    const { name, subName, role, type } = req.body;
    const imgFile = req.file;

    if (imgFile) {
        if (sponsor.img) {
            const uploaded = await replaceOnCloudinary(imgFile.path, sponsor.img, "sponsors");
            if (!uploaded) throw new ApiError(400, "Image upload failed");
            sponsor.img = uploaded.url;
            sponsor.public_id = uploaded.public_id;
            sponsor.filename = uploaded.original_filename || imgFile.originalname;
            sponsor.contentType = imgFile.mimetype;
        } else {
            const uploaded = await uploadOnCloudinary(imgFile.path, "sponsors");
            if (!uploaded) throw new ApiError(400, "Image upload failed");
            sponsor.img = uploaded.url;
            sponsor.public_id = uploaded.public_id;
            sponsor.filename = uploaded.original_filename || imgFile.originalname;
            sponsor.contentType = imgFile.mimetype;
        }
    }

    if (name !== undefined) sponsor.name = name;
    if (subName !== undefined) sponsor.subName = subName;
    if (role !== undefined) sponsor.role = role;
    if (type !== undefined) sponsor.type = type;

    if (type === 'sub-sponsors') {
        if (sponsor.img) {
            await deleteOnCloudinary(sponsor.img);
        }
        sponsor.img = "";
        sponsor.public_id = "";
        sponsor.filename = "";
        sponsor.contentType = "";
        sponsor.subName = "";
        sponsor.role = "";
    }

    await sponsor.save();
    res.status(200).json(new ApiResponse(200, sponsor, "Sponsor updated successfully"));
});

// DELETE sponsor (admin)
const deleteSponsor = asyncHandler(async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
        throw new ApiError(404, "Sponsor not found");
    }
    if (sponsor.img) {
        await deleteOnCloudinary(sponsor.img);
    }
    await Sponsor.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Sponsor deleted successfully"));
});

export { getAllSponsors, getSponsorById, createSponsor, updateSponsor, deleteSponsor };
