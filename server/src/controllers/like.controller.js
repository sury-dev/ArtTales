import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ArtPost} from "../models/artPost.model.js"
import { Album } from "../models/album.model.js"

const toggleArtPostLike = asyncHandler(async (req, res) => {
    const { artPostId } = req.params;

    if (!isValidObjectId(artPostId)) {
        throw new ApiError(400, "Invalid art post id");
    }

    const post = await ArtPost.findById(artPostId);

    if (!post) {
        throw new ApiError(404, "Art post not found");
    }

    const like = await Like.findOne({ artPost: artPostId, likedBy: req.user._id });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, {}, "Like removed"));
    } else {
        const likePost = new Like({
            artPost: artPostId,
            likedBy: req.user._id
        });
        await likePost.save();  // Save the new like to the database
        return res.status(200).json(new ApiResponse(200, {}, "Like added"));
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

})

const toggleAlbumLike = asyncHandler(async (req, res) => {
    const {albumId} = req.params;

    if(!isValidObjectId(albumId)){
        throw new ApiError(400, "Invalid Album Id");
    }

    const album = await Album.findById(albumId);

    if(!album){
        throw new ApiError(404, "Album not found");
    }

    const like = await Like.findOne({album : albumId, likedBy : req.user._id});

    if(like){
        const deletedLike = await Like.findByIdAndDelete(like._id);
        return res.status(200).json(new ApiResponse(200, {}, "Album unliked successfully"));
    }
    else{
        const addedLike = new Like({
            album : albumId,
            likedBy : req.user._id
        })
        await addedLike.save();
        return res.status(200).json(new ApiResponse(200, {}, "Album liked successfully"));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleAlbumLike,
    toggleArtPostLike,
    getLikedVideos
}