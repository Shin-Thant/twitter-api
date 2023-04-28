import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createTweet,
	deleteTweet,
	getTweetById,
	getTweets,
	shareTweet,
	updateTweet,
} from "../controllers/tweetController";
import verifyTweetOwner from "../middlewares/verifyTweetOwner";
import commentRoutes from "./commentRoutes";
import {
	addNewComment,
	getTweetComments,
} from "../controllers/commentController";

const router = Router();

router.route("/").get(getTweets).post(verifyJWT, createTweet);

router
	.route("/:tweetId")
	.get(getTweetById)
	.patch(verifyJWT, verifyTweetOwner, updateTweet)
	.delete(verifyJWT, verifyTweetOwner, deleteTweet);

router.route("/:tweetId/share").post(verifyJWT, shareTweet);

router.route("/:tweetId/comments").get(getTweetComments);

export default router;
