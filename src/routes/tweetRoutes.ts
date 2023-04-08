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

const router = Router();

// TODO: add `verifyJWT` after testing in `create tweet`, `share tweet`

router.route("/").get(getTweets).post(verifyJWT, createTweet);

router
	.route("/:tweetId")
	.get(getTweetById)
	.patch(verifyJWT, verifyTweetOwner, updateTweet)
	.delete(verifyJWT, verifyTweetOwner, deleteTweet);

router.route("/share/:tweetId").post(verifyJWT, shareTweet);

export default router;
