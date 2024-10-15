import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentUserPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateCoverImage, getUserProfile, createTalePost } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

//Secured Routes

router.route("/logout").post(verifyJWT ,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-coverimage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/profiles/:username").get(verifyJWT, getUserProfile)
router.route("/create").post(
    verifyJWT, // Ensure only authenticated users can create a post
    upload.fields([
      { name: "coverImage", maxCount: 1 }, // Handle cover image
      { name: "slidesImages" }, // Handle multiple slide images
    ]),
    createTalePost
);

export default router;