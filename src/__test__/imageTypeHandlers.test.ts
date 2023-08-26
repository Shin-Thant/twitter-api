import { isValidImageType } from "../util/isValidImageType";

describe("imageTypeHandlers", () => {
	describe("isValidImageType", () => {
		describe("given invalid string values", () => {
			it("should return false", () => {
				const randomStringArgs = ["''", "0"];
				const expectedResult = false;

				randomStringArgs.forEach((arg) => {
					const result = isValidImageType(arg);
					expect(result).toBe(expectedResult);
				});
			});
		});

		describe("given invalid image types", () => {
			it("should return false", () => {
				const expectedResult = false;

				const invalidTypes = [
					"image/random",
					"image/svg",
					"video/mp4",
					"jpg",
					"jpeg",
					"png",
				];

				invalidTypes.forEach((mimeType) => {
					const result = isValidImageType(mimeType);
					expect(result).toBe(expectedResult);
				});
			});
		});

		describe("given valid image types", () => {
			it("should return true", () => {
				const expectedResult = true;
				const validMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

				validMimeTypes.forEach((mimeType) => {
					const result = isValidImageType(mimeType);
					expect(result).toBe(expectedResult);
				});
			});
		});
	});
});
