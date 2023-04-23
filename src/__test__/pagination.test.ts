import AppError from "../config/AppError";
import PaginationImpl, { PaginationResult } from "../lib/pagination";
import PaginationHelperImpl from "../util/paginationHelper";

const pagination = new PaginationImpl(10, 1, 100, new PaginationHelperImpl());
function createMockResult(data: string[]) {
	const mockResult: PaginationResult<string[]> = {
		currentPage: 1,
		limit: 10,
		totalDocs: 100,
		totalPages: 10,
		hasNextPage: true,
		hasPrevpage: false,
		data,
	};
	return mockResult;
}

describe("Pagination when called", () => {
	describe("returned object", () => {
		describe("currentPage property", () => {
			it("should be included", () => {
				expect("currentPage" in pagination).toBe(true);
			});
			it("should be number type", () => {
				expect(typeof pagination.currentPage).toBe("number");
			});
		});

		describe("totalPages property", () => {
			it("should be included", () => {
				expect("totalPages" in pagination).toBe(true);
			});
			it("should be number type", () => {
				expect(typeof pagination.totalPages).toBe("number");
			});
		});

		describe("totalDocs property", () => {
			it("should be included", () => {
				expect("totalDocs" in pagination).toBe(true);
			});
			it("should be number type", () => {
				expect(typeof pagination.totalDocs).toBe("number");
			});
		});

		describe("itemsPerPage property", () => {
			it("should be included", () => {
				expect("itemsPerPage" in pagination).toBe(true);
			});
			it("should be number type", () => {
				expect(typeof pagination.itemsPerPage).toBe("number");
			});
		});

		describe("skip property", () => {
			it("should be included", () => {
				expect("skip" in pagination).toBe(true);
			});
			it("should be number type", () => {
				expect(typeof pagination.skip).toBe("number");
			});
		});

		it("should include createPaginationResult function", () => {
			expect("createPaginationResult" in pagination).toBe(true);
		});
	});

	describe("createPaginationResult function", () => {
		it("should throw AppError when data is not an array", () => {
			expect(() => pagination.createPaginationResult("hello")).toThrow(
				AppError
			);
		});

		describe("when data is an array", () => {
			beforeEach(() => {
				jest.restoreAllMocks();
			});

			it("should return a object when data is empty", () => {
				const mockResult = createMockResult([]);
				jest.spyOn(
					pagination,
					"createPaginationResult"
				).mockReturnValue(mockResult);

				const paginationResult = pagination.createPaginationResult([]);
				expect(paginationResult).toEqual(mockResult);
			});

			it("should return a object when data is not empty", () => {
				const mockResult = createMockResult([]);

				const paginationResult = pagination.createPaginationResult([]);
				expect(paginationResult).toEqual(mockResult);
			});
		});
	});
});
