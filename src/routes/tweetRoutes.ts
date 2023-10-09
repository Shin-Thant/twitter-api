import { Router } from "express";
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
	createTweetSchema,
	editTweetSchema,
	getTweetByIdSchema,
} from "../schema/tweetSchema";
import commentRoutes from "./commentRoutes";

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

router.route("/:tweetId/like").patch(verifyJWT, handleLikes);

router.route("/:tweetId/share").post(verifyJWT, shareTweet);

//router.route("/:tweetId/comments").get(getTweetComments);
router.use(
	"/:tweetId/comments",
	commentRoutes
);

export default router;
