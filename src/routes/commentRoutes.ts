import { Router } from "express";
import {
	addNewComment,
	deleteComment,
	getCommentById,
	getTweetComments,
	updateComment,
} from "../controllers/commentController";
import validateResource from "../middlewares/validateResource";
import verifyCommentOwner from "../middlewares/verifyCommentOwner";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createCommentSchema,
	getCommentsSchema,
} from "../schema/commentSchema";

const router = Router({ mergeParams: true });

router
	.route("/")
	.get(validateResource(getCommentsSchema), getTweetComments)
	.post([verifyJWT, validateResource(createCommentSchema)], addNewComment);

router
	.route("/:commentId")
	.get(getCommentById)
	.put([verifyJWT, verifyCommentOwner], updateComment)
	.delete([verifyJWT, verifyCommentOwner], deleteComment);

export default router;
