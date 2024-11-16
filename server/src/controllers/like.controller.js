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
    try {
        const {commentId} = req.params
        if(!isValidObjectId(commentId)){
            throw new ApiError(400, "Invalid Comment Id");
        }

        const commentLike = await Like.findOne({comment: commentId, likedBy: req.user._id});

        if(commentLike){
            const deletedLike = await Like.findByIdAndDelete(commentLike._id);
        }else{
            const addedLike = new Like({
                comment: commentId,
                likedBy: req.user._id
            })
            await addedLike.save();
        }

        return res.status(200).json(new ApiResponse(200, {}, "Comment like toggled successfully"));
    } catch (error) {
        throw new ApiError(400, "Toggle Comment Like Error :: ", error)
    }

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

const getLikedArtPosts = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedPosts = await Like.aggregate([
        {
            $match: {likedBy: req.user._id, artPost: { $exists: true }}
        },
        {
            $lookup:{
                from: "artposts",
                localField: "artPost",
                foreignField: "_id",
                as: "artPost",
                pipeline: [
                    {
                        $match: { isPublished: true }
                    },
                    {
                        $lookup: {
                            from: 'likes', // Collection for likes
                            localField: '_id', // artPost's ID field
                            foreignField: 'artPost', // Likes referring to this artPost
                            as: 'likes' // Alias for likes
                        }
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" }, // Count likes for each artPost
                            isLiked: {
                                $cond: {
                                    if: {
                                        $in: [req?.user._id, "$likes.likedBy"]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            artFile: 1,
                            title: 1,
                            description: 1,
                            likesCount: 1, // Only include necessary fields for artPosts
                            view: 1,
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                artPost: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, likedPosts, "Liked artPosts retrieved successfully"));
})

const getLikedAlbums = asyncHandler(async (req, res) => {
    const getLikedAlbums = await Like.aggregate([
        {
            $match: {likedBy: req.user._id, album: { $exists: true }}
        },
        {
            $lookup:{
                from: "albums",
                localField: "album",
                foreignField: "_id",
                as: "album",
                pipeline: [
                    {
                        $lookup: {
                            from: 'likes', // Collection for likes
                            localField: '_id', // album's ID field
                            foreignField: 'album', // Likes referring to this album
                            as: 'likes' // Alias for likes
                        }
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" }, // Count likes for each album
                            isLiked: {
                                $cond: {
                                    if: {
                                        $in: [req?.user._id, "$likes.likedBy"]
                                    },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            likesCount: 1, // Only include necessary fields for albums
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                album: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, getLikedAlbums, "Liked albums retrieved successfully"));
});

export {
    toggleCommentLike,
    toggleAlbumLike,
    toggleArtPostLike,
    getLikedArtPosts,
    getLikedAlbums
}