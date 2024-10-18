import { Router } from "express";
import { createAlbum, deleteAlbum, updateAlbum, getAlbum, addArtPostToAlbum, getUsersAlbums, removeArtPostFromAlbum } from "../controllers/album.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Secured Routes
router.route("/create").post( verifyJWT, upload.single("thumbnail"), createAlbum );
router.route("/:albumId")
    .delete(verifyJWT, deleteAlbum)
    .patch(verifyJWT, upload.single("thumbnail"), updateAlbum)
    .get(verifyJWT, getAlbum);
router.route("/add-art-post/:albumId/:artPostId").patch(verifyJWT, addArtPostToAlbum);
router.route("/get-user-album/:userId").get(verifyJWT, getUsersAlbums);
router.route("/remove-art-post-from-album/:albumId/:artPostId").patch(verifyJWT, removeArtPostFromAlbum);

export default router;