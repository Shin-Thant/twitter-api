import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import AppError from "../config/AppError";
import { saveImage } from "../util/saveImage";

export async function saveTweetImages(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const files = req.files;

		if (!files) {
			return next();
		}
		if (!Array.isArray(files)) {
			return next(new AppError("Invalid image fields!", 400));
		}

		// TODO: test this when it throws error
		const imageNames = await Promise.all(
			files.map(async (file) => {
				const name = generateAlphanumericTimestampName();
				const imageInfo = await saveImage({ name, image: file });

				return `${name}.${imageInfo.format}`;
			})
		);

		res.locals.imageNames = [...imageNames];
		next();
	} catch (err) {
		next(err);
	}
}

// {random_alphanumerics}-{timestamp}

const BYTES_LENGTH = 16;
function generateAlphanumericTimestampName() {
	const randomAlphanumerics = crypto
		.randomBytes(BYTES_LENGTH)
		.toString("hex");
	const timestamp = Date.now();

	const name = `${randomAlphanumerics}-${timestamp}`;
	return name;
}
