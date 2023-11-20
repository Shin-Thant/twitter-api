import { Router } from "express";
import {
	deleteCommentHandler,
	getCommentById,
	getCommentReplies,
	handleCommentLikes,
	updateComment,
} from "../controllers/commentController";
import { replyComment } from "../controllers/replyController";
import validateResource from "../middlewares/validateResource";
import verifyCommentOwner from "../middlewares/verifyCommentOwner";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createReplySchema,
	deleteCommentSchema,
	getCommentByIdSchema,
	getCommentRepliesSchema,
	likeCommentSchema,
	updateCommentSchema,
} from "../validationSchemas/commentSchema";

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
		deleteCommentHandler
	);

router.put(
	"/:commentId/likes",
	[verifyJWT, validateResource(likeCommentSchema)],
	handleCommentLikes
);

router
	.route("/:commentId/replies")
	.get(validateResource(getCommentRepliesSchema), getCommentReplies)
	.post([verifyJWT, validateResource(createReplySchema)], replyComment);

export default router;
