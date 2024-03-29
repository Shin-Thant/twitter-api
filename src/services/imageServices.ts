import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import AppError from "../config/AppError";
import { UploadedFile } from "../middlewares/tweetBodyOrImage";
import { LoggerService } from "./loggerService";
import { LoggerProvider } from "../util/LoggerProvider";

const logger = new LoggerService(LoggerProvider.getInstance("ImageService"));

const ALLOWED_TYPES = ["png", "jpg", "jpeg"] as const;
type Allowed_Type = (typeof ALLOWED_TYPES)[number];

export async function saveManyImages({
	images,
	names,
}: {
	images: Express.Multer.File[];
	names: string[];
}) {
	return await Promise.all(
		images.map(async (image, index) => {
			return await saveImage({
				name: names[index],
				image: image,
			});
		})
	);
}

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

	const dest = getImagePath({ imageName: name });
	return await sharp(image.buffer).toFile(dest);
}

export function isValidImageType(mimetype: string): mimetype is Allowed_Type {
	const type = getExtensionFrom({ mimetype });

	return !!type && !!ALLOWED_TYPES.find((t) => t === type);
}

export async function deleteManyImages({
	imageNames,
}: {
	imageNames: string[];
}) {
	for (const imageName of imageNames) {
		const path = getImagePath({ imageName });
		const imageExists = await checkImageExist({ path });
		if (!imageExists) {
			return;
		}
		await deleteImage({ path });
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
		logger.error({
			name: "Image exist check error!",
			path,
			err: JSON.stringify(err),
		});
		return false;
	}
}

async function deleteImage({ path }: { path: string }) {
	await fs.unlink(path);
}

export function getImagePath({ imageName }: { imageName: string }): string {
	return path.join(__dirname, "..", "..", "public", "uploads", imageName);
}

export function generateManyImageNames({
	images,
}: {
	images: Express.Multer.File[];
}): string[] {
	return images.reduce((acc, image) => {
		acc.push(generateImageName({ mimetype: image.mimetype }));
		return acc;
	}, [] as string[]);
}

// {random_alphanumerics}-{timestamp}
const BYTES_LENGTH = 16;
const ENCODING_TYPE = "hex";
export function generateImageName({ mimetype }: { mimetype: string }) {
	const timestamp = Date.now();
	return `${generateAlphanumerics()}-${timestamp}.${getExtensionFrom({
		mimetype,
	})}`;
}

function generateAlphanumerics() {
	return crypto.randomBytes(BYTES_LENGTH).toString(ENCODING_TYPE);
}

const SPLIT_CHAR = "/" as const;
const EXTENSION_TYPE_INDEX = 1 as const;
const getExtensionFrom = ({ mimetype }: { mimetype: string }) => {
	return mimetype.split(SPLIT_CHAR)[EXTENSION_TYPE_INDEX];
};

export function getUpdatedImageNames({
	uploadedImages,
	oldImageNames,
}: {
	uploadedImages: UploadedFile[];
	oldImageNames: string[];
}): string[] {
	return uploadedImages.map((uploadedImage) => {
		if (oldImageNames.includes(uploadedImage.originalname)) {
			return uploadedImage.originalname;
		}
		return generateImageName({
			mimetype: uploadedImage.mimetype,
		});
	});
}

export function getNewImageNames({
	updatedImageNames,
	oldImageNames,
}: {
	updatedImageNames: string[];
	oldImageNames: string[];
}): string[] {
	return updatedImageNames.filter(
		(updatedImageName) => !oldImageNames.includes(updatedImageName)
	);
}

export function getNewImages({
	uploadedImages,
	oldImageNames,
}: {
	uploadedImages: UploadedFile[];
	oldImageNames: string[];
}): UploadedFile[] {
	return uploadedImages.filter(
		(uploadedImage) => !oldImageNames.includes(uploadedImage.originalname)
	);
}

export function getRemovedImageNames({
	oldImageNames,
	updatedImageNames,
}: {
	oldImageNames: string[];
	updatedImageNames: string[];
}): string[] {
	return oldImageNames.filter(
		(oldImageName) => !updatedImageNames.includes(oldImageName)
	);
}
