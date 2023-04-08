import { PaginationHelper } from "../util/paginationHelper";

interface IPaginationResult<Result> {
	totalPages: number;
	totalDocs: number;
	hasNextPage: boolean;
	hasPrevpage: boolean;
	currentPage: number;
	limit: number;
	data: Result;
}

interface IPagination {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	skip: number;

	createPaginationResult: <ResultType>(
		results: ResultType
	) => IPaginationResult<ResultType>;
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

	public createPaginationResult<ResultType>(
		result: ResultType
	): IPaginationResult<ResultType> {
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
