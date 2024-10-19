import { Router } from "express";
import { toggleArtPostLike, toggleAlbumLike, getLikedArtPosts, getLikedAlbums } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Secured Routes
router.route("/toggle-art-like/:artPostId").patch( verifyJWT, toggleArtPostLike );
router.route("/toggle-album-like/:albumId").patch( verifyJWT, toggleAlbumLike );
router.route("/get-liked-artposts").get( verifyJWT, getLikedArtPosts );
router.route("/get-liked-albums").get( verifyJWT, getLikedAlbums );

export default router;