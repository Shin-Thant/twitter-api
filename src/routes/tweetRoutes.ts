import { Router } from "express";
import {
	addNewComment,
	getTweetComments,
} from "../controllers/commentController";
import {
	createTweetHandler,
	deleteTweetHandler,
	editTweetHandler,
	getTweetById,
	getTweets,
	handleLikes,
	shareTweet,
} from "../controllers/tweetController";
import { uploadMany } from "../middlewares/imageUpload";
import { saveTweetImages } from "../middlewares/saveTweetImages";
import { tweetBodyOrImage } from "../middlewares/tweetBodyOrImage";
import validateResource from "../middlewares/validateResource";
import verifyJWT from "../middlewares/verifyJWT";
import verifyTweetOwner from "../middlewares/verifyTweetOwner";
import {
	createCommentSchema,
	getCommentsSchema,
} from "../validationSchemas/commentSchema";
import {
	createTweetSchema,
	editTweetSchema,
	getTweetByIdSchema,
	getTweetsSchema,
	likeTweetSchema,
	shareTweetSchema,
} from "../validationSchemas/tweetSchema";

const router = Router();

// TODO: handler `Unexpected end of form` error

router
	.route("/")
	.get([validateResource(getTweetsSchema)], getTweets)
	.post(
		[
			verifyJWT,
			validateResource(createTweetSchema),
			uploadMany({ fieldName: "photos", maxFileCount: 4 }),
			tweetBodyOrImage,
			saveTweetImages,
		],
		createTweetHandler
	);

router
	.route("/:tweetId")
	.get(validateResource(getTweetByIdSchema), getTweetById)
	.put(
		[
			verifyJWT,
			validateResource(editTweetSchema),
			verifyTweetOwner,
			uploadMany({ fieldName: "photos", maxFileCount: 4 }),
			tweetBodyOrImage,
			saveTweetImages,
		],
		editTweetHandler
	)
	.delete(verifyJWT, verifyTweetOwner, deleteTweetHandler);

router
	.route("/:tweetId/like")
	.patch([verifyJWT, validateResource(likeTweetSchema)], handleLikes);

router
	.route("/:tweetId/share")
	.post([verifyJWT, validateResource(shareTweetSchema)], shareTweet);

// tweet's comment routes
router
	.route("/:tweetId/comments")
	.get(validateResource(getCommentsSchema), getTweetComments)
	.post([verifyJWT, validateResource(createCommentSchema)], addNewComment);

export default router;
