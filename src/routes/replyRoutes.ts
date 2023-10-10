import { Router } from "express";
import { replyComment } from "../controllers/replyController";
import verifyJWT from "../middlewares/verifyJWT";

const router = Router();

// /comments/some-id/reply
// router.route("/:commentId").post(verifyJWT, replyComment);

export default router;
