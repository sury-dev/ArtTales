import mongoose from "mongoose";

// Slide schema to represent individual slides with text and optional image
const SlideSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Cloudinary URL for the image
    required: false,
  },
});

// TalePost schema to represent the full story with a cover image, title, slides, and author reference
const TalePostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String, // Cloudinary URL for the cover image
    required: true,
  },
  slides: [SlideSchema], // Array of slide objects
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false, // Draft or published state
  },
});

export const TalePost = mongoose.model("TalePost", TalePostSchema);
