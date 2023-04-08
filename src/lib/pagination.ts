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
		totalDocuments: number
	) {
		this.totalDocs = totalDocuments < 0 ? 0 : totalDocuments;
		this.itemsPerPage = this.setItemsPerPage(itemsPerPage);
		this.totalPages = this.calculateTotalPages();
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

	private setItemsPerPage(itemsPerPage: number) {
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

	private calculateTotalPages() {
		if (this.totalDocs < 0) {
			return 0;
		}
		const totalPages = Math.ceil(this.totalDocs / this.itemsPerPage);
		return totalPages < 1 ? 1 : totalPages;
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
