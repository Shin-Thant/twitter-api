import { NextFunction, Response } from "express";
import { CreateTweetInput } from "../validationSchemas/tweetSchema";
import { TypedRequestBody } from "../types/requestTypes";
import AppError from "../config/AppError";

export function tweetBodyOrImage(
	req: TypedRequestBody<CreateTweetInput>,
	_res: Response,
	next: NextFunction
) {
	const { body } = req.body;
	const files = req.files;

	if (!body && (!files || !files.length)) {
		const error = new AppError(
			"Tweet body or photos must be provided!",
			400
		);
		return next(error);
	}
	next();
}
