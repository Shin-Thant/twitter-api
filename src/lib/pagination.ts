import { PaginationHelper } from "../util/paginationHelper";

export interface PaginationResult<T> {
	totalPages: number;
	totalDocs: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	currentPage: number;
	itemsPerPage: number;
	data: T;
}

interface IPagination {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	skip: number;

	createPaginationResult<T extends []>(results: T): PaginationResult<T>;
}

export type ConstructorParam = {
	itemsPerPage: number;
	currentPage: number;
	totalDocs: number;
	helper: PaginationHelper;
};
export default class PaginationImpl implements IPagination {
	public currentPage: number;
	public totalPages: number;
	public totalDocs: number;
	public itemsPerPage: number;
	public skip: number;

	constructor({
		itemsPerPage,
		currentPage,
		totalDocs,
		helper,
	}: ConstructorParam) {
		this.totalDocs = totalDocs < 0 ? 0 : totalDocs;
		this.itemsPerPage = helper.validateItemsPerPage(itemsPerPage);
		this.totalPages = helper.calculateTotalPages(
			this.totalDocs,
			this.itemsPerPage
		);
		this.currentPage = helper.validateCurrentPageNumber(
			currentPage,
			this.totalPages
		);
		this.skip = (this.currentPage - 1) * this.itemsPerPage;
	}

	public createPaginationResult<T extends []>(
		result: T
	): PaginationResult<T> {
		return {
			totalPages: this.totalPages,
			totalDocs: this.totalDocs,
			hasNextPage: this.currentPage < this.totalPages,
			hasPrevPage: this.currentPage > 1,
			currentPage: this.currentPage,
			itemsPerPage: this.itemsPerPage,
			data: result,
		};
	}
}
