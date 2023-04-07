import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT";
import {
	createTweet,
	getTweetById,
	getTweets,
	shareTweet,
} from "../controllers/tweetController";

const router = Router();

// TODO: add `verifyJWT` after testing in `create tweet`, `share tweet`

router.route("/").get(getTweets).post(createTweet);

router.route("/:tweetId").get(getTweetById);

router.route("/share/:tweetId").post(shareTweet);

export default router;
