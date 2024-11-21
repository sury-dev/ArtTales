import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getArtPostComments = asyncHandler(async (req, res) => {
    const { artPostId } = req.params;
    let { page = 1, limit = 10 } = req.query;
    limit = parseInt(req.query.limit, 10);  // Parse the limit as an integer
    page = parseInt(req.query.page, 10);

    try {
        if (!isValidObjectId(artPostId)) {
            throw new ApiError(400, "Art post ID is required");
        }

        const comments = await Comment.aggregate([
            {
                $match: {
                    artPost: new mongoose.Types.ObjectId(artPostId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
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
                    owner: { $arrayElemAt: ["$owner", 0] }, // Flatten owner array
                },
            },
            {
                $project: {
                    content: 1,
                    owner: 1,
                    createdAt: 1,
                    likesCount: 1,
                    isLiked: 1,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $facet: {
                    totalCommentCount: [{ $count: "count" }],
                    paginatedResults: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                    ],
                },
            },
            {
                $addFields: {
                    totalCommentCount: { $arrayElemAt: ["$totalCommentCount.count", 0] },
                },
            },
            {
                $project: {
                    paginatedResults: 1,
                    totalCommentCount: { $ifNull: ["$totalCommentCount", 0] },
                },
            },
        ]);
        
        const results = {
            comments: comments[0].paginatedResults,
            totalCommentCount: comments[0].totalCommentCount,
        };        

        return res.status(200).json(new ApiResponse(200, results, "Art Post Comments retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const getCommentComments = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Comment ID is required");
        }

        const comments = await Comment.aggregate([
            {
                $match: {
                    comment: new mongoose.Types.ObjectId(commentId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
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
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    content: 1,
                    owner: { $arrayElemAt: ["$owner", 0] },
                    createdAt: 1,
                    likesCount: 1,
                    isLiked: 1
                },
            },
        ])
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        if (!comments) {
            throw new ApiError(400, "Failed to retrieve comments");
        }

        return res.status(200).json(new ApiResponse(200, comments, "Comment's Comments retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const addCommentToArtPost = asyncHandler(async (req, res) => {
    const { artPostId } = req.params;
    const { content } = req.body;

    try {
        if (!isValidObjectId(artPostId)) {
            throw new ApiError(400, "Art post ID is required");
        }

        if (content?.trim() === "") {
            throw new ApiError(400, "Comment content is required");
        }

        const userData = await User.findById(req.user._id).select("username avatar");

        const comment = new Comment({
            content,
            artPost: artPostId,
            owner: req.user._id
        });


        let commentDoc = await comment.save();

        if (!commentDoc) {
            throw new ApiError(400, "Failed to add comment");
        }

        commentDoc.owner = userData;
        commentDoc.owner._id = req.user._id;

        return res.status(201).json(new ApiResponse(201, {comments : commentDoc}, "Comment added successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const addCommentToComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Comment ID is required");
        }

        if (content?.trim() === "") {
            throw new ApiError(400, "Comment content is required");
        }

        const comment = new Comment({
            content,
            comment: commentId,
            owner: req.user._id,
        });

        const commentDoc = await comment.save();

        if (!commentDoc) {
            throw new ApiError(400, "Failed to add comment");
        }

        const responseData = await Comment.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(commentDoc._id)}
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'comment',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" },
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
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    createdAt: 1,
                    likesCount: 1,
                    isLiked: 1,
                    owner: { $arrayElemAt: ["$owner", 0] }
                }
            }
        ])

        return res.status(201).json(new ApiResponse(201, responseData, "Comment added successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Comment ID is required");
        }

        if (content?.trim() === "") {
            throw new ApiError(400, "Comment content is required");
        }

        const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

        if (!comment) {
            throw new ApiError(400, "Failed to update comment");
        }

        return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    try {
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Valid Comment ID is required");
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }

        if (comment.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this comment");
        }

        const deleteNestedComments = async (parentCommentId) => {
            const childComments = await Comment.find({ comment: parentCommentId });

            for (const child of childComments) {
                await deleteNestedComments(child._id);
            }

            await Comment.findByIdAndDelete(parentCommentId);
        };

        await deleteNestedComments(commentId);

        return res.status(200).json(new ApiResponse(200, null, "Comment and its nested comments deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "An error occurred while deleting the comment");
    }
});


export {
    getArtPostComments,
    getCommentComments,
    addCommentToArtPost,
    addCommentToComment,
    updateComment,
    deleteComment,
};
