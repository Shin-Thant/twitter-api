import { Request, Response } from "express";
import AppError from "../config/AppError";
import PaginationImpl from "../lib/pagination";
import santitizeTweetData, {
	CreateTweet,
	ShareTweet,
} from "../lib/validateTweetCreation";
import Comment from "../models/Comment";
import Tweet from "../models/Tweet";
import { TypedRequestBody, TypedRequestQuery } from "../types/requestTypes";
import { isValuesNotNumber } from "../util/isValuesNotNumber";
import PaginationHelperImpl from "../util/paginationHelper";
import { UnpopulatedTweet } from "../models/types/tweetTypes";
import { CreateTweetInput } from "../schema/tweetSchema";
import { UserDoc } from "../models/types/userTypes";

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

	const totalTweets = await Tweet.countDocuments({});

	const pagination = new PaginationImpl({
		itemsPerPage: parseInt(itemsPerPage),
		currentPage: parseInt(currentPage),
		totalDocs: totalTweets,
		helper: new PaginationHelperImpl(),
	});

	const tweets = await Tweet.find()
		.populateRelations({ populateComments: true, populateShares: true })
		.limit(pagination.itemsPerPage * pagination.currentPage)
		.sort("-createdAt")
		.exec();

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

	const tweet = await Tweet.findById(tweetId)
		.populateRelations({ populateComments: true })
		.exec();

	if (!tweet) {
		throw new AppError("Invalid ID!", 400);
	}
	res.json(tweet);
};

export const createTweet = async (
	req: TypedRequestBody<CreateTweetInput>,
	res: Response
) => {
	const { body } = req.body;
	const owner = req.user as UserDoc;

	const tweetData: CreateTweet = {
		type: "post",
		body,
		owner: owner._id.toString(),
	};

	const newTweet = await Tweet.create(tweetData);
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

	const originTweet = await Tweet.findById<UnpopulatedTweet>(tweetId).exec();
	if (!originTweet) {
		throw new AppError("Invalid tweet ID!", 400);
	}

	const tweetData: ShareTweet = {
		type: "share",
		origin: tweetId,
		owner: owner._id.toString(),
	};
	if (body) {
		tweetData.body = body;
	}
	const { value, error } = santitizeTweetData(tweetData);
	if (error) {
		throw error;
	}

	// create share tweet
	const newSharedTweet = await Tweet.create(value);
	if (!newSharedTweet) {
		throw new AppError("Some went wrong", 500);
	}

	// update original tweet
	originTweet.shares.push(newSharedTweet._id);
	await originTweet.save();

	res.json(newSharedTweet);
};

export const updateTweet = async (
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

	const tweet = await Tweet.findById<UnpopulatedTweet>(tweetId).exec();
	if (!tweet) {
		throw new AppError("Invalid tweet ID!", 400);
	}

	const isLiked = tweet.likes.includes(user._id);

	if (!isLiked) {
		// add like
		tweet.likes.push(user._id);
	} else {
		// remove like
		tweet.likes = tweet.likes.filter(
			(userId) => userId.toString() !== user._id.toString()
		);
	}
	await tweet.save();
	res.json(tweet);
};

export const deleteTweet = async (req: Request<TweetParams>, res: Response) => {
	const { tweet } = req;
	if (!tweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}
	await Comment.deleteMany({ tweet: tweet._id });
	await tweet.deleteOne();
	res.json({ status: "success", message: "Tweet deleted successfully!" });
};
