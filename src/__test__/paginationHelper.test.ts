import AppError from "../config/AppError";
import PaginationHelperImpl from "../util/paginationHelper";

const helper = new PaginationHelperImpl();

describe("Pagination Helper", () => {
	describe("validateItemsPerPage", () => {
		describe("given less than or equal 0", () => {
			it("should return 10", () => {
				const invalidNums = [-1, 0];
				invalidNums.forEach((num) => {
					const result = helper.validateItemsPerPage(num);
					expect(result).toBe(10);
				});
			});
		});

		describe("given more than 30", () => {
			it("should return 30", () => {
				const result = helper.validateItemsPerPage(31);
				expect(result).toBe(30);
			});
		});

		describe("given valid value", () => {
			it("should return the same number", () => {
				const validNums = [5, 20];
				validNums.forEach((num) => {
					const result = helper.validateItemsPerPage(num);
					expect(result).toBe(num);
				});
			});
		});
	});

	describe("validateCurrentPage", () => {
		describe("given less than 1", () => {
			it("should return 1", () => {
				const result = helper.validateCurrentPage(0);
				expect(result).toBe(1);
			});
		});

		describe("given more than 1", () => {
			it("should return same number", () => {
				const PAGE_NO = 3;
				const result = helper.validateCurrentPage(PAGE_NO);
				expect(result).toBe(PAGE_NO);
			});
		});
	});

	describe("calculateTotalPages", () => {
		describe("given 0 total documents", () => {
			it("should return 0", () => {
				const result = helper.calculateTotalPages(0, 10);
				expect(result).toBe(0);
			});
		});

		describe("given 0 items per page", () => {
			it("should throw AppError", () => {
				const throwSmth = () => helper.calculateTotalPages(100, 0);
				expect(throwSmth).toThrow(AppError);
			});
		});

		describe("given valid numbers", () => {
			it("should return valid value", () => {
				const validArgs = [
					[100, 10, 10],
					[20, 15, 2],
					[10, 3, 4],
				];

				validArgs.forEach((numArr) => {
					const result = helper.calculateTotalPages(
						numArr[0],
						numArr[1]
					);
					expect(result).toBe(numArr[2]);
				});
			});
		});
	});
});
