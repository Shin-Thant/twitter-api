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
	deleteCommentSchema,
	likeCommentSchema,
	updateCommentSchema,
} from "../validationSchemas/commentSchema";

const router = Router({ mergeParams: true });

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

router.put(
	"/:commentId/likes",
	[verifyJWT, validateResource(likeCommentSchema)],
	handleCommentLikes
);

export default router;
