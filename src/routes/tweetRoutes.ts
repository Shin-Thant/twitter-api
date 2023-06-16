import { Router } from "express";
import { getTweetComments } from "../controllers/commentController";
import {
	createTweet,
	deleteTweet,
	getTweetById,
	getTweets,
	handleLikes,
	shareTweet,
	updateTweet,
} from "../controllers/tweetController";
import verifyJWT from "../middlewares/verifyJWT";
import verifyTweetOwner from "../middlewares/verifyTweetOwner";

const router = Router();

router.route("/").get(getTweets).post(verifyJWT, createTweet);

router
	.route("/:tweetId")
	.get(getTweetById)
	.patch(verifyJWT, verifyTweetOwner, updateTweet)
	.delete(verifyJWT, verifyTweetOwner, deleteTweet);

router.route("/:tweetId/like").patch(verifyJWT, handleLikes);

router.route("/:tweetId/share").post(verifyJWT, shareTweet);

router.route("/:tweetId/comments").get(getTweetComments);

export default router;
