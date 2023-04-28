import { Request, Response } from "express";
import { Types } from "mongoose";
import AppError from "../config/AppError";
import PaginationImpl from "../lib/pagination";
import santitizeTweetData, {
	CreateTweet,
	ShareTweet,
} from "../lib/validateTweetCreation";
import Comment from "../models/Comment";
import Tweet from "../models/Tweet";
import { LeanTweet } from "../models/types/tweetTypes";
import { TypedRequestBody, TypedRequestQuery } from "../types/requestTypes";
import { isValuesNotNumber } from "../util/isValuesNotNumber";
import PaginationHelperImpl from "../util/paginationHelper";
import { CommentRef } from "../models/types/commentTypes";

// TODO: create request handler for adding and remove likes

export type TweetParams = { tweetId?: string };

type SearchQuery = { currentPage?: string; itemsPerPage?: string };
export const getTweets = async (
	req: TypedRequestQuery<SearchQuery>,
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

	const pagination = new PaginationImpl(
		parseInt(itemsPerPage),
		parseInt(currentPage),
		totalTweets,
		new PaginationHelperImpl()
	);

	const tweets = await Tweet.find()
		.limit(pagination.itemsPerPage)
		.skip(pagination.skip)
		.sort("-createdAt")
		.lean<LeanTweet[]>()
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
		.populate<{ comments: CommentRef[] }>("comments")
		.exec();

	if (!tweet) {
		throw new AppError("Invalid ID!", 400);
	}
	// if (!(tweet.origin instanceof Types.ObjectId)) {
	// 	console.log("lean", tweet.origin?.origin);
	// }
	res.json(tweet);
};

interface INewTweet {
	body?: string;
}

export const createTweet = async (
	req: TypedRequestBody<INewTweet>,
	res: Response
) => {
	const { body } = req.body;
	const { user: owner } = req;
	if (!body || !owner) {
		throw new AppError("All fields are required!", 400);
	}

	const tweetData: CreateTweet = {
		type: "post",
		body,
		owner: owner._id.toString(),
	};
	const { value, error } = santitizeTweetData(tweetData);
	if (error) {
		throw error;
	}

	const newTweet = await Tweet.create(value);
	if (!newTweet) {
		throw new AppError("Something went wrong!", 500);
	}

	res.json(newTweet);
};

export const shareTweet = async (
	req: Request<TweetParams, object, INewTweet>,
	res: Response
) => {
	const { user: owner } = req;
	const { tweetId } = req.params;
	const { body } = req.body;

	if (!tweetId || !owner) {
		throw new AppError("All fields are required!", 400);
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

	const newSharedTweet = await Tweet.create(value);
	if (!newSharedTweet) {
		throw new AppError("Some went wrong", 500);
	}
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

export const deleteTweet = async (req: Request<TweetParams>, res: Response) => {
	const { tweet } = req;
	if (!tweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}
	await Comment.deleteMany({ tweet: tweet._id });
	await tweet.deleteOne();
	res.json({ status: "success", message: "Tweet deleted successfully!" });
};
