import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import AppError from "../config/AppError";
import logger from "../util/logger";

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

	const dest = getImagePath({
		imageName: `${name}.${getExtensionFrom({ mimetype: image.mimetype })}`,
	});
	return await sharp(image.buffer).toFile(dest);
}

export function isValidImageType(mimetype: string): mimetype is Allowed_Type {
	const type = getExtensionFrom({ mimetype });

	return !!type && !!ALLOWED_TYPES.find((t) => t === type);
}

const SPLIT_CHAR = "/" as const;
const TYPE_INDEX = 1 as const;
const getExtensionFrom = ({ mimetype }: { mimetype: string }) => {
	return mimetype.split(SPLIT_CHAR)[TYPE_INDEX];
};

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
		console.log({ err });
		logger.error("Image exist check error!", path, err);
		return false;
	}
}

async function deleteImage({ path }: { path: string }) {
	await fs.unlink(path);
}

export function getImagePath({ imageName }: { imageName: string }): string {
	return path.join(__dirname, "..", "..", "public", "uploads", imageName);
}

export function generateManyImageNames({ total }: { total: number }): string[] {
	const names: string[] = [];
	for (let i = 0; i < total; i++) {
		names.push(generateImageName());
	}
	return names;
}

// {random_alphanumerics}-{timestamp}
const BYTES_LENGTH = 16;
const ENCODING = "hex";
export function generateImageName() {
	const randomAlphanumerics = crypto
		.randomBytes(BYTES_LENGTH)
		.toString(ENCODING);

	const timestamp = Date.now();

	return `${randomAlphanumerics}-${timestamp}`;
}
