import { ArtPost } from '../models/artPost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';

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

export { createArtPost, getProfileArtPosts };