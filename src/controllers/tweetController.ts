import { Request, Response } from "express";
import Tweet from "../models/Tweet";
import { TypedRequestBody, TypedRequestQuery } from "../types";
import AppError from "../config/AppError";
import PaginationHelperImpl from "../util/paginationHelper";
import PaginationImpl from "../lib/pagination";
import validateTweet, {
	CreateTweetType,
	ShareTweetType,
} from "../lib/validateTweetCreation";
import { isValuesNotNumber } from "../util/isValuesNotNumber";

type Params = { tweetId?: string };

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
		.lean()
		.exec();

	res.json(pagination.createPaginationResult<typeof tweets>(tweets));
};

export const getTweetById = async (req: Request<Params>, res: Response) => {
	const { tweetId } = req.params;
	if (!tweetId) {
		throw new AppError("All fields are requried!", 400);
	}

	const tweet = await Tweet.findById(tweetId)
		.populateRelations()
		.lean()
		.exec();

	if (!tweet) {
		throw new AppError("Invalid ID!", 400);
	}
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

	const tweetData: CreateTweetType = {
		type: "post",
		body,
		owner: owner._id.toString(),
	};
	const { value, error } = validateTweet(tweetData);
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
	req: Request<Params, object, INewTweet>,
	res: Response
) => {
	const { user: owner } = req;
	const { tweetId } = req.params;
	const { body } = req.body;

	if (!tweetId || !owner) {
		throw new AppError("All fields are required!", 400);
	}

	const tweetData: ShareTweetType = {
		type: "share",
		origin: tweetId,
		owner: owner._id.toString(),
	};
	if (body) {
		tweetData.body = body;
	}
	const { value, error } = validateTweet(tweetData);
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
	req: Request<Params, object, { body?: string }>,
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

export const deleteTweet = async (req: Request<Params>, res: Response) => {
	const { tweet } = req;
	if (!tweet) {
		throw new AppError("Invalid Tweet ID!", 400);
	}
	await tweet.deleteOne();
	res.json({ status: "success", message: "Tweet deleted successfully!" });
};
