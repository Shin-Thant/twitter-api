import multer from "multer";
import { isValidImageType } from "../services/imageServices";
import { FILE_SIZE_IN_BYTES } from "../config/imageUploadConfig";

// memory storage is default
const upload = multer({
	limits: {
		fileSize: FILE_SIZE_IN_BYTES,
	},
	fileFilter(_req, file, callback) {
		if (isValidImageType(file.mimetype)) {
			return callback(null, true);
		}
		callback(new Error("Invalid image type!"));
	},
});

export function uploadMany({
	fieldName,
	maxFileCount,
}: {
	fieldName: string;
	maxFileCount: number;
}) {
	return upload.array(fieldName, maxFileCount);
}
