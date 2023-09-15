import { MulterError } from "multer";
import { createImageUploadError } from "../lib/createImageUploadError";

describe("createImageUploadError", () => {
	describe("given error with code `LIMIT_FILE_SIZE`", () => {
		it("should return error with message `Image too large!`", () => {
			const multerErr = new MulterError("LIMIT_FILE_SIZE", "photos");
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe("Image too large!");
		});
	});

	describe("given error with code `LIMIT_FILE_COUNT`", () => {
		it("should return error with message `Too many images!`", () => {
			const multerErr = new MulterError("LIMIT_FILE_COUNT", "photos");
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe("Too many images!");
		});
	});

	describe("given error with code `LIMIT_UNEXPECTED_FILE`", () => {
		it("should return error with message `Unexpected image field!`", () => {
			const multerErr = new MulterError(
				"LIMIT_UNEXPECTED_FILE",
				"photos"
			);
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe("Unexpected image field!");
		});
	});

	describe("given error with code `LIMIT_PART_COUNT`", () => {
		it("should return error with input message", () => {
			const multerErr = new MulterError("LIMIT_PART_COUNT", "photos");
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe(multerErr.message);
		});
	});

	describe("given error with code `LIMIT_FIELD_KEY`", () => {
		it("should return error with input message", () => {
			const multerErr = new MulterError("LIMIT_FIELD_KEY", "photos");
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe(multerErr.message);
		});
	});

	describe("given error with code `LIMIT_FIELD_VALUE`", () => {
		it("should return error with input message", () => {
			const multerErr = new MulterError("LIMIT_FIELD_VALUE", "photos");
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe(multerErr.message);
		});
	});

	describe("given error with code `LIMIT_FIELD_COUNT`", () => {
		it("should return error with input message", () => {
			const multerErr = new MulterError("LIMIT_FIELD_COUNT", "photos");
			const result = createImageUploadError(multerErr);

			expect(result.name).toBe("Error");
			expect(result.message).toBe(multerErr.message);
		});
	});
});
