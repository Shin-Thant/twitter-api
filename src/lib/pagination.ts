import { CommentSchema } from "../models/types/commentTypes";
import { TweetSchema } from "../models/types/tweetTypes";
import { UserSchema } from "../models/types/userTypes";
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

export type ConstructorParam = {
	itemsPerPage: number;
	currentPage: number;
	totalDocs: number;
	helper: PaginationHelper;
};
export default class PaginationImpl {
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
		this.currentPage = helper.validateCurrentPage(currentPage);
		this.skip = (this.currentPage - 1) * this.itemsPerPage;
	}

	public isCurrentPageExceeded() {
		return this.currentPage > this.totalPages;
	}

	public createPaginationResult<
		T extends (UserSchema | TweetSchema | CommentSchema)[]
	>(result: T): PaginationResult<T> {
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
