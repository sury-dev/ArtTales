import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { TalePost } from "../models/talePost.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: true });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload files to cloudinary
    // create user object - create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return response

    const { firstName, lastName, email, username, password, phoneNumber, dateOfBirth, bio, profession } = req.body;
    //console.log("Email : ",email,"\nPassword (Unencrypted) : ",password);

    // if(fullName === ""){
    //     throw new ApiError(400, "Fullname is required");
    // }

    if (
        [firstName, lastName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new ApiError(409, "Entered Email is already registered with us")
    }

    const existingUsername = await User.findOne({ username })

    if (existingUsername) {
        throw new ApiError(409, "Username already exists")
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber })

    if (existingPhoneNumber) {
        throw new ApiError(409, "PhoneNumber already exists")
    }

    //const avatarLocalPath = req.files?.avatar[0]?.path; //since we already used multer 
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let avatar, coverImage;

    // Handle avatar upload
    if (req.files && req.files.avatar && req.files.avatar[0] && req.files.avatar[0].buffer) {
        avatar = await uploadOnCloudinary(req.files.avatar[0].buffer, "avatar");
    } else {
        throw new ApiError(400, "Profile Picture is required.");
    }

    // Handle cover image upload (optional)
    if (req.files && req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].buffer) {
        coverImage = await uploadOnCloudinary(req.files.coverImage[0].buffer, "coverImage");
    }


    if (!avatar) {
        throw new ApiError(400, "Avatar file not uploaded on cloudinary.");
    }
    console.log(avatar);

    const user = await User.create({
        firstName,
        lastName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
        dateOfBirth,
        phoneNumber,
        bio,
        profession
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // get data from body
    // username or email
    // find the user
    // check password
    // generate access and refresh token
    // send cookies

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
        status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            },
        },
        {
            new: true //this will make sure that it returns updated value
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
        status(200).
        clearCookie("accessToken", options).
        clearCookie("refreshToken", options).
        json(
            new ApiResponse(200, {}, "User Logged Out successfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired");
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.
            status(200).
            cookie("accessToken", accessToken, options).
            cookie("refreshToken", newRefreshToken, options).
            json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    },
                    "Access Token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Old Password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res.
        status(200).
        json(
            new ApiResponse(200, {}, "Password Changed Successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current User Fetched successfully")
        );
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Fullname and Email updated successfully")
        )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
        throw new ApiError(400, "New Avatar file is required.");
    }

    const newAvatar = await uploadOnCloudinary(req.file.buffer, "avatar");

    if (!newAvatar?.secure_url) {
        throw new ApiError(400, "New Avatar file not uploaded on Cloudinary.");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { avatar: newAvatar.secure_url } },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "New User Avatar updated successfully")
    );
});

const updateCoverImage = asyncHandler(async (req, res) => {
    if (!req.file?.buffer) {
        throw new ApiError(400, "New Cover Image file is required.");
    }

    const newCoverImage = await uploadOnCloudinary(req.file.buffer, "coverImage");

    if (!newCoverImage?.secure_url) {
        throw new ApiError(400, "New Cover Image file not uploaded on Cloudinary.");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { coverImage: newCoverImage.secure_url } },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "New Cover Image updated successfully")
    );
});


const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(404, "Nos such Profle exists");
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "profile",
                as: "followers",
            },
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "following",
            },
        },
        {
            $lookup: {
                from: "artposts",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$owner", "$$userId"] },
                                    { $eq: ["$isPublished", true] },
                                ],
                            },
                        },
                    },
                ],
                as: "artPosts",
            },
        },
        {
            $lookup: {
                from: "taleposts",
                localField: "_id",
                foreignField: "owner",
                as: "talePosts",
            },
        },
        {
            $addFields: {
                followersCount: {
                    $size: "$followers",
                },
                followingCount: {
                    $size: "$following",
                },
                isFollowed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$followers.follower"],
                        },
                        then: true,
                        else: false,
                    },
                },
                artPostsCount: {
                    $size: "$artPosts",
                },
                talePostsCount: {
                    $size: "$talePosts",
                },
            },
        },
        {
            $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                username: 1,
                followersCount: 1,
                followingCount: 1,
                isFollowed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                bio: 1,
                profession: 1,
                artPostsCount: 1,
                talePostsCount: 1,
            },
        },
    ]);


    if (!profile?.length) {
        throw new ApiError(404, "Profile does not exist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, profile[0], "Channel details fetched successfully")
        )
})


const createTalePost = asyncHandler(async (req, res, next) => {
    const { title, slides, isPublished } = req.body;
    const userId = req.user._id; // Assuming you have user info in req.user

    if (!title || !req.files.coverImage) {
        return next(new ApiError("Title and cover image are required", 400));
    }

    // Upload cover image to Cloudinary
    const coverImageUrl = (await uploadOnCloudinary(req.files.coverImage[0].path)).url;

    // Handle slides with their text and images
    const slidesWithImages = await Promise.all(
        slides.map(async (slide, index) => {
            let imageUrl = null;
            if (req.files.slidesImages && req.files.slidesImages[index]) {
                imageUrl = await uploadOnCloudinary(req.files.slidesImages[index].path);
            }
            return {
                text: slide.text,
                image: imageUrl.url || "",
            };
        })
    );

    // Create the tale post
    const newTalePost = new TalePost({
        title,
        coverImage: coverImageUrl,
        slides: slidesWithImages,
        author: userId,
        isPublished: isPublished || false, // Default to draft if not provided
    });

    await newTalePost.save();

    res.status(201).json(new ApiResponse(201, newTalePost, "Tale post created successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserProfile,
    createTalePost
};