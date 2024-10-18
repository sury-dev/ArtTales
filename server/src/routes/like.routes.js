import { Router } from "express";
import { toggleArtPostLike, toggleAlbumLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Secured Routes
router.route("/toggle-art-like/:artPostId").patch( verifyJWT, toggleArtPostLike );
router.route("/toggle-album-like/:albumId").patch( verifyJWT, toggleAlbumLike );

export default router;