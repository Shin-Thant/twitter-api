import { Router } from "express";
import {
	addNewComment,
	deleteComment,
	getAllComments,
	getCommentById,
	updateComment,
} from "../controllers/commentController";
import verifyJWT from "../middlewares/verifyJWT";
import verifyCommentOwner from "../middlewares/verifyCommentOwner";
import { replyComment } from "../controllers/replyController";

const router = Router();

// TODO: add comments routes to tweet routes

router.route("/").get(getAllComments).post(verifyJWT, addNewComment);

router
	.route("/:commentId")
	.get(getCommentById)
	.put(verifyJWT, verifyCommentOwner, updateComment)
	.delete(verifyJWT, verifyCommentOwner, deleteComment);

// TODO: test this works
router.route("/:commentId/reply").post(verifyJWT, replyComment);

export default router;
