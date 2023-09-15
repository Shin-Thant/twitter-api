import sharp from "sharp";
import fs from "fs/promises";
import AppError from "../config/AppError";
import path from "path";

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

export async function deleteManyImages(images: string[]) {
	for (const image in images) {
		const imagePath = getImagePath({ imageName: image });
		const imageExists = await checkImageExist(imagePath);
		if (!imageExists) {
			return;
		}
		await deleteImage(imagePath);
	}
}

export async function checkImageExist(imagePath: string): Promise<boolean> {
	try {
		await fs.access(imagePath, fs.constants.F_OK);
		return true;
	} catch (err) {
		return false;
	}
}

export async function deleteImage(imagePath: string) {
	await fs.unlink(imagePath);
}

export function getImagePath({ imageName }: { imageName: string }): string {
	return path.join(__dirname, "..", "..", "public", "uploads", imageName);
}
