import { NextFunction, Response } from "express";
import { CreateTweetInput } from "../schema/tweetSchema";
import { TypedRequestBody } from "../types/requestTypes";

// TODO: test this
export function tweetBodyOrImage(
	req: TypedRequestBody<CreateTweetInput>,
	res: Response,
	next: NextFunction
) {
	const { body } = req.body;
	const files = req.files;

	console.log({ body, files });

	if (!body && !files) {
		const error = new Error("Bad request!");
		return next(error);
	}
	next();
}
