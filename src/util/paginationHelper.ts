import AppError from "../config/AppError";

export interface PaginationHelper {
	validateItemsPerPage(itemsPerPage: number): number;
	validateCurrentPageNumber(currentPage: number): number;
	calculateTotalPages(totalDocs: number, itemsPerPage: number): number;
}

export default class PaginationHelperImpl implements PaginationHelper {
	private readonly _MIN_ITEMS_PER_PAGE = 10;
	private readonly _MAX_ITEMS_PER_PAGE = 30;
	private readonly _FIRST_PAGE_NO = 1;

	public validateItemsPerPage(itemsPerPage: number): number {
		if (itemsPerPage <= 0) {
			return this._MIN_ITEMS_PER_PAGE;
		} else if (itemsPerPage > this._MAX_ITEMS_PER_PAGE) {
			return this._MAX_ITEMS_PER_PAGE;
		}
		return itemsPerPage;
	}

	public validateCurrentPageNumber(currentPage: number): number {
		if (currentPage < this._FIRST_PAGE_NO) {
			return this._FIRST_PAGE_NO;
		}
		return currentPage;
	}

	public calculateTotalPages(
		totalDocs: number,
		itemsPerPage: number
	): number {
		if (totalDocs < 1) {
			return 0;
		}
		if (itemsPerPage < 1) {
			throw new AppError("Invalid value!", 500);
		}
		const totalPages = Math.ceil(totalDocs / itemsPerPage);
		return totalPages < 1 ? 1 : totalPages;
	}
}
