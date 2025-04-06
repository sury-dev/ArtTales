import { ArtPost } from '../models/artPost.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import { mongoose } from 'mongoose';
import { Album } from '../models/album.model.js';

const createAlbum = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;

        if (title?.trim() === "" || !title) {
            throw new ApiError(400, "Title is required.");
        }

        const albumExists = await Album.findOne({ title });

        if (albumExists) {
            throw new ApiError(400, "Album with this title already exists");
        }
        const userId = req.user._id;

        if (!req.file?.buffer) {
            throw new ApiError(400, "No Album Cover was uploaded to the server");
        }

        const uploadedAlbumCover = await uploadOnCloudinary(req.file.buffer, "album");

        if (!uploadedAlbumCover?.secure_url) {
            throw new ApiError(400, "Album Cover was not uploaded to Cloudinary");
        }

        const albumFile = uploadedAlbumCover.secure_url;


        const album = new Album({
            title,
            description: description || "",
            thumbnail: albumFile || "",
            owner: userId
        });

        const albumDoc = await album.save();

        return res
            .status(201)
            .json(
                new ApiResponse(201, albumDoc, "Album created successfully")
            )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while creating the album");
    }
});

const deleteAlbum = asyncHandler(async (req, res) => {
    try {
        const { albumId } = req.params;

        if (!mongoose.isValidObjectId(albumId)) {
            throw new ApiError(400, "Invalid album ID");
        }

        const album = await Album.findByIdAndDelete(albumId);

        return res.status(200)
            .json(
                new ApiResponse(200, album, "Album deleted successfully")
            )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting the album");
    }
});

const updateAlbum = asyncHandler(async (req, res) => {
    try {
        const { albumId } = req.params;

        if (!mongoose.isValidObjectId(albumId)) {
            throw new ApiError(400, "Invalid album ID");
        }

        const album = await Album.findById(albumId);

        if (!album) {
            throw new ApiError(404, "Album not found");
        }

        const { title, description } = req.body;

        if (title?.trim() === "" || !title) {
            throw new ApiError(400, "Title is required.");
        }

        let albumCoverLocalPath;

        if (req.file?.path) {
            albumCoverLocalPath = req.file.path;
        }

        const albumFile = (await uploadOnCloudinary(albumCoverLocalPath))?.url;

        album.title = title;
        album.description = description || album.description;
        album.thumbnail = albumFile || album.thumbnail;

        const updatedAlbum = await album.save();

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedAlbum, "Album updated successfully")
            )
    } catch (error) {
        throw new ApiError(500, `Something went wrong while updating the album || EROR: ${error.message}`);
    }
});

const getAlbum = asyncHandler(async (req, res) => {
    const { albumId } = req.params;

    if (!mongoose.isValidObjectId(albumId)) {
        throw new ApiError(400, "Invalid album ID");
    }

    const album = await Album.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(albumId) } },
        {
            $lookup: {
                from: 'artposts', // MongoDB collection name
                localField: 'artPost', // Field in Album that holds artPost IDs
                foreignField: '_id', // Field in ArtPost to match with Album artPost IDs
                as: 'artPosts', // Alias for the data from ArtPost collection
                pipeline: [
                    { $match: { isPublished: true } },
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
            $lookup: {
                from: 'users', // Collection for users
                localField: 'owner', // Album's owner ID
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
                from: 'likes', // Collection for album likes
                localField: '_id', // Album's ID
                foreignField: 'album', // Likes referring to this album
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
                title: 1,
                description: 1,
                thumbnail: 1,
                artPosts: 1, // Include filtered artPosts data
                owner: 1, // Include filtered owner data
                likesCount: 1, // Include album likes count
                isLiked: 1
            }
        }
    ]);


    if (!album || album.length === 0) {
        throw new ApiError(404, "Album not found");
    }

    return res.status(200).json(
        new ApiResponse(200, album[0], "Album retrieved successfully")
    );
});

const addArtPostToAlbum = asyncHandler(async (req, res) => {
    const { albumId, artPostId } = req.params;

    if (!mongoose.isValidObjectId(albumId) || !mongoose.isValidObjectId(artPostId)) {
        throw new ApiError(400, "Invalid album or art post ID");
    }

    const album = await Album.findById(albumId);

    if (!album) {
        throw new ApiError(404, "Album not found");
    }

    const artPost = await ArtPost.findById(artPostId);

    if (!artPost) {
        throw new ApiError(404, "Art Post not found");
    }

    if (album.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to add art post to this album");
    }

    album.artPost.push(artPostId);

    const updatedAlbum = await album.save();

    return res.status(200)
        .json(
            new ApiResponse(200, updatedAlbum, "Art Post added to Album successfully")
        )
});

const getUsersAlbums = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const userAlbum = await Album.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: 'artposts', // MongoDB collection name
                localField: 'artPost', // Field in Album that holds artPost IDs
                foreignField: '_id', // Field in ArtPost to match with Album artPost IDs
                as: 'artPosts', // Alias for the data from ArtPost collection
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
            $lookup: {
                from: 'likes', // Collection for album likes
                localField: '_id', // Album's ID
                foreignField: 'album', // Likes referring to this album
                as: 'likes' // Alias for likes
            }
        },
        {
            $lookup: {
                from: 'users', // Collection for users
                localField: 'owner', // Album's owner ID
                foreignField: '_id', // User's ID
                as: 'owner', // Alias for owner
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
            $addFields: {
                likesCount: { $size: "$likes" }, // Count likes for the album
                isLiked: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$likes.likedBy"]
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
                artPosts: 1, // Include filtered artPosts data
                owner: 1, // Include filtered owner data
                likesCount: 1, // Include album likes count
                isLiked: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, userAlbum, "User's albums retrieved successfully")
    );
});

const removeArtPostFromAlbum = asyncHandler(async (req, res) => {
    const { albumId, artPostId } = req.params;

    if (!mongoose.isValidObjectId(albumId) || !mongoose.isValidObjectId(artPostId)) {
        throw new ApiError(400, "Invalid album or art post ID");
    }

    const album = await Album.findById(albumId);

    if (album.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to remove art post from this album");
    }

    if (!album) {
        throw new ApiError(404, "Album not found");
    }

    const artPost = await ArtPost.findById(artPostId);

    if (!artPost) {
        throw new ApiError(404, "Art Post not found");
    }

    album.artPost = album.artPost.filter(id => id.toString() !== artPostId);

    const updatedAlbum = await album.save();

    return res.status(200)
        .json(
            new ApiResponse(200, updatedAlbum, "Art Post removed from Album successfully")
        )
});

export { createAlbum, deleteAlbum, updateAlbum, addArtPostToAlbum, getAlbum, getUsersAlbums, removeArtPostFromAlbum };