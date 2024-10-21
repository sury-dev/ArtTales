import { Router } from "express";
import { createTalebook,
    deleteTalebook,
    updateTalebook,
    getTalebook,
    addTalePostToTalebook,
    getUsersTalebooks } from "../controllers/taleBook.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured Routes
router.route("/create").post(verifyJWT, upload.single("thumbnail"), createTalebook);
router.route("/:talebookId")
    .delete(verifyJWT, deleteTalebook)
    .patch(verifyJWT, upload.single("thumbnail"), updateTalebook)
    .get(verifyJWT, getTalebook);
router.route("/add-tale-post/:talebookId/:talePostId").patch(verifyJWT, addTalePostToTalebook);
router.route("/get-user-talebooks/:userId").get(verifyJWT, getUsersTalebooks);

export default router;
