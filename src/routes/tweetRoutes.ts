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
	retweet,
	shareTweet,
} from "../controllers/tweetController";
import { uploadMany } from "../middlewares/imageUpload";
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
	retweetSchema,
	shareTweetSchema,
} from "../validationSchemas/tweetSchema";
import { MULTIPLE_FILES } from "../config/imageUploadConfig";

const router = Router();

// TODO: handler `Unexpected end of form` error

router
	.route("/")
	.get([validateResource(getTweetsSchema)], getTweets)
	.post(
		[
			verifyJWT,
			validateResource(createTweetSchema),
			uploadMany({
				fieldName: MULTIPLE_FILES.FIELD_NAME,
				maxFileCount: MULTIPLE_FILES.TOTAL_COUNT,
			}),
			tweetBodyOrImage,
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
			uploadMany({
				fieldName: MULTIPLE_FILES.FIELD_NAME,
				maxFileCount: MULTIPLE_FILES.TOTAL_COUNT,
			}),
			tweetBodyOrImage,
		],
		editTweetHandler
	)
	.delete(verifyJWT, verifyTweetOwner, deleteTweetHandler);

router
	.route("/:tweetId/like")
	.patch([verifyJWT, validateResource(likeTweetSchema)], handleLikes);

router.route("/:tweetId/share").post(
	[
		verifyJWT,
		validateResource(shareTweetSchema),
		uploadMany({
			fieldName: MULTIPLE_FILES.FIELD_NAME,
			maxFileCount: MULTIPLE_FILES.TOTAL_COUNT,
		}),
		tweetBodyOrImage,
	],
	shareTweet
);

router.post(
	"/:tweetId/retweet",
	[verifyJWT, validateResource(retweetSchema)],
	retweet
);

// tweet's comment routes
router
	.route("/:tweetId/comments")
	.get(validateResource(getCommentsSchema), getTweetComments)
	.post([verifyJWT, validateResource(createCommentSchema)], addNewComment);

export default router;
