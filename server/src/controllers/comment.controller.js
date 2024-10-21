import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getArtPostComments = asyncHandler(async (req, res) => {
    const { artPostId } = req.params;
    const { page = 1, limit = 10 } = req.query;

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
                $project: {
                    content: 1,
                    owner: { $arrayElemAt: ["$owner", 0] },
                    createdAt: 1,
                },
            },
        ])
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        return res.status(200).json(new ApiResponse(200, comments, "Art Post Comments retrieved successfully"));
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
                $project: {
                    content: 1,
                    owner: { $arrayElemAt: ["$owner", 0] },
                    createdAt: 1,
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

        const comment = new Comment({
            content,
            artPost: artPostId,
            owner: req.user._id,
        });

        const commentDoc = await comment.save();

        if (!commentDoc) {
            throw new ApiError(400, "Failed to add comment");
        }

        return res.status(201).json(new ApiResponse(201, commentDoc, "Comment added successfully"));
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

        return res.status(201).json(new ApiResponse(201, commentDoc, "Comment added successfully"));
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
            throw new ApiError(400, "Comment ID is required");
        }

        const comment = await Comment.findByIdAndDelete(commentId);

        const comments = await Comment.deleteMany({ comment: commentId });

        if (!comment || !comments) {
            throw new ApiError(400, "Failed to delete comment");
        }

        return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message);
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
