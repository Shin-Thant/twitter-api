import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import Tweet from "../models/Tweet";

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

	const foundTweet = await Tweet.findById(tweetId).exec();
	if (!foundTweet) {
		throw new AppError("Invalid ID!", 400);
	}

	if (foundTweet.owner.toString() !== owner._id.toString()) {
		throw new AppError("Unauthorized!", 401);
	}

	req.tweet = foundTweet;
	next();
};

export default verifyTweetOwner;
