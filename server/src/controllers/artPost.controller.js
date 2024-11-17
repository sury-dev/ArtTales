import { ArtPost } from '../models/artPost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { mongoose } from 'mongoose';

const createArtPost = asyncHandler(async (req, res) => {
    try {
        const { title = "", description ="", isPublished } = req.body;
    
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
    } catch (error) {
        throw new ApiError(400, error.message);
    }
});

const getArtPost = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)){
        throw new ApiError(400, "Not a valid ID");
    }

    const artPost = await ArtPost.aggregate([
        { 
            $match: { 
                _id: new mongoose.Types.ObjectId(id), 
                isPublished: true 
            } 
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "follows",  // lowercase and plural
                            localField: "_id",
                            foreignField: "profile",
                            as: "followers"
                        }
                    },
                    {
                        $addFields: {
                            followersCount: {
                                $size: "$followers"
                            },
                            isFollowed: {
                                $cond: {
                                    if: {
                                        $in: [req.user?._id, "$followers.follower"]
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
                            username: 1,
                            avatar: 1,
                            firstName: 1,
                            lastName: 1,
                            followersCount: 1,
                            isFollowed: 1 // Only include necessary fields for owner
                        }
                    }
                ]
            }
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
            $lookup: {
                from: 'follows', // Followers collection
                localField: 'owner', // artPost's owner (profile being followed)
                foreignField: 'profile', // profile being followed
                as: 'followers' // Alias for followers
            }
        },
        {
            $addFields: {
                followersCount: { $size: "$followers" }, // Count followers for the owner
                isFollowed: {
                    $cond: {
                        if: {
                            $in: [req?.user._id, "$followers.follower"]
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
                likesCount: 1,
                view: 1,
                isLiked: 1,
                followersCount: 1,
                isFollowed: 1,
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        }
    ]);
    

    return res
    .status(200)
    .json(
        new ApiResponse(200, artPost[0], "Art Post Fetched successfully")
    )
});

const getAllArtPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query} = req.query
    // const allArtPosts = await ArtPost.find({
    //     isPublished: true,
    //     $or: [
    //         {
    //             title: {
    //                 $regex: query || "",
    //                 $options: "i"
    //             }
    //         },
    //         {
    //             description: {
    //                 $regex: query || "",
    //                 $options: "i"
    //             }
    //         }
    //     ]
    // })
    // .sort({
    //     createdAt: -1
    // })
    // .limit(limit)
    // .skip((page - 1) * limit)
    // .exec();

    const allArtPosts = await ArtPost.aggregate([
        // Match only published posts
        {
            $match: {
                isPublished: true,
                $or: [
                    { title: { $regex: query || "", $options: "i" } },
                    { description: { $regex: query || "", $options: "i" } }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "artPost",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: { $in: [req?.user._id, "$likes.likedBy"] },
                        then: true,
                        else: false,
                    },
                },
                //owner: { $arrayElemAt: ["$owner", 0] }, // Flatten owner array
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "artPost",
                as: "comments",
            },
        },
        {
            $addFields: {
                commentsCount: { $size: "$comments" },
                isCommented: {
                    $cond: {
                        if: { $in: [req?.user._id, "$comments.owner"] },
                        then: true,
                        else: false,
                    },
                },
                //owner: { $arrayElemAt: ["$owner", 0] }, // Flatten owner array
            },
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $project: {
                _id: 1,
                artFile: 1,
                title: 1,
                description: 1,
                view : 1,
                owner : 1,
                likesCount: 1,
                isLiked: 1,
                commentsCount: 1,
                isCommented : 1
            },
        },
    ]);

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
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)){
        throw new ApiError(400, "Invalid Art Post Id");
    }

    const artPostDoc = await ArtPost.findByIdAndUpdate(id, {$inc: {view: 1}}, {new: true});

    return res
    .status(201)
    .json(
        new ApiResponse(201, artPostDoc, "Art Post Updated successfully")
    )
})

export { createArtPost, getArtPost, getAllArtPosts, updateArtPost, deleteArtPost, togglePublishArtPost, incrementViewCount };