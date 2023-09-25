import { ErrorCode, MulterError } from "multer";

type ImageUploadErrors = Partial<Record<ErrorCode, string | null>>;

const IMAGE_UPLOAD_ERRORS: ImageUploadErrors = {
	LIMIT_FILE_SIZE: "Image too large!",
	LIMIT_FILE_COUNT: "Too many images!",
	LIMIT_UNEXPECTED_FILE: "Unexpected image field!",
};

export function createImageUploadError(error: MulterError): Error {
	return new Error(IMAGE_UPLOAD_ERRORS[error.code] ?? error.message);
}
