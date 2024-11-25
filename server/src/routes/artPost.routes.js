import { Router } from "express";
import { createArtPost, getArtPost, getAllArtPosts, getProfileArtPosts, updateArtPost, deleteArtPost, togglePublishArtPost, incrementViewCount } from "../controllers/artPost.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

const router = Router();

//Secured Routes
router.route("/post").post( verifyJWT, upload.single("artFile"), createArtPost );
router.route("/artPost/:id").get(verifyJWT, getArtPost);
router.route("/get-all-posts").get(verifyJWT, getAllArtPosts);
router.route("/get-profile-art-posts/:username").get(verifyJWT, getProfileArtPosts);
router.route("/update-art-post").patch(verifyJWT, updateArtPost);
router.route("/update-publish-status").patch(verifyJWT, togglePublishArtPost);
router.route("/delete-art-post/:id").delete(verifyJWT, deleteArtPost);
router.route("/increment-view-count/:id").patch(verifyJWT, incrementViewCount);

// router.route("/logout").post(verifyJWT ,logoutUser);
// router.route("/refresh-token").post(refreshAccessToken);
// router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
// router.route("/current-user").get(verifyJWT, getCurrentUser);
// router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
// router.route("/update-coverimage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

// router.route("/profiles/:username").get(verifyJWT, getUserProfile)
/*router.route("/create").post(
    verifyJWT, // Ensure only authenticated users can create a post
    upload.fields([
      { name: "coverImage", maxCount: 1 }, // Handle cover image
      { name: "slidesImages" }, // Handle multiple slide images
    ]),
    createTalePost
);*/

export default router;