interface PaginationResult<Result> {
	totalPages: number;
	hasNextPage: boolean;
	hasPrevpage: boolean;
	currentPage: number;
	itemsPerPage: number;
	data: Result;
}

interface Pagination {
	currentPage: number;
	totalPages: number;
	itemsPerPage: number;
	skip: number;

	// validateItemsPerPage: (itemsPerPage: number) => number;

	createPaginationResult: <ResultType>(
		results: ResultType
	) => PaginationResult<ResultType>;
}

export default class PaginationImpl implements Pagination {
	public currentPage: number;
	public totalPages: number;
	public itemsPerPage: number;
	public skip: number;

	constructor(
		itemsPerPage: number,
		currentPage: number,
		totalDocuments: number
	) {
		this.itemsPerPage = this.validateItemsPerPage(itemsPerPage);
		this.totalPages = this.calculateTotalPages(
			totalDocuments,
			this.itemsPerPage
		);
		this.currentPage = this.validateCurrentPageNumber(currentPage);
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
	): PaginationResult<ResultType> {
		// TODO: check is there any information that should be returned!
		return {
			totalPages: this.totalPages,
			hasNextPage: this.currentPage !== this.totalPages,
			hasPrevpage: this.currentPage !== 1,
			currentPage: this.currentPage,
			itemsPerPage: this.itemsPerPage,
			data: result,
		};
	}

	private validateItemsPerPage(itemsPerPage: number) {
		const MIN_ITEMS_PER_PAGE = 10;
		const MAX_ITEMS_PER_PAGE = 30;

		if (itemsPerPage <= 0) {
			return MIN_ITEMS_PER_PAGE;
		} else if (itemsPerPage > MAX_ITEMS_PER_PAGE) {
			return MAX_ITEMS_PER_PAGE;
		}
		return itemsPerPage;
	}

	private validateCurrentPageNumber(currentPage: number) {
		const FIRST_PAGE_NO = 1;
		if (currentPage < FIRST_PAGE_NO) {
			return FIRST_PAGE_NO;
		}
		return currentPage;
	}

	private calculateTotalPages(totalDocuments: number, itemsPerPage: number) {
		if (totalDocuments < 0) {
			return 0;
		}
		const totalPages = Math.round(totalDocuments / itemsPerPage);
		return totalPages < 1 ? 1 : totalPages;
	}
}
