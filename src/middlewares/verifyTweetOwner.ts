import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import { findTweet } from "../services/tweetServices";
import isObjectId from "../lib/isObjectId";

const verifyTweetOwner = async (
	req: Request<{ tweetId?: string }>,
	res: Response,
	next: NextFunction
) => {
	const { user: owner } = req;
	const { tweetId } = req.params;
	if (!owner) {
		throw new AppError("Unauthorized!", 401);
	}
	if (!tweetId) {
		throw new AppError("Tweet ID is requried!", 400);
	}
	if (!isObjectId(tweetId)) {
		throw new AppError("Invalid ID!", 400);
	}

	const foundTweet = await findTweet({ filter: { _id: tweetId } });
	if (!foundTweet) {
		throw new AppError("Invalid ID!", 400);
	}

	if (foundTweet.owner._id.toString() !== owner._id.toString()) {
		throw new AppError("Unauthorized!", 401);
	}

	req.tweet = foundTweet;
	next();
};

export default verifyTweetOwner;
