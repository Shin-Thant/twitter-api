import AppError from "../config/AppError";
import { PaginationHelper } from "../util/paginationHelper";

export interface PaginationResult<T> {
	totalPages: number;
	totalDocs: number;
	hasNextPage: boolean;
	hasPrevpage: boolean;
	currentPage: number;
	limit: number;
	data: T;
}

interface IPagination {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	skip: number;

	createPaginationResult<T extends []>(results: T): PaginationResult<T>;
}

export default class PaginationImpl implements IPagination {
	public currentPage: number;
	public totalPages: number;
	public totalDocs: number;
	public itemsPerPage: number;
	public skip: number;

	constructor(
		itemsPerPage: number,
		currentPage: number,
		totalDocuments: number,
		helper: PaginationHelper
	) {
		this.totalDocs = totalDocuments < 0 ? 0 : totalDocuments;
		this.itemsPerPage = helper.validateItemsPerPage(itemsPerPage);
		this.currentPage = helper.validateCurrentPageNumber(currentPage);
		this.totalPages = helper.calculateTotalPages(
			this.totalDocs,
			this.itemsPerPage
		);
		this.skip = (this.currentPage - 1) * this.itemsPerPage;

		// *test logs
		// console.log({
		// 	itemsPerPage: this.itemsPerPage,
		// 	totalPages: this.totalPages,
		// 	currentPage: this.currentPage,
		// 	skip: this.skip,
		// });
	}

	public createPaginationResult<T>(result: T): PaginationResult<T> {
		if (!Array.isArray(result)) {
			throw new AppError("Data must be array!", 500);
		}

		return {
			totalPages: this.totalPages,
			totalDocs: this.totalDocs,
			hasNextPage: this.currentPage !== this.totalPages,
			hasPrevpage: this.currentPage !== 1,
			currentPage: this.currentPage,
			limit: this.itemsPerPage,
			data: result,
		};
	}
}
