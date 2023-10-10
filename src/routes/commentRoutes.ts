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
	deleteCommentSchema,
	getCommentsSchema,
	updateCommentSchema,
} from "../validationSchemas/commentSchema";

const router = Router({ mergeParams: true });

router
	.route("/")
	.get(validateResource(getCommentsSchema), getTweetComments)
	.post([verifyJWT, validateResource(createCommentSchema)], addNewComment);

router
	.route("/:commentId")
	.get(getCommentById)
	.put(
		[verifyJWT, validateResource(updateCommentSchema), verifyCommentOwner],
		updateComment
	)
	.delete(
		[verifyJWT, validateResource(deleteCommentSchema), verifyCommentOwner],
		deleteComment
	);

export default router;
