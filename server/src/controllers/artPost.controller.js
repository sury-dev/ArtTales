import { ArtPost } from '../models/artPost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { mongoose } from 'mongoose';

const createArtPost = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body;

    if (title?.trim() === "") {
        throw new ApiError(400, "Title is required.");
    }

    const artPostExists = await ArtPost.findOne({ title });

    if (artPostExists) {
        throw new ApiError(400, "Art Post with this title already exists");
    }

    let artFileLocalPath;

    if(req.file?.path){
        artFileLocalPath = req.file.path;
    }
    const userId = req.user._id;

    if (!artFileLocalPath) {
        throw new ApiError(400, "No Picture was uploaded to the server");
    }

    const artFile = (await uploadOnCloudinary(artFileLocalPath)).url;

    const artPost = new ArtPost({
        title,
        description,
        isPublished : isPublished || false,
        artFile,
        owner: userId
    });

    const artPostDoc = await artPost.save();

    return res
    .status(201)
    .json(
        new ApiResponse(201, artPostDoc, "Art Post created successfully")
    )
});

const getProfileArtPosts = asyncHandler(async (req, res) => {
    const {username, artPost} = req.params;

    if(username?.trim() == "" || artPost?.trim() == ""){
        console.log(username," ", artPost);
        throw new ApiError(404, "Page not Found here");
    }

    const user = await User.findOne({username});

    if(!user){
        throw new ApiError(404, "User Does not exist")
    }

    const artPosts = await ArtPost.find({owner: user._id, title: artPost});

    if(artPosts.length === 0 || artPosts?.isPublished === false){
        throw new ApiError(404, "Art Post not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, artPosts, "Art Post Fetched successfully")
    )
});

const getAllArtPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query} = req.query
    const allArtPosts = await ArtPost.find({
        isPublished: true,
        $or: [
            {
                title: {
                    $regex: query || "",
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query || "",
                    $options: "i"
                }
            }
        ]
    })
    .sort({
        createdAt: -1
    })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

    return res
    .status(200)
    .json(
        new ApiResponse(200, allArtPosts, "Art Posts Fetched successfully")
    )
})

const updateArtPost = asyncHandler(async (req, res) => {
    const { _id ,title, description} = req.body;

    if (!mongoose.isValidObjectId(_id)){
        throw new ApiError(400, "Not a valid ID");
    }

    const artPostExists = await ArtPost.findOne({ _id, owner: req.user._id });

    if(!artPostExists){
        throw new ApiError(404, "Either the Art Post does not exist or you are not authorized to update this Art Post");
    }

    if(!title){
        throw new ApiError(400, "Title is required");
    }

    const artObj = {
        title,
        description: description || ""
    }

    const artPostDoc = await ArtPost.findByIdAndUpdate(_id, artObj, {new: true});

    return res
    .status(201)
    .json(
        new ApiResponse(201, artPostDoc, "Art Post Updated successfully")
    )
});

const deleteArtPost = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!mongoose.isValidObjectId(_id)){
        throw new ApiError(400, "Not a valid ID");
    }

    const artPostExists = await ArtPost.findOne({ _id, owner: req.user._id });

    if(!artPostExists){
        throw new ApiError(404, "Either the Art Post does not exist or you are not authorized to delete this Art Post");
    }

    const artPostDoc = await ArtPost.findByIdAndDelete(_id);

    return res
    .status(201)
    .json(
        new ApiResponse(201, artPostDoc, "Art Post Deleted successfully")
    )
});

const togglePublishArtPost = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!mongoose.isValidObjectId(_id)){
        throw new ApiError(400, "Invalid ArtPost ID");
    }

    const artPostExists = await ArtPost.findOne({ _id, owner: req.user._id });

    if(!artPostExists){
        throw new ApiError(404, "You are not authorized to update this Art Post");
    }

    const artPostDoc = await ArtPost.findByIdAndUpdate(_id, {isPublished: !artPostExists.isPublished}, {new: true});

    return res
    .status(201)
    .json(
        new ApiResponse(201, artPostDoc, "Art Post Updated successfully")
    )
});

const incrementViewCount = asyncHandler(async (req, res) => {
    const { _id } = req.body;

    if (!mongoose.isValidObjectId(_id)){
        throw new ApiError(400, "Invalid Art Post Id");
    }

    const artPostDoc = await ArtPost.findByIdAndUpdate(_id, {$inc: {view: 1}}, {new: true});

    return res
    .status(201)
    .json(
        new ApiResponse(201, artPostDoc, "Art Post Updated successfully")
    )
})

export { createArtPost, getProfileArtPosts, getAllArtPosts, updateArtPost, deleteArtPost, togglePublishArtPost, incrementViewCount };