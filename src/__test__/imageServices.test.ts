import path from "path";
import {
	checkImageExist,
	getImagePath,
	isValidImageType,
} from "../services/imageServices";
import fs from "fs/promises";

describe("Image Services", () => {
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

	describe("checkImageExist", () => {
		describe("given invalid image path", () => {
			it("should return false", async () => {
				const fakeImagePath = "/fake/path";
				const result = await checkImageExist({ path: fakeImagePath });

				expect(result).toBe(false);
			});
		});

		describe("given valid image path", () => {
			it("should return true", async () => {
				const imageNames = await fs.readdir(
					path.join(__dirname, "..", "..", "public", "uploads")
				);

				const imagePath = getImagePath({ imageName: imageNames[0] });
				const result = await checkImageExist({ path: imagePath });

				expect(result).toBe(true);
			});
		});

		describe("when fs.access() method throws error", () => {
			jest.spyOn(fs, "access").mockImplementation(
				// @ts-ignore
				async (_path: string, _mode?: number) => {
					throw new Error("oops!");
				}
			);

			it("should return false", async () => {
				const result = await checkImageExist({ path: "/fake" });
				expect(result).toBe(false);
			});
		});
	});
});
