import { NextFunction, Request, Response } from "express";
import AppError from "../config/AppError";
import { generateImageName, saveImage } from "../services/imageServices";
import path from "path";
import fsPromise from "fs/promises";

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
			throw new AppError("Invalid image field!", 400);
		}

		const result = await fsPromise.readdir(
			path.join(__dirname, "..", "..", "public")
		);
		console.log({ result });

		try {
			await fsPromise.access(
				path.join(__dirname, "..", "..", "public/uploads"),
				fsPromise.constants.F_OK
			);
		} catch (err) {
			console.log(err);
		}

		// const imageNames = await Promise.all(
		// 	files.map(async (file) => {
		// 		const name = generateImageName();
		// 		const imageInfo = await saveImage({ name, image: file });
		// 		return `${name}.${imageInfo.format}`;
		// 	})
		// );

		// res.locals.imageNames = [...imageNames];
		next();
	} catch (err) {
		next(err);
	}
}
