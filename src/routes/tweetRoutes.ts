import { Router } from "express";
import { getTweetComments } from "../controllers/commentController";
import {
	createTweetHandler,
	deleteTweetHandler,
	getTweetById,
	getTweets,
	handleLikes,
	shareTweet,
	updateTweetHandler,
} from "../controllers/tweetController";
import verifyJWT from "../middlewares/verifyJWT";
import verifyTweetOwner from "../middlewares/verifyTweetOwner";
import validateResource from "../middlewares/validateResource";
import { createTweetSchema } from "../schema/tweetSchema";

const router = Router();

router
	.route("/")
	.get(getTweets)
	.post(verifyJWT, validateResource(createTweetSchema), createTweetHandler);

router
	.route("/:tweetId")
	.get(getTweetById)
	.patch(verifyJWT, verifyTweetOwner, updateTweetHandler)
	.delete(verifyJWT, verifyTweetOwner, deleteTweetHandler);

router.route("/:tweetId/like").patch(verifyJWT, handleLikes);

router.route("/:tweetId/share").post(verifyJWT, shareTweet);

router.route("/:tweetId/comments").get(getTweetComments);

export default router;
