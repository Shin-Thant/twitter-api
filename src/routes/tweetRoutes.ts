import { Router } from "express";
import { getTweetComments } from "../controllers/commentController";
import {
	createTweetHandler,
	deleteTweetHandler,
	getTweetById,
	getTweets,
	handleLikes,
	shareTweet,
	editTweetHandler,
} from "../controllers/tweetController";
import verifyJWT from "../middlewares/verifyJWT";
import verifyTweetOwner from "../middlewares/verifyTweetOwner";
import validateResource from "../middlewares/validateResource";
import { createTweetSchema, editTweetSchema } from "../schema/tweetSchema";
import { uploadMany } from "../middlewares/imageUpload";
import { saveTweetImages } from "../middlewares/saveTweetImages";
import { tweetBodyOrImage } from "../middlewares/tweetBodyOrImage";

const router = Router();

// TODO: handler `Unexpected end of form` error

router
	.route("/")
	.get(getTweets)
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
	.get(getTweetById)
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

router.route("/:tweetId/like").patch(verifyJWT, handleLikes);

router.route("/:tweetId/share").post(verifyJWT, shareTweet);

router.route("/:tweetId/comments").get(getTweetComments);

export default router;
