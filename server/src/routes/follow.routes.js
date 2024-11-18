import { Router } from "express";
import { toggleFollow } from "../controllers/follow.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Secured Routes
router.route("/toggle-follow/:id").patch( verifyJWT, toggleFollow );

export default router;