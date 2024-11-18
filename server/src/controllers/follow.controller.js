import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Follow } from "../models/follow.model.js"

const toggleFollow = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        if (!isValidObjectId(id)) {
            throw new ApiError(400, "Invalid User Id");
        }

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const follow = await Follow.findOne({ profile: id, follower: req.user._id });

        if (follow) {
            await Follow.findByIdAndDelete(follow._id);
            return res.status(200).json(new ApiResponse(200, {}, "Follow removed"));
        } else {
            const followUser = new Follow({
                profile: id,
                follower: req.user._id
            });
            await followUser.save();
            return res.status(200).json(new ApiResponse(200, {}, "Follow added"));
        }
    } catch (error) {
        throw new ApiError(400, "Toggle Follow Error :: ", error)
    }
})

export { toggleFollow };