import sharp from "sharp";
import AppError from "../config/AppError";
import path from "path";
import { isValidImageType } from "./isValidImageType";

const DESTINATION = path.join(__dirname, "..", "..", "public", "uploads");

type SaveImageParams = {
	name: string;
	image: Express.Multer.File;
};

export async function saveImage({ name, image }: SaveImageParams) {
	// throw new Error("something");
	const type = getImageType(image.mimetype);

	if (!isValidImageType(type)) {
		new AppError("Invalid image type", 401);
	}

	const dest = `${DESTINATION}/${name}.${type}`;
	return await sharp(image.buffer).toFile(dest);
}

const SPLIT_CHAR = "/" as const;
const TYPE_INDEX = 1 as const;
const getImageType = (mimetype: string) => {
	return mimetype.split(SPLIT_CHAR)[TYPE_INDEX];
};
