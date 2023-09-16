import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import AppError from "../config/AppError";
import logger from "../util/logger";

const ALLOWED_TYPES = ["png", "jpg", "jpeg"] as const;
type TYPE = (typeof ALLOWED_TYPES)[number];

export async function saveImage({
	name,
	image,
}: {
	name: string;
	image: Express.Multer.File;
}) {
	if (!isValidImageType(image.mimetype)) {
		new AppError("Invalid image type", 401);
	}

	const dest = getImagePath({
		imageName: `${name}.${getExtensionTypeFor(image.mimetype)}`,
	});
	return await sharp(image.buffer).toFile(dest);
}

export function isValidImageType(mimetype: string): mimetype is TYPE {
	const type = getExtensionTypeFor(mimetype);

	return !!type && !!ALLOWED_TYPES.find((t) => t === type);
}

const SPLIT_CHAR = "/" as const;
const TYPE_INDEX = 1 as const;
const getExtensionTypeFor = (mimetype: string) => {
	return mimetype.split(SPLIT_CHAR)[TYPE_INDEX];
};

export async function deleteManyImages(imageNames: string[]) {
	for (const imageName in imageNames) {
		const imagePath = getImagePath({ imageName });
		const imageExists = await checkImageExist({ path: imagePath });
		if (!imageExists) {
			return;
		}
		await deleteImage({ path: imagePath });
	}
}

export async function checkImageExist({
	path,
}: {
	path: string;
}): Promise<boolean> {
	try {
		await fs.access(path, fs.constants.F_OK);
		return true;
	} catch (err) {
		logger.error("Image exist check error!", err);
		return false;
	}
}

async function deleteImage({ path }: { path: string }) {
	await fs.unlink(path);
}

export function getImagePath({ imageName }: { imageName: string }): string {
	return path.join(__dirname, "..", "..", "public", "uploads", imageName);
}