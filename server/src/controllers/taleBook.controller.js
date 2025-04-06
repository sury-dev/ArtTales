import { TalePost } from '../models/talePost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { mongoose } from 'mongoose';
import { TaleBook } from '../models/taleBook.model.js';

const createTalebook = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;
    
        if (title?.trim() === "" || !title) {
            throw new ApiError(400, "Title is required.");
        }
    
        const talebookExists = await TaleBook.findOne({ title });
    
        if (talebookExists) {
            throw new ApiError(400, "Talebook with this title already exists");
        }
    
        let talebookCoverLocalPath;
    
        if(req.file?.path){
            talebookCoverLocalPath = req.file.path;
        }
        const userId = req.user._id;
    
        const talebookFile = (await uploadOnCloudinary(talebookCoverLocalPath))?.url;
    
        const talebook = new TaleBook({
            title,
            description : description || "",
            thumbnail : talebookFile || "",
            owner: userId
        });
    
        const talebookDoc = await talebook.save();
    
        return res
        .status(201)
        .json(
            new ApiResponse(201, talebookDoc, "Talebook created successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating the talebook");
    }
});

const deleteTalebook = asyncHandler(async (req, res) => {
    try {
        const { talebookId } = req.params;

        if(!mongoose.isValidObjectId(talebookId)){
            throw new ApiError(400, "Invalid talebook ID");
        }

        const talebook = await Talebook.findByIdAndDelete(talebookId);

        return res.status(200)
        .json(
            new ApiResponse(200, talebook, "Talebook deleted successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting the talebook");
    }
});

const updateTalebook = asyncHandler(async (req, res) => {
    try {
        const { talebookId } = req.params;

        if(!mongoose.isValidObjectId(talebookId)){
            throw new ApiError(400, "Invalid talebook ID");
        }

        const talebook = await TaleBook.findById(talebookId);

        if(!talebook){
            throw new ApiError(404, "Talebook not found");
        }

        const { title, description } = req.body;

        if (title?.trim() === "" || !title) {
            throw new ApiError(400, "Title is required.");
        }

        let talebookCoverLocalPath;

        if(req.file?.path){
            talebookCoverLocalPath = req.file.path;
        }

        const talebookFile = (await uploadOnCloudinary(talebookCoverLocalPath))?.url;

        talebook.title = title;
        talebook.description = description || talebook.description;
        talebook.thumbnail = talebookFile || talebook.thumbnail;

        const updatedTalebook = await talebook.save();

        return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTalebook, "Talebook updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating the talebook || ERROR: ${error.message}`);
    }
});

const getTalebook = asyncHandler(async (req, res) => {
    const { talebookId } = req.params;

    if (!mongoose.isValidObjectId(talebookId)) {
        throw new ApiError(400, "Invalid talebook ID");
    }

    const talebook = await Talebook.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(talebookId) } },
        {
            $lookup: {
                from: 'taleposts', // MongoDB collection name
                localField: 'talePost', // Field in Talebook that holds talePost IDs
                foreignField: '_id', // Field in TalePost to match with Talebook talePost IDs
                as: 'talePosts', // Alias for the data from TalePost collection
                pipeline: [
                    {$match : { isPublished : true }},
                    {
                        $lookup: {
                            from: 'likes', // Collection for likes
                            localField: '_id', // talePost's ID field
                            foreignField: 'talePost', // Likes referring to this talePost
                            as: 'likes' // Alias for likes
                        }
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" }, // Count likes for each talePost
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
                            taleFile: 1,
                            title: 1,
                            description: 1,
                            likesCount: 1, // Only include necessary fields for talePosts
                            view: 1,
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'users', // Collection for users
                localField: 'owner', // Talebook's owner ID
                foreignField: '_id', // User's ID
                as: 'owner', // Alias for owner data
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            avatar: 1 // Only include necessary fields for owner
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'likes', // Collection for talebook likes
                localField: '_id', // Talebook's ID
                foreignField: 'talebook', // Likes referring to this talebook
                as: 'likes' // Alias for likes
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }, // Count likes for each talePost
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
                title: 1,
                description: 1,
                thumbnail: 1,
                talePosts: 1, // Include filtered talePosts data
                owner: 1, // Include filtered owner data
                likesCount: 1, // Include talebook likes count
                isLiked: 1
            }
        }
    ]);
    

    if (!talebook || talebook.length === 0) {
        throw new ApiError(404, "Talebook not found");
    }

    return res.status(200).json(
        new ApiResponse(200, talebook[0], "Talebook retrieved successfully")
    );
});

const addTalePostToTalebook = asyncHandler(async (req, res) => {
    const { talebookId, talePostId } = req.params;

    if(!mongoose.isValidObjectId(talebookId) || !mongoose.isValidObjectId(talePostId)){
        throw new ApiError(400, "Invalid talebook or tale post ID");
    }

    const talebook = await Talebook.findById(talebookId);

    if(!talebook){
        throw new ApiError(404, "Talebook not found");
    }

    const talePost = await TalePost.findById(talePostId);

    if(!talePost){
        throw new ApiError(404, "Tale Post not found");
    }

    if(talebook.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to add tale post to this talebook");
    }

    talebook.talePost.push(talePostId);

    const updatedTalebook = await talebook.save();

    return res.status(200)
    .json(
        new ApiResponse(200, updatedTalebook, "Tale Post added to Talebook successfully")
    );
});

const getUsersTalebooks = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    const userTalebook = await Talebook.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: 'taleposts', // MongoDB collection name
                localField: 'talePost', // Field in Talebook that holds talePost IDs
                foreignField: '_id', // Field in TalePost to match with Talebook talePost IDs
                as: 'talePosts', // Alias for the data from TalePost collection
                pipeline: [
                    { $match: { isPublished: true } },
                    {
                        $lookup: {
                            from: 'likes', // Collection for likes
                            localField: '_id', // talePost's ID field
                            foreignField: 'talePost', // Likes referring to this talePost
                            as: 'likes' // Alias for likes
                        }
                    },
                    {
                        $addFields: {
                            likesCount: { $size: "$likes" }, // Count likes for each talePost
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
                            taleFile: 1,
                            title: 1,
                            description: 1,
                            likesCount: 1, // Only include necessary fields for talePosts
                            view: 1,
                            isLiked: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'likes', // Collection for talebook likes
                localField: '_id', // Talebook's ID
                foreignField: 'talebook', // Likes referring to this talebook
                as: 'likes' // Alias for likes
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }, // Count likes for each talePost
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
                title: 1,
                description: 1,
                thumbnail: 1,
                talePosts: 1, // Include filtered talePosts data
                likesCount: 1, // Include talebook likes count
                isLiked: 1
            }
        }
    ]);

    if (!userTalebook || userTalebook.length === 0) {
        throw new ApiError(404, "No talebooks found for this user");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, userTalebook, "User's Talebooks retrieved successfully")
    );
});

export {
    createTalebook,
    deleteTalebook,
    updateTalebook,
    getTalebook,
    addTalePostToTalebook,
    getUsersTalebooks
};
