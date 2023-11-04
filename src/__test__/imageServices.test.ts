import { PathLike } from "fs";
import fs from "fs/promises";
import path from "path";
import {
	checkImageExist,
	deleteManyImages,
	generateManyImageNames,
	getImagePath,
	isValidImageType,
} from "../services/imageServices";

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
				async (_path: PathLike, _mode?: number) => {
					console.log("throw");
					throw new Error("oops!");
				}
			);

			it("should return false", async () => {
				const result = await checkImageExist({ path: "/fake" });
				expect(result).toBe(false);
			});
		});
	});

	describe("deleteManyImages", () => {
		const mockUnlink = jest.fn(async (path: PathLike) => {
			console.log("deleting", path);
		});

		beforeEach(() => {
			fs.unlink = mockUnlink;
		});

		describe("given invalid image names", () => {
			it("it should not call deleteImage()", async () => {
				const invalidImageNames = ["hi", "hello"];

				await deleteManyImages({
					imageNames: invalidImageNames,
				});
				expect(mockUnlink).toBeCalledTimes(0);
			});
		});

		describe("given valid image names", () => {
			const mockAccess = jest.fn(
				async (_path: PathLike, _mode?: number) => {
					console.log("granted", _path);
					// return await Promise.resolve();
				}
			);

			beforeEach(() => {
				fs.access = mockAccess;
			});

			it("it should call deleteImage() with path", async () => {
				const validImageNames = ["valid_img_1.jpg", "valid_img_2.png"];

				await deleteManyImages({
					imageNames: validImageNames,
				});

				expect(mockUnlink).toBeCalledTimes(2);
				validImageNames.forEach((name) => {
					expect(mockUnlink).toBeCalledWith(
						getImagePath({ imageName: name })
					);
				});
			});
		});
	});

	describe("generateManyImageNames", () => {
		describe("given total 3", () => {
			it("should return string array with 3 items", () => {
				const files = [
					{ mimetype: "image/jpg" },
					{ mimetype: "image/png" },
					{ mimetype: "image/jpeg" },
				];
				const result = generateManyImageNames({
					images: files as Express.Multer.File[],
				});
				expect(result.length).toBe(3);
			});
		});
	});
});
