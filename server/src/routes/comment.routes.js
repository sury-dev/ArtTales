import { Router } from "express";
import { getArtPostComments, addCommentToArtPost, updateComment, deleteComment, addCommentToComment, getCommentComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Secured Routes
router.route("/comment-to-art/:artPostId").post( verifyJWT, addCommentToArtPost );
router.route("/get-comments-of-art/:artPostId").get( verifyJWT, getArtPostComments );
router.route("/comment-to-comment/:commentId").post( verifyJWT, addCommentToComment );
router.route("/get-comments-of-comment/:commentId").get( verifyJWT, getCommentComments );
router.route("/update-comment/:commentId").patch( verifyJWT, updateComment );
router.route("/delete-comment/:commentId").delete( verifyJWT, deleteComment );

export default router;