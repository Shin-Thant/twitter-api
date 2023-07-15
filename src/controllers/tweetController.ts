import { Request, Response } from "express";
import AppError from "../config/AppError";
import PaginationImpl from "../lib/pagination";
import { UserDoc } from "../models/types/userTypes";
import { CreateTweetInput } from "../schema/tweetSchema";
import {
	createTweet,
	deleteTweet,
	findManyTweet,
	findTweet,
	getTweetCount,
	handleTweetLikes,
	updateTweet,
} from "../services/tweetServices";
import { TypedRequestBody, TypedRequestQuery } from "../types/requestTypes";
import { isValuesNotNumber } from "../util/isValuesNotNumber";
import PaginationHelperImpl from "../util/paginationHelper";
import { deleteComments } from "../services/commentServices";

export type TweetParams = { tweetId?: string };

type TweetQueryString = { currentPage?: string; itemsPerPage?: string };
export const getTweets = async (
	req: TypedRequestQuery<TweetQueryString>,
	res: Response
) => {
	const { currentPage, itemsPerPage } = req.query;
	if (!currentPage || !itemsPerPage) {
		throw new AppError("All fields are requried!", 400);
	}
	if (isValuesNotNumber(itemsPerPage, currentPage)) {
		throw new AppError("Enter valid values!", 400);
	}

	const totalTweets = await getTweetCount({});

	const pagination = new PaginationImpl({
		itemsPerPage: parseInt(itemsPerPage),
		currentPage: parseInt(currentPage),
		totalDocs: totalTweets,
		helper: new PaginationHelperImpl(),
	});

	const tweets = await findManyTweet(
		{},
		{
			limit: pagination.itemsPerPage * pagination.currentPage,
			sort: "-createdAt",
		},
		{ populateComments: true, populateShares: true }
	);

	res.json(pagination.createPaginationResult<typeof tweets>(tweets));
};

export const getTweetById = async (
	req: Request<TweetParams>,
	res: Response
) => {
	const { tweetId } = req.params;
	if (!tweetId) {
		throw new AppError("All fields are requried!", 400);
	}

	const tweet = await findTweet(
		{ _id: tweetId },
		{ populate: { path: "comments" } }
	);

	if (!tweet) {
		throw new AppError("Invalid ID!", 400);
	}
	res.json(tweet);
};

export const createTweetHandler = async (
	req: TypedRequestBody<CreateTweetInput>,
	res: Response
) => {
	const { body } = req.body;
	const owner = req.user as UserDoc;

	const newTweet = await createTweet({
		type: "post",
		body,
		owner: owner._id.toString(),
	});
	if (!newTweet) {
		throw new AppError("Something went wrong!", 500);
	}

	res.json(newTweet);
};

export const shareTweet = async (
	req: Request<TweetParams, object, CreateTweetInput>,
	res: Response
) => {
	const { user: owner } = req;
	const { tweetId } = req.params;
	const { body } = req.body;

	if (!tweetId || !owner) {
		throw new AppError("All fields are required!", 400);
	}

	const originTweet = await findTweet({ _id: tweetId }, { lean: true });
	if (!originTweet) {
		throw new AppError("Invalid tweet ID!", 400);
	}

	// create share tweet
	const newSharedTweet = await createTweet({
		type: "share",
		body,
		origin: tweetId,
		owner: owner._id.toString(),
	});
	if (!newSharedTweet) {
		throw new AppError("Some went wrong", 500);
	}

	// update original tweet
	await updateTweet(
		{ _id: tweetId },
		{
			$push: {
				shares: newSharedTweet._id,
			},
		}
	);

	res.json(newSharedTweet);
};

export const updateTweetHandler = async (
	req: Request<TweetParams, object, { body?: string }>,
	res: Response
) => {
	const { tweet } = req;
	const { body } = req.body;
	if (!body) {
		throw new AppError("Tweet body is required!", 400);
	}
	if (!tweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}

	tweet.body = body;
	await tweet.save();

	res.json(tweet);
};

export const handleLikes = async (req: Request<TweetParams>, res: Response) => {
	const { user } = req;
	const { tweetId } = req.params;
	if (!user) {
		throw new AppError("Unauthorized!", 400);
	}
	if (!tweetId) {
		throw new AppError("Tweet ID required!", 400);
	}

	const tweet = await findTweet({ _id: tweetId });
	if (!tweet) {
		throw new AppError("Invalid tweet ID!", 400);
	}

	const isLiked = tweet.likes.includes(user._id);

	let updatedTweet;
	if (!isLiked) {
		// add like
		updatedTweet = await handleTweetLikes(
			{ _id: tweetId },
			{ action: "like", item: user._id }
		);
	} else {
		// remove like
		updatedTweet = await handleTweetLikes(
			{ _id: tweetId },
			{ action: "unlike", item: user._id }
		);
	}

	res.json(updatedTweet);
};

export const deleteTweetHandler = async (
	req: Request<TweetParams>,
	res: Response
) => {
	const { tweet } = req;
	if (!tweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}

	await deleteTweet({ _id: tweet._id.toString() });

	await deleteComments({ tweet: tweet._id });
	if (tweet.type === "share" && tweet.origin) {
		// remove one item from original tweet shares
		await updateTweet(
			{ _id: tweet.origin.toString() },
			{
				$pull: {
					shares: tweet._id.toString(),
				},
			}
		);
	}
	res.json({ status: "success", message: "Tweet deleted successfully!" });
};
