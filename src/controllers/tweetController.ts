import { Request, Response } from "express";
import Tweet, { TweetType } from "../models/Tweet";
import { TypedRequestBody, TypedRequestQuery } from "../types";
import AppError from "../config/AppError";
import { checkValuesString } from "../util/paginationHelper";
import PaginationImpl from "../lib/pagination";
import validateTweet from "../lib/validateTweetCreation";

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
	if (checkValuesString(itemsPerPage, currentPage)) {
		throw new AppError("Enter valid values", 400);
	}

	const totalTweets = await Tweet.countDocuments({});
	console.log({ totalTweets });

	const pagination = new PaginationImpl(
		parseInt(itemsPerPage),
		parseInt(currentPage),
		totalTweets
	);
	// console.log({ totalPages });

	const tweets = await Tweet.find()
		.limit(pagination.itemsPerPage)
		.skip(pagination.skip)
		.sort("-createdAt")
		.populateRelations();

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

interface INewTweet<T extends "post" | "share"> {
	type?: T;
	body?: string;
}

export const createTweet = async (
	req: TypedRequestBody<INewTweet<"post">>,
	res: Response
) => {
	const { type, body } = req.body;
	const { user } = req;
	if (!type || !body || !user) {
		throw new AppError("All fields are required!", 400);
	}

	if (type !== "post") {
		throw new AppError("Invalid tweet type!", 400);
	}

	// TODO: test validation and creation actually works
	// TODO: add ObjectId not string. check this works
	const tweetData: TweetType<string> = {
		type,
		body,
		owner: user._id.toString(),
	};
	console.log({ id: user._id });

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

interface ISharedTweet extends INewTweet<"share"> {
	origin?: string;
}
// TODO: checks shareTweet works
export const shareTweet = async (
	req: Request<Params, object, ISharedTweet>,
	res: Response
) => {
	const { tweetId } = req.params;
	const { body, type, origin } = req.body;
	// TODO: test this work
	const { user: owner } = req;

	if (!tweetId || !type || !origin || !owner) {
		throw new AppError("All fields are required!", 400);
	}
	if (type !== "share") {
		throw new AppError("Invalid tweet type!", 400);
	}

	const tweetData: TweetType<string> = {
		type,
		origin,
		body: body || "",
		owner: owner._id.toString(),
	};
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

// TODO: test updateTweet
export const updateTweet = async (
	req: Request<Params, object, { tweetBody?: string }>,
	res: Response
) => {
	const { tweetId } = req.params;
	const { tweetBody } = req.body;
	if (!tweetId || !tweetBody) {
		throw new AppError("All fields are required!", 400);
	}

	const foundTweet = await Tweet.findById(tweetId);
	if (!foundTweet) {
		throw new AppError("Invalid ID!", 400);
	}

	foundTweet.body = tweetBody;
	await foundTweet.save();

	res.json(foundTweet);
};

// TODO: update deleteTweet
export const deleteTweet = async (req: Request<Params>, res: Response) => {
	const { tweetId } = req.params;
	if (!tweetId) {
		throw new AppError("Tweet ID is requried!", 400);
	}
	const foundTweet = await Tweet.findById(tweetId);
	if (!foundTweet) {
		throw new AppError("Invalid ID!", 400);
	}
	await foundTweet.deleteOne();
	res.json({ status: "success", message: "Tweet deleted successfully!" });
};
