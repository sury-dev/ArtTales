import { Router } from "express";
import {createArtPost, getProfileArtPosts  } from "../controllers/artPost.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Secured Routes
router.route("/post").post( verifyJWT, upload.single("artFile"), createArtPost );
router.route("/profile/:username/:artPost").get(verifyJWT, getProfileArtPosts);

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