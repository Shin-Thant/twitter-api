import { Router } from "express";
import {
	deleteComment,
	getCommentById,
	handleCommentLikes,
	updateComment,
} from "../controllers/commentController";
import validateResource from "../middlewares/validateResource";
import verifyCommentOwner from "../middlewares/verifyCommentOwner";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createReplySchema,
	deleteCommentSchema,
	getCommentByIdSchema,
	likeCommentSchema,
	updateCommentSchema,
} from "../validationSchemas/commentSchema";
import { replyCommentHandler } from "../controllers/replyController";

const router = Router({ mergeParams: true });

router
	.route("/:commentId")
	.get(validateResource(getCommentByIdSchema), getCommentById)
	.put(
		[verifyJWT, validateResource(updateCommentSchema), verifyCommentOwner],
		updateComment
	)
	.delete(
		[verifyJWT, validateResource(deleteCommentSchema), verifyCommentOwner],
		deleteComment
	);

router.put(
	"/:commentId/likes",
	[verifyJWT, validateResource(likeCommentSchema)],
	handleCommentLikes
);

router.post(
	"/:commentId/reply",
	[verifyJWT, validateResource(createReplySchema)],
	replyCommentHandler
);

export default router;
